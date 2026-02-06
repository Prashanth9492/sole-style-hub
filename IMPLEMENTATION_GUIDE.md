# 🛍️ Sole Style Hub - Complete E-Commerce System

## 📋 Overview

A comprehensive e-commerce management system with full order, category, customer, and admin management capabilities.

## 🆕 New Features Implemented

### 1. 📦 Order Management
- **User Features:**
  - Place orders with multiple items
  - View order history
  - Track order status
  - Cancel orders (before shipping)
  
- **Admin Features:**
  - View all orders with filters (status, date range)
  - Update order status (Placed → Confirmed → Packed → Shipped → Delivered)
  - Add tracking numbers
  - Update payment status
  - View detailed order information

### 2. 🏷️ Category Management
- **Admin Features:**
  - Add, edit, delete categories
  - Create subcategories under Men, Women, Kids
  - Set category hierarchy
  - Toggle active/inactive status
  - Manage sort order
  - Prevention of deletion if products exist

### 3. 👥 Customer Management
- **Features:**
  - JWT-based authentication
  - User registration and login
  - Password management
  - Multiple address support
  - Wishlist functionality
  
- **Admin Features:**
  - View all customers
  - Search customers
  - View customer order history
  - Block/unblock customers
  - View customer addresses

### 4. 📊 Analytics Dashboard
- **Metrics:**
  - Total products, orders, customers
  - In-stock vs out-of-stock products
  - Revenue tracking (today, this month, all-time)
  - Order status distribution
  
- **Charts:**
  - Sales over time (line chart)
  - Orders by category (pie chart)
  - Top-selling products (bar chart)

### 5. 📍 Address Management
- Users can add, edit, delete multiple addresses
- Set default address
- Select address during checkout

### 6. 🔐 Admin Authentication & Roles
- Secure admin login with JWT
- Role-based access control (Admin vs Sub-admin)
- Customizable permissions per role

## 🗄️ Database Models

