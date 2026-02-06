# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (local or Atlas)
- `.env` file configured

## Quick Setup (5 minutes)

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Configure Environment
Create/update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/sole-style-hub
JWT_SECRET=your-secret-key-min-32-characters-long
PORT=3001
```

### 3. Start MongoDB
If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, ensure your connection string is in `.env`

### 4. Create First Admin
```bash
npm run setup-admin
```

Output will show:
```
✅ First admin created successfully!
📧 Email: admin@solestyle.com
🔑 Password: Admin@123
```

### 5. Start Backend Server
```bash
npm run server:watch
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

### 6. Start Frontend (New Terminal)
```bash
npm run dev
```

You should see:
```
VITE ready
Local: http://localhost:5173/
```

### 7. Access Admin Panel
1. Open browser: `http://localhost:5173/admin/login`
2. Login with:
   - Email: `admin@solestyle.com`
   - Password: `Admin@123`
3. **Change password immediately!**

## 📱 Admin Panel URLs

| Page | URL |
|------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Analytics | `/admin/analytics` |
| Orders | `/admin/orders` |
| Products | `/admin/products` |
| Categories | `/admin/categories` |
| Customers | `/admin/customers` |
| Hero Slides | `/admin/hero` |

## 🧪 Test the System

### Create a Test Category
1. Go to `/admin/categories`
2. Click "Add Category"
3. Fill in:
   - Name: "Running Shoes"
   - Parent: "Men"
   - Active: Yes
4. Click "Create"

### Create a Test Product
1. Go to `/admin/products`
2. Click "Add New Product"
3. Fill in all required fields
4. Select the category you created
5. Click "Create"

### View Analytics
1. Go to `/admin/analytics`
2. See your dashboard with charts
3. All metrics update in real-time

## 🔑 Important API Endpoints

### User Registration (Frontend)
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "1234567890"
  })
})
```

### Place Order (Frontend, requires auth)
```javascript
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    items: [...],
    shippingAddress: {...},
    totalAmount: 1000,
    paymentMethod: "COD"
  })
})
```

### Get Analytics (Admin)
```javascript
fetch('/api/admin/analytics/overview', {
  headers: {
    'Authorization': 'Bearer ADMIN_TOKEN'
  }
})
```

## 🛠️ Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend dev server |
| `npm run server:watch` | Start backend with auto-reload |
| `npm run setup-admin` | Create first admin |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |

## 🔍 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Check connection string in .env
echo $MONGODB_URI
```

### JWT Token Error
```bash
# Ensure JWT_SECRET is set in .env and is at least 32 characters
# Restart server after changing .env
```

### Admin Already Exists
```bash
# If you need to create a new admin, delete the old one from MongoDB first
# Or use the admin management page to create sub-admins
```

### Port Already in Use
```bash
# Backend (3001)
lsof -ti:3001 | xargs kill

# Frontend (5173)
lsof -ti:5173 | xargs kill
```

## 📊 Default Admin Permissions

Full Admin has all permissions:
- ✅ Manage Products
- ✅ Manage Orders
- ✅ Manage Categories
- ✅ Manage Customers
- ✅ Manage Admins
- ✅ View Analytics

## 🎯 First Tasks After Setup

1. ✅ Change admin password
2. ✅ Create main categories (Men, Women, Kids)
3. ✅ Add subcategories
4. ✅ Add products
5. ✅ Test order creation
6. ✅ Check analytics dashboard
7. ✅ Create sub-admin if needed

## 📚 Documentation Files

- `IMPLEMENTATION_GUIDE.md` - Complete feature documentation
- `IMPLEMENTATION_COMPLETE.md` - Implementation summary
- `QUICK_START.md` - This file
- `MONGODB_USAGE.md` - Database documentation
- `CLOUDINARY_SETUP.md` - Image upload setup
- `ADMIN_DASHBOARD.md` - Admin panel guide

## 🚨 Important Notes

⚠️ **Security:**
- Change default admin password immediately
- Use strong JWT_SECRET in production
- Keep .env file secure and never commit it
- Use HTTPS in production

⚠️ **Before Production:**
- Set up proper MongoDB backup
- Configure production environment variables
- Set up proper logging
- Add rate limiting
- Enable CORS properly

## ✅ Checklist

- [ ] MongoDB running
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Admin account created
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Admin panel accessible
- [ ] Password changed
- [ ] Test order created
- [ ] Analytics working

## 🎉 You're All Set!

Your complete e-commerce system is now running!

**Need help?** Check the full documentation in `IMPLEMENTATION_GUIDE.md`
