import express, { Request, Response } from 'express';
import { getDatabase } from '../db';
import { authenticateAdmin } from '../middleware/auth';
import { PaymentStatus, OrderStatus } from '../models/Order';

const router = express.Router();

// Get dashboard overview stats
router.get('/admin/analytics/overview', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const [products, orders, customers] = await Promise.all([
      // Product stats
      db.collection('products').aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            inStock: [
              { $match: { stock: { $gt: 0 }, isActive: true } },
              { $count: 'count' }
            ],
            outOfStock: [
              { $match: { stock: { $lte: 0 } } },
              { $count: 'count' }
            ],
            featured: [
              { $match: { isFeatured: true, isActive: true } },
              { $count: 'count' }
            ]
          }
        }
      ]).toArray(),

      // Order stats
      db.collection('orders').aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            revenue: [
              { $match: { paymentStatus: PaymentStatus.PAID } },
              { $group: { _id: null, total: { $sum: '$finalAmount' } } }
            ],
            pending: [
              { $match: { orderStatus: { $in: [OrderStatus.PLACED, OrderStatus.CONFIRMED] } } },
              { $count: 'count' }
            ],
            delivered: [
              { $match: { orderStatus: OrderStatus.DELIVERED } },
              { $count: 'count' }
            ],
            cancelled: [
              { $match: { orderStatus: OrderStatus.CANCELLED } },
              { $count: 'count' }
            ]
          }
        }
      ]).toArray(),

      // Customer stats
      db.collection('users').aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            active: [
              { $match: { isBlocked: false } },
              { $count: 'count' }
            ],
            blocked: [
              { $match: { isBlocked: true } },
              { $count: 'count' }
            ]
          }
        }
      ]).toArray()
    ]);

    res.json({
      products: {
        total: products[0].total[0]?.count || 0,
        inStock: products[0].inStock[0]?.count || 0,
        outOfStock: products[0].outOfStock[0]?.count || 0,
        featured: products[0].featured[0]?.count || 0
      },
      orders: {
        total: orders[0].total[0]?.count || 0,
        revenue: orders[0].revenue[0]?.total || 0,
        pending: orders[0].pending[0]?.count || 0,
        delivered: orders[0].delivered[0]?.count || 0,
        cancelled: orders[0].cancelled[0]?.count || 0
      },
      customers: {
        total: customers[0].total[0]?.count || 0,
        active: customers[0].active[0]?.count || 0,
        blocked: customers[0].blocked[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// Get sales over time (for line chart)
router.get('/admin/analytics/sales-over-time', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { period = '30days' } = req.query;

    let startDate = new Date();
    let groupBy: any;

    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '12months':
        startDate.setMonth(startDate.getMonth() - 12);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const salesData = await db.collection('orders').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: PaymentStatus.PAID
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$finalAmount' },
          orders: { $count: {} }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]).toArray();

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales over time:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// Get orders by category (for pie chart)
router.get('/admin/analytics/orders-by-category', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const categoryData = await db.collection('orders').aggregate([
      {
        $match: {
          paymentStatus: PaymentStatus.PAID
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          orders: { $sum: 1 },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]).toArray();

    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching orders by category:', error);
    res.status(500).json({ error: 'Failed to fetch category data' });
  }
});

// Get top selling products
router.get('/admin/analytics/top-products', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { limit = 10 } = req.query;

    const topProducts = await db.collection('orders').aggregate([
      {
        $match: {
          paymentStatus: PaymentStatus.PAID
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
          orderCount: { $count: {} }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: Number(limit)
      }
    ]).toArray();

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Get recent activities
router.get('/admin/analytics/recent-activities', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const [recentOrders, recentCustomers] = await Promise.all([
      db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .project({
          orderNumber: 1,
          userName: 1,
          finalAmount: 1,
          orderStatus: 1,
          createdAt: 1
        })
        .toArray(),

      db.collection('users')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .project({
          name: 1,
          email: 1,
          createdAt: 1
        })
        .toArray()
    ]);

    res.json({
      recentOrders,
      recentCustomers
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

// Get revenue analytics
router.get('/admin/analytics/revenue', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [todayRevenue, monthRevenue, lastMonthRevenue] = await Promise.all([
      db.collection('orders').aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            paymentStatus: PaymentStatus.PAID
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalAmount' },
            count: { $count: {} }
          }
        }
      ]).toArray(),

      db.collection('orders').aggregate([
        {
          $match: {
            createdAt: { $gte: thisMonth },
            paymentStatus: PaymentStatus.PAID
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalAmount' },
            count: { $count: {} }
          }
        }
      ]).toArray(),

      db.collection('orders').aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lt: thisMonth },
            paymentStatus: PaymentStatus.PAID
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalAmount' },
            count: { $count: {} }
          }
        }
      ]).toArray()
    ]);

    const todayRev = todayRevenue[0]?.total || 0;
    const monthRev = monthRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    
    const monthGrowth = lastMonthRev > 0 
      ? ((monthRev - lastMonthRev) / lastMonthRev * 100).toFixed(2)
      : 0;

    res.json({
      today: {
        revenue: todayRev,
        orders: todayRevenue[0]?.count || 0
      },
      thisMonth: {
        revenue: monthRev,
        orders: monthRevenue[0]?.count || 0
      },
      lastMonth: {
        revenue: lastMonthRev,
        orders: lastMonthRevenue[0]?.count || 0
      },
      growth: monthGrowth
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

export default router;
