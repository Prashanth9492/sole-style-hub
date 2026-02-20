import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { IOrder, OrderStatus, PaymentStatus, collectionName } from '../models/Order';
import { authenticateUser, authenticateAdmin, AuthRequest } from '../middleware/auth';
import { generateOrderNumber } from '../utils/helpers';
import { createRazorpayOrder } from '../razorpay';

const router = express.Router();

// Create new order (User)
router.post('/orders', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const { items, shippingAddress, paymentMethod, totalAmount, discount, shippingCharges, taxAmount, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const orderNumber = generateOrderNumber();
    const finalAmount = totalAmount - (discount || 0) + (shippingCharges || 0) + (taxAmount || 0);

    // Create Razorpay order if payment method is online
    let razorpayOrder = null;
    if (paymentMethod === 'ONLINE' || paymentMethod === 'RAZORPAY') {
      try {
        razorpayOrder = await createRazorpayOrder(finalAmount, 'INR', orderNumber);
      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ error: 'Failed to create payment order' });
      }
    }

    const order: IOrder = {
      orderNumber,
      userId: new ObjectId(req.user!.userId),
      userEmail: req.user!.email,
      userName: shippingAddress.name,
      items: items.map((item: any) => ({
        productId: new ObjectId(item.productId),
        productName: item.productName,
        productImage: item.productImage,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        subtotal: item.quantity * (item.price - (item.discount || 0))
      })),
      totalAmount,
      discount: discount || 0,
      shippingCharges: shippingCharges || 0,
      taxAmount: taxAmount || 0,
      finalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.PENDING,
      razorpayOrderId: razorpayOrder?.id || razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderStatus: OrderStatus.PLACED,
      statusHistory: [{
        status: OrderStatus.PLACED,
        timestamp: new Date(),
        comment: 'Order placed successfully'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(order);
    
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: result.insertedId,
      orderNumber: order.orderNumber,
      razorpayOrder: razorpayOrder ? {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SBkFF4ycVcZJRl'
      } : null
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders for current user
router.get('/orders/my-orders', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    
    const orders = await db.collection(collectionName)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate missing product images
    const ordersWithImages = await Promise.all(orders.map(async (order: any) => {
      const itemsWithImages = await Promise.all(order.items.map(async (item: any) => {
        // If product image is missing, fetch it from products collection
        if (!item.productImage && item.productId) {
          try {
            const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
            if (product && product.images && product.images.length > 0) {
              item.productImage = product.images[0];
            }
          } catch (err) {
            console.error('Error fetching product image:', err);
          }
        }
        return item;
      }));
      
      return {
        ...order,
        items: itemsWithImages
      };
    }));

    res.json(ordersWithImages);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (User)
router.get('/orders/:id', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const orderId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user!.userId);

    const order = await db.collection(collectionName).findOne({
      _id: orderId,
      userId
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Populate missing product images
    const itemsWithImages = await Promise.all((order as any).items.map(async (item: any) => {
      if (!item.productImage && item.productId) {
        try {
          const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
          if (product && product.images && product.images.length > 0) {
            item.productImage = product.images[0];
          }
        } catch (err) {
          console.error('Error fetching product image:', err);
        }
      }
      return item;
    }));

    const orderWithImages = {
      ...order,
      items: itemsWithImages
    };

    res.json(orderWithImages);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (Admin)
router.get('/admin/orders', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter: any = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      db.collection(collectionName)
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      db.collection(collectionName).countDocuments(filter)
    ]);

    // Populate missing product images for all orders
    const ordersWithImages = await Promise.all(orders.map(async (order: any) => {
      const itemsWithImages = await Promise.all(order.items.map(async (item: any) => {
        if (!item.productImage && item.productId) {
          try {
            const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
            if (product && product.images && product.images.length > 0) {
              item.productImage = product.images[0];
            }
          } catch (err) {
            console.error('Error fetching product image:', err);
          }
        }
        return item;
      }));
      
      return {
        ...order,
        items: itemsWithImages
      };
    }));

    res.json({
      orders: ordersWithImages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (Admin)
router.get('/admin/orders/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const orderId = new ObjectId(req.params.id);

    const order = await db.collection(collectionName).findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Populate missing product images
    const itemsWithImages = await Promise.all((order as any).items.map(async (item: any) => {
      if (!item.productImage && item.productId) {
        try {
          const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) });
          if (product && product.images && product.images.length > 0) {
            item.productImage = product.images[0];
          }
        } catch (err) {
          console.error('Error fetching product image:', err);
        }
      }
      return item;
    }));

    const orderWithImages = {
      ...order,
      items: itemsWithImages
    };

    res.json(orderWithImages);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (Admin)
router.patch('/admin/orders/:id/status', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const orderId = new ObjectId(req.params.id as string);
    const { status, comment, trackingNumber } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updateData: any = {
      orderStatus: status,
      updatedAt: new Date()
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    if (status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
      if (comment) {
        updateData.cancellationReason = comment;
      }
    }

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: orderId },
      { 
        $set: updateData,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            comment: comment || `Order status updated to ${status}`
          }
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: result });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status (Admin/System)
router.patch('/admin/orders/:id/payment', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const orderId = new ObjectId(req.params.id);
    const { paymentStatus, paymentId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!Object.values(PaymentStatus).includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const updateData: any = {
      paymentStatus,
      updatedAt: new Date()
    };

    if (paymentId) updateData.paymentId = paymentId;
    if (razorpayPaymentId) updateData.razorpayPaymentId = razorpayPaymentId;
    if (razorpaySignature) updateData.razorpaySignature = razorpaySignature;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: orderId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Payment status updated successfully', order: result });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Cancel order (User)
router.patch('/orders/:id/cancel', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const orderId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user!.userId);
    const { reason } = req.body;

    const order = await db.collection(collectionName).findOne({
      _id: orderId,
      userId
    }) as IOrder | null;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation if order is not yet shipped
    if ([OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED].includes(order.orderStatus)) {
      return res.status(400).json({ error: 'Cannot cancel order after it has been shipped' });
    }

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
          cancellationReason: reason || 'Cancelled by customer',
          updatedAt: new Date()
        },
        $push: {
          statusHistory: {
            status: OrderStatus.CANCELLED,
            timestamp: new Date(),
            comment: reason || 'Cancelled by customer'
          }
        }
      },
      { returnDocument: 'after' }
    );

    res.json({ message: 'Order cancelled successfully', order: result });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get order statistics (Admin)
router.get('/admin/orders/stats/summary', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const stats = await db.collection(collectionName).aggregate([
      {
        $facet: {
          totalOrders: [{ $count: 'count' }],
          totalRevenue: [
            { $match: { paymentStatus: PaymentStatus.PAID } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
          ],
          ordersByStatus: [
            { $group: { _id: '$orderStatus', count: { $count: {} } } }
          ],
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]).toArray();

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

export default router;
