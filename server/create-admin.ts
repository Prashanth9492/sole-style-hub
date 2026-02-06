// Quick script to create default admin
// Run with: npm run ts-node server/create-admin.ts

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prashanth:prashanth@cluster0.mcuwliu.mongodb.net/?appName=Cluster0';

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db();
    const adminsCollection = db.collection('admins');
    
    // Check if admin exists
    const existingAdmin = await adminsCollection.findOne({});
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('\nIf you forgot your password, you need to reset it in the database.');
      return;
    }
    
    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = {
      name: 'Admin',
      email: 'admin@solestyle.com',
      password: hashedPassword,
      role: 'admin',
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
    
    await adminsCollection.insertOne(admin);
    
    console.log('\n✅ Admin created successfully!');
    console.log('\n📧 Email: admin@solestyle.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change this password after first login!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
