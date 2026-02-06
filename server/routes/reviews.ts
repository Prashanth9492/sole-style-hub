import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { IReview, collectionName } from '../models/Review';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { OrderStatus } from '../models/Order';

const router = express.Router();

// Create a review (User - only for delivered orders)
router.post('/reviews', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const { productId, orderId, rating, title, comment, images, videos } = req.body;

    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({ error: 'Product ID, Order ID, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify order exists and belongs to user
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId),
      userId: new ObjectId(req.user!.userId)
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order is delivered
    if (order.orderStatus !== OrderStatus.DELIVERED) {
      return res.status(400).json({ error: 'You can only review products from delivered orders' });
    }

    // Check if product is in the order
    const productInOrder = order.items.find((item: any) => 
      item.productId.toString() === productId
    );

    if (!productInOrder) {
      return res.status(400).json({ error: 'Product not found in this order' });
    }

    // Check if user has already reviewed this product
    const existingReview = await db.collection(collectionName).findOne({
      productId: new ObjectId(productId),
      userId: new ObjectId(req.user!.userId)
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review: IReview = {
      productId: new ObjectId(productId),
      userId: new ObjectId(req.user!.userId),
      orderId: new ObjectId(orderId),
      userName: (req.user as any).name || req.user!.email.split('@')[0],
      userEmail: req.user!.email,
      rating: Number(rating),
      title: title || '',
      comment,
      images: images || [],
      videos: videos || [],
      isVerifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(review);

    // Update product average rating
    await updateProductRating(db, productId);

    res.status(201).json({
      message: 'Review created successfully',
      reviewId: result.insertedId,
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get reviews for a product
router.get('/reviews/product/:productId', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const productIdStr = Array.isArray(productId) ? productId[0] : productId;
    const filter: any = { productId: new ObjectId(productIdStr) };
    
    if (rating) {
      filter.rating = Number(rating);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total, stats] = await Promise.all([
      db.collection(collectionName)
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      db.collection(collectionName).countDocuments(filter),
      db.collection(collectionName).aggregate([
        { $match: { productId: new ObjectId(productIdStr) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
          }
        }
      ]).toArray()
    ]);

    res.json({
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      stats: stats[0] || {
        averageRating: 0,
        totalReviews: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Check if user can review a product from an order
router.get('/reviews/can-review/:orderId/:productId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const { orderId, productId } = req.params;
    const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;
    const productIdStr = Array.isArray(productId) ? productId[0] : productId;

    // Check if user has already reviewed this product
    const existingReview = await db.collection(collectionName).findOne({
      productId: new ObjectId(productIdStr),
      userId: new ObjectId(req.user!.userId)
    });

    if (existingReview) {
      return res.json({ canReview: false, reason: 'Already reviewed' });
    }

    // Check order
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderIdStr),
      userId: new ObjectId(req.user!.userId)
    });

    if (!order) {
      return res.json({ canReview: false, reason: 'Order not found' });
    }

    if (order.orderStatus !== OrderStatus.DELIVERED) {
      return res.json({ canReview: false, reason: 'Order not delivered yet' });
    }

    const productInOrder = order.items.find((item: any) => 
      item.productId.toString() === productIdStr
    );

    if (!productInOrder) {
      return res.json({ canReview: false, reason: 'Product not in order' });
    }

    res.json({ canReview: true });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({ error: 'Failed to check review eligibility' });
  }
});

// Get list of products user has already reviewed from a specific order
router.get('/reviews/user-reviews/:orderId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const { orderId } = req.params;
    const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;

    // Get all reviews by this user for products in this order
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderIdStr),
      userId: new ObjectId(req.user!.userId)
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const productIds = order.items.map((item: any) => new ObjectId(item.productId));

    const reviews = await db.collection(collectionName).find({
      userId: new ObjectId(req.user!.userId),
      productId: { $in: productIds }
    }).toArray();

    const reviewedProductIds = reviews.map(review => review.productId.toString());

    res.json({ reviewedProductIds });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Mark review as helpful
router.post('/reviews/:id/helpful', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(idStr) },
      { $inc: { helpfulCount: 1 } }
    );

    res.json({ message: 'Review marked as helpful' });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ error: 'Failed to mark review as helpful' });
  }
});

// Helper function to update product average rating
async function updateProductRating(db: any, productId: string) {
  try {
    const stats = await db.collection(collectionName).aggregate([
      { $match: { productId: new ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]).toArray();

    if (stats.length > 0) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: stats[0].totalReviews,
            updatedAt: new Date()
          }
        }
      );
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

export default router;
