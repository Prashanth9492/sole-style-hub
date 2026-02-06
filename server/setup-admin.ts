import { getDatabase } from './db';
import { hashPassword } from './utils/helpers';
import { AdminRole } from './models/Admin';

async function createFirstAdmin() {
  try {
    const db = await getDatabase();
    
    // Check if any admin exists
    const existingAdmin = await db.collection('admins').findOne({});
    
    if (existingAdmin) {
      console.log('❌ Admin already exists. Cannot create another admin through this script.');
      console.log('👤 Existing admin:', existingAdmin.email);
      process.exit(0);
    }

    // Create first admin
    const admin = {
      name: 'Admin User',
      email: 'admin@solestyle.com',
      password: await hashPassword('Admin@123'),
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

    const result = await db.collection('admins').insertOne(admin);
    
    console.log('✅ First admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  Please change the password after first login!');
    console.log('\n🌐 Admin login URL: http://localhost:5173/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createFirstAdmin();
