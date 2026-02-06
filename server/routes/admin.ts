import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { IAdmin, AdminRole, collectionName } from '../models/Admin';
import { authenticateAdmin, AuthRequest, generateToken } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/helpers';

const router = express.Router();

// Admin Login
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await db.collection(collectionName).findOne({
      email: email.toLowerCase()
    }) as IAdmin | null;

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: 'Your account is inactive. Please contact administrator.' });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: admin._id!.toString(),
      email: admin.email,
      role: admin.role
    });

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id!.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Create first admin (Only if no admins exist - for initial setup)
router.post('/admin/setup', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    
    // Check if any admin already exists
    const existingAdmin = await db.collection(collectionName).findOne({});
    if (existingAdmin) {
      return res.status(403).json({ error: 'Admin setup already completed' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await hashPassword(password);

    const admin: IAdmin = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: AdminRole.ADMIN,
      permissions: {
        canManageProducts: true,
        canManageOrders: true,
        canManageCategories: true,
        canManageCustomers: true,
        canManageAdmins: true,
        canViewAnalytics: true
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(admin);

    res.status(201).json({
      message: 'Admin created successfully',
      adminId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Get current admin profile
router.get('/admin/profile', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const adminId = new ObjectId(req.user!.userId);

    const admin = await db.collection(collectionName).findOne(
      { _id: adminId },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ error: 'Failed to fetch admin profile' });
  }
});

// Update admin profile
router.put('/admin/profile', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const adminId = new ObjectId(req.user!.userId);
    const { name } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: adminId },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ message: 'Profile updated successfully', admin: result });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change admin password
router.put('/admin/change-password', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const adminId = new ObjectId(req.user!.userId);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const admin = await db.collection(collectionName).findOne({ _id: adminId }) as IAdmin | null;
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isPasswordValid = await comparePassword(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.collection(collectionName).updateOne(
      { _id: adminId },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get all admins (Admin only)
router.get('/admin/admins', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Only full admins can view other admins
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only full admins can view admin list' });
    }

    const db = await getDatabase();

    const admins = await db.collection(collectionName)
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Create new admin/sub-admin (Admin only)
router.post('/admin/admins', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Only full admins can create new admins
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only full admins can create new admins' });
    }

    const db = await getDatabase();
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    // Check if admin already exists
    const existingAdmin = await db.collection(collectionName).findOne({
      email: email.toLowerCase()
    });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const admin: IAdmin = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      permissions: permissions || {
        canManageProducts: role === AdminRole.ADMIN,
        canManageOrders: role === AdminRole.ADMIN,
        canManageCategories: role === AdminRole.ADMIN,
        canManageCustomers: role === AdminRole.ADMIN,
        canManageAdmins: false,
        canViewAnalytics: role === AdminRole.ADMIN
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(collectionName).insertOne(admin);

    res.status(201).json({
      message: 'Admin created successfully',
      admin: { ...admin, _id: result.insertedId, password: undefined }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Update admin (Admin only)
router.put('/admin/admins/:id', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Only full admins can update other admins
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only full admins can update admins' });
    }

    const db = await getDatabase();
    const adminId = new ObjectId(req.params.id);
    const { name, role, permissions, isActive } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: adminId },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ message: 'Admin updated successfully', admin: result });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
});

// Delete admin (Admin only)
router.delete('/admin/admins/:id', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Only full admins can delete other admins
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only full admins can delete admins' });
    }

    const db = await getDatabase();
    const adminId = new ObjectId(req.params.id);

    // Prevent deleting yourself
    if (adminId.toString() === req.user!.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await db.collection(collectionName).deleteOne({ _id: adminId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

export default router;
