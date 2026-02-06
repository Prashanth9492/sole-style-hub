import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db';
import { IAddress } from '../models/User';
import { authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all addresses for current user
router.get('/addresses', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);

    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { addresses: 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.addresses || []);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add new address
router.post('/addresses', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const { name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        error: 'Name, phone, address line 1, city, state, and pincode are required'
      });
    }

    const address: IAddress = {
      _id: new ObjectId(),
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    };

    // If this is set as default, unset other defaults
    const updateOps: any = {
      $push: { addresses: address },
      $set: { updatedAt: new Date() }
    };

    if (address.isDefault) {
      // First, unset all other defaults
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId },
      updateOps,
      { returnDocument: 'after', projection: { addresses: 1 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json({
      message: 'Address added successfully',
      address,
      addresses: result.addresses
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Update address
router.put('/addresses/:addressId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const addressId = new ObjectId(req.params.addressId);
    const { name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    const updateFields: any = {};
    if (name) updateFields['addresses.$.name'] = name;
    if (phone) updateFields['addresses.$.phone'] = phone;
    if (addressLine1) updateFields['addresses.$.addressLine1'] = addressLine1;
    if (addressLine2 !== undefined) updateFields['addresses.$.addressLine2'] = addressLine2;
    if (city) updateFields['addresses.$.city'] = city;
    if (state) updateFields['addresses.$.state'] = state;
    if (pincode) updateFields['addresses.$.pincode'] = pincode;
    if (isDefault !== undefined) updateFields['addresses.$.isDefault'] = isDefault;
    updateFields.updatedAt = new Date();

    // If setting as default, first unset all other defaults
    if (isDefault) {
      await db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: updateFields },
      { returnDocument: 'after', projection: { addresses: 1 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({
      message: 'Address updated successfully',
      addresses: result.addresses
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/addresses/:addressId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const addressId = new ObjectId(req.params.addressId);

    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId },
      {
        $pull: { addresses: { _id: addressId } },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after', projection: { addresses: 1 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Address deleted successfully',
      addresses: result.addresses
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set default address
router.patch('/addresses/:addressId/default', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const userId = new ObjectId(req.user!.userId);
    const addressId = new ObjectId(req.params.addressId);

    // First, unset all defaults
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { 'addresses.$[].isDefault': false } }
    );

    // Then set the selected address as default
    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      {
        $set: {
          'addresses.$.isDefault': true,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after', projection: { addresses: 1 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({
      message: 'Default address updated successfully',
      addresses: result.addresses
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

export default router;
