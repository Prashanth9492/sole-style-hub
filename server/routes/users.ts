import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { IUser, collectionName } from '../models/User';
import { authenticateUser, authenticateAdmin, AuthRequest, generateToken } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/helpers';

const router = express.Router();

// Firebase Auth Sync - Create or login user from Firebase
router.post('/auth/firebase-sync', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { uid, email, name, phone } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'Firebase UID and email are required' });
    }

    // Check if user exists by email or Firebase UID
    let user = await db.collection(collectionName).findOne({
      $or: [
        { email: email.toLowerCase() },
        { firebaseUid: uid }
      ]
    }) as IUser | null;

    let userId: string;

    if (user) {
      // Update existing user with Firebase UID if not set
      if (!user.firebaseUid) {
        await db.collection(collectionName).updateOne(
          { _id: user._id },
          { 
            $set: { 
              firebaseUid: uid,
              updatedAt: new Date() 
            } 
          }
        );
      }
      userId = user._id!.toString();
    } else {
      // Create new user
      const newUser: IUser = {
        firebaseUid: uid,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: '', // No password for Firebase users
        phone: phone || '',
        addresses: [],
        orderHistory: [],
        wishlist: [],
        cart: [],
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection(collectionName).insertOne(newUser);
      userId = result.insertedId.toString();
      user = { ...newUser, _id: result.insertedId };
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
    }

    const token = generateToken({
      userId,
      email: user.email,
      role: 'user'
    });

    res.json({
      message: 'Firebase sync successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error syncing Firebase user:', error);
    res.status(500).json({ error: 'Failed to sync Firebase user' });
  }
});

// User Registration
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection(collectionName).findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user: IUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      addresses: [],
      orderHistory: [],
      wishlist: [],
      cart: [],
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(user);
    const userId = result.insertedId.toString();

    const token = generateToken({
      userId,
      email: user.email,
      role: 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User Login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.collection(collectionName).findOne({
      email: email.toLowerCase()
    }) as IUser | null;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: 'user'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user profile
router.get('/users/profile', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);

    const user = await db.collection(collectionName).findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/users/profile', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const { name, phone } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: result });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/users/change-password', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await db.collection(collectionName).findOne({ _id: userId }) as IUser | null;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.collection(collectionName).updateOne(
      { _id: userId },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Add to wishlist
router.post('/users/wishlist/:productId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const productId = new ObjectId(req.params.productId);

    await db.collection(collectionName).updateOne(
      { _id: userId },
      {
        $addToSet: { wishlist: productId },
        $set: { updatedAt: new Date() }
      }
    );

    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/users/wishlist/:productId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const productId = new ObjectId(req.params.productId);

    await db.collection(collectionName).updateOne(
      { _id: userId },
      {
        $pull: { wishlist: productId },
        $set: { updatedAt: new Date() }
      }
    );

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Get all customers (Admin)
router.get('/admin/customers', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { page = 1, limit = 20, search, blocked } = req.query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (blocked !== undefined) {
      filter.isBlocked = blocked === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      db.collection(collectionName)
        .find(filter, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      db.collection(collectionName).countDocuments(filter)
    ]);

    res.json({
      customers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID (Admin)
router.get('/admin/customers/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const customerId = new ObjectId(req.params.id);

    const customer = await db.collection(collectionName).findOne(
      { _id: customerId },
      { projection: { password: 0 } }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get order history
    const orders = await db.collection('orders')
      .find({ userId: customerId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ ...customer, orders });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Block/Unblock customer (Admin)
router.patch('/admin/customers/:id/block', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const customerId = new ObjectId(req.params.id);
    const { isBlocked } = req.body;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: customerId },
      { $set: { isBlocked, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: `Customer ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      customer: result
    });
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({ error: 'Failed to update customer status' });
  }
});

// Get customer statistics (Admin)
router.get('/admin/customers/stats/summary', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const stats = await db.collection(collectionName).aggregate([
      {
        $facet: {
          totalCustomers: [{ $count: 'count' }],
          activeCustomers: [
            { $match: { isBlocked: false } },
            { $count: 'count' }
          ],
          blockedCustomers: [
            { $match: { isBlocked: true } },
            { $count: 'count' }
          ],
          recentCustomers: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $project: { password: 0 } }
          ]
        }
      }
    ]).toArray();

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    res.status(500).json({ error: 'Failed to fetch customer statistics' });
  }
});

export default router;