### User Model
```typescript
{
  name: string
  email: string
  password: string (hashed)
  phone: string
  addresses: Address[]
  orderHistory: ObjectId[]
  wishlist: ObjectId[]
  cart: CartItem[]
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Order Model
```typescript
{
  orderNumber: string (auto-generated)
  userId: ObjectId
  userEmail: string
  userName: string
  items: OrderItem[]
  totalAmount: number
  discount: number
  shippingCharges: number
  taxAmount: number
  finalAmount: number
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: "Pending" | "Paid" | "Failed"
  orderStatus: "Placed" | "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled"
  statusHistory: StatusUpdate[]
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}
```

### Category Model
```typescript
{
  name: string
  slug: string (auto-generated)
  description?: string
  parentCategory?: "Men" | "Women" | "Kids"
  image?: string
  subCategories: SubCategory[]
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
```

### Admin Model
```typescript
{
  name: string
  email: string
  password: string (hashed)
  role: "admin" | "sub-admin"
  permissions: {
    canManageProducts: boolean
    canManageOrders: boolean
    canManageCategories: boolean
    canManageCustomers: boolean
    canManageAdmins: boolean
    canViewAnalytics: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login
- `POST /api/admin/setup` - Create first admin (one-time)

### Orders
- `POST /api/orders` - Create order (User)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/cancel` - Cancel order (User)
- `GET /api/admin/orders` - Get all orders (Admin)
- `PATCH /api/admin/orders/:id/status` - Update order status (Admin)
- `PATCH /api/admin/orders/:id/payment` - Update payment status (Admin)

### Categories
- `GET /api/categories` - Get all categories (Public)
- `GET /api/categories/:id` - Get category by ID/slug
- `POST /api/admin/categories` - Create category (Admin)
- `PUT /api/admin/categories/:id` - Update category (Admin)
- `DELETE /api/admin/categories/:id` - Delete category (Admin)
- `POST /api/admin/categories/:id/subcategories` - Add subcategory (Admin)

### Customers
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/admin/customers` - Get all customers (Admin)
- `GET /api/admin/customers/:id` - Get customer details (Admin)
- `PATCH /api/admin/customers/:id/block` - Block/unblock customer (Admin)

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PATCH /api/addresses/:id/default` - Set default address

### Analytics
- `GET /api/admin/analytics/overview` - Dashboard overview
- `GET /api/admin/analytics/sales-over-time` - Sales trends
- `GET /api/admin/analytics/orders-by-category` - Category breakdown
- `GET /api/admin/analytics/top-products` - Best sellers
- `GET /api/admin/analytics/revenue` - Revenue metrics

## 🚀 Setup Instructions

### 1. Environment Variables
Add to your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/sole-style-hub
# or
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sole-style-hub

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

### 2. Install Dependencies
Already included in package.json:
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cookie-parser` - Cookie handling
- `recharts` - Analytics charts

### 3. Create First Admin
Run this once to create your first admin account:
```bash
curl -X POST http://localhost:3001/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@solestyle.com",
    "password": "SecurePassword123!"
  }'
```

### 4. Start the Server
```bash
npm run server:watch
```

### 5. Start the Frontend
```bash
npm run dev
```

## 📱 Admin Panel Access

### Login
Navigate to: `http://localhost:5173/admin/login`

### Admin Pages
- **Dashboard:** `/admin/dashboard` - Overview and quick actions
- **Analytics:** `/admin/analytics` - Charts and insights
- **Orders:** `/admin/orders` - Manage all orders
- **Products:** `/admin/products` - Manage products
- **Categories:** `/admin/categories` - Manage categories
- **Customers:** `/admin/customers` - View and manage customers
- **Hero Slides:** `/admin/hero` - Manage homepage hero slides

## 🔒 Security Features

1. **Password Hashing:** All passwords are hashed using bcryptjs
2. **JWT Authentication:** Secure token-based authentication
3. **Role-Based Access:** Admin and Sub-admin roles with permissions
4. **Protected Routes:** API endpoints protected with middleware
5. **Input Validation:** Server-side validation on all inputs

## 📊 Order Status Flow

```
Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered
                                    ↓
                              Cancelled (before shipping)
```

## 🎯 Future Enhancements (Razorpay Integration)

The order system is built to support payment gateway integration:
- Payment capture on order creation
- Payment verification
- Refund handling for cancelled orders
- Payment failure tracking

## 🛠️ Testing the System

### Create a Test Order
```javascript
// User must be logged in
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_USER_TOKEN'
  },
  body: JSON.stringify({
    items: [
      {
        productId: "PRODUCT_ID",
        productName: "Test Shoe",
        productImage: "https://...",
        quantity: 2,
        price: 999,
        subtotal: 1998
      }
    ],
    totalAmount: 1998,
    discount: 0,
    shippingCharges: 50,
    taxAmount: 100,
    shippingAddress: {
      name: "John Doe",
      phone: "1234567890",
      addressLine1: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    paymentMethod: "COD"
  })
})
```

## 📝 Notes

- Order numbers are auto-generated (format: ORD-TIMESTAMP-RANDOM)
- Categories can have unlimited subcategories
- Customers are automatically blocked from placing orders when blocked
- Orders cannot be cancelled after shipping
- Admin permissions can be customized per sub-admin
- All timestamps are stored in UTC

## 🐛 Troubleshooting

### JWT_SECRET Warning
If you see JWT warnings, make sure to set a strong JWT_SECRET in your .env file.

### MongoDB Connection Issues
Ensure your MONGODB_URI is correctly formatted and the database is accessible.

### Permission Errors
Make sure you're logged in as an admin user for admin routes.

## 📚 Additional Resources

- MongoDB Usage: See `MONGODB_USAGE.md`
- Cloudinary Setup: See `CLOUDINARY_SETUP.md`
- Admin Dashboard: See `ADMIN_DASHBOARD.md`
