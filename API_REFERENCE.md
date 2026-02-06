# 📡 API Reference

Base URL: `http://localhost:3001/api`

## Authentication

All authenticated requests require the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "1234567890"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@solestyle.com",
  "password": "Admin@123"
}
```

---

## 📦 Order Endpoints

### Create Order (User)
```http
POST /orders
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Nike Air Max",
      "productImage": "https://...",
      "size": "10",
      "color": "Black",
      "quantity": 2,
      "price": 999,
      "discount": 100,
      "subtotal": 1798
    }
  ],
  "totalAmount": 1798,
  "discount": 100,
  "shippingCharges": 50,
  "taxAmount": 90,
  "shippingAddress": {
    "name": "John Doe",
    "phone": "1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD"
}
```

**Response (201):**
```json
{
  "message": "Order placed successfully",
  "orderId": "507f1f77bcf86cd799439011",
  "orderNumber": "ORD-LK7R9F-3H8P2Q"
}
```

### Get My Orders (User)
```http
GET /orders/my-orders
Authorization: Bearer USER_TOKEN
```

### Get Order by ID (User)
```http
GET /orders/:id
Authorization: Bearer USER_TOKEN
```

### Cancel Order (User)
```http
PATCH /orders/:id/cancel
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

### Get All Orders (Admin)
```http
GET /admin/orders?status=Placed&page=1&limit=20&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

### Update Order Status (Admin)
```http
PATCH /admin/orders/:id/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "Shipped",
  "comment": "Package shipped via FedEx",
  "trackingNumber": "TRACK123456789"
}
```

### Update Payment Status (Admin)
```http
PATCH /admin/orders/:id/payment
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "paymentStatus": "Paid",
  "paymentId": "PAY123456",
  "razorpayPaymentId": "pay_ABC123",
  "razorpaySignature": "signature_here"
}
```

---

## 🏷️ Category Endpoints

### Get All Categories (Public)
```http
GET /categories?parent=Men&active=true
```

**Query Parameters:**
- `parent` (optional): Filter by parent category
- `active` (optional): Filter by active status

### Get Category by ID or Slug (Public)
```http
GET /categories/:identifier
```

### Create Category (Admin)
```http
POST /admin/categories
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Running Shoes",
  "description": "High-performance running shoes",
  "parentCategory": "Men",
  "image": "https://...",
  "sortOrder": 1
}
```

### Update Category (Admin)
```http
PUT /admin/categories/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "isActive": true,
  "sortOrder": 2
}
```

### Delete Category (Admin)
```http
DELETE /admin/categories/:id
Authorization: Bearer ADMIN_TOKEN
```

### Add Subcategory (Admin)
```http
POST /admin/categories/:id/subcategories
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Trail Running",
  "image": "https://..."
}
```

### Update Subcategory (Admin)
```http
PUT /admin/categories/:id/subcategories/:subId
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "isActive": true
}
```

### Delete Subcategory (Admin)
```http
DELETE /admin/categories/:id/subcategories/:subId
Authorization: Bearer ADMIN_TOKEN
```

### Get Category Hierarchy (Public)
```http
GET /categories/hierarchy/all
```

**Response:**
```json
{
  "Men": [
    {
      "_id": "...",
      "name": "Running Shoes",
      "slug": "running-shoes",
      "subCategories": [...]
    }
  ],
  "Women": [...],
  "Kids": [...]
}
```

---

## 👥 Customer Endpoints

### Get User Profile (User)
```http
GET /users/profile
Authorization: Bearer USER_TOKEN
```

### Update User Profile (User)
```http
PUT /users/profile
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210"
}
```

### Change Password (User)
```http
PUT /users/change-password
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### Add to Wishlist (User)
```http
POST /users/wishlist/:productId
Authorization: Bearer USER_TOKEN
```

### Remove from Wishlist (User)
```http
DELETE /users/wishlist/:productId
Authorization: Bearer USER_TOKEN
```

### Get All Customers (Admin)
```http
GET /admin/customers?page=1&limit=20&search=john&blocked=false
Authorization: Bearer ADMIN_TOKEN
```

### Get Customer Details (Admin)
```http
GET /admin/customers/:id
Authorization: Bearer ADMIN_TOKEN
```

### Block/Unblock Customer (Admin)
```http
PATCH /admin/customers/:id/block
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "isBlocked": true
}
```

---

## 📍 Address Endpoints

### Get All Addresses (User)
```http
GET /addresses
Authorization: Bearer USER_TOKEN
```

### Add Address (User)
```http
POST /addresses
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "1234567890",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": false
}
```

### Update Address (User)
```http
PUT /addresses/:addressId
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "isDefault": true
}
```

### Delete Address (User)
```http
DELETE /addresses/:addressId
Authorization: Bearer USER_TOKEN
```

### Set Default Address (User)
```http
PATCH /addresses/:addressId/default
Authorization: Bearer USER_TOKEN
```

---

## 📊 Analytics Endpoints (Admin Only)

### Get Dashboard Overview
```http
GET /admin/analytics/overview
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "products": {
    "total": 150,
    "inStock": 120,
    "outOfStock": 30,
    "featured": 20
  },
  "orders": {
    "total": 500,
    "revenue": 500000,
    "pending": 25,
    "delivered": 450,
    "cancelled": 25
  },
  "customers": {
    "total": 300,
    "active": 280,
    "blocked": 20
  }
}
```

### Get Sales Over Time
```http
GET /admin/analytics/sales-over-time?period=30days
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `period`: `7days`, `30days`, or `12months`

### Get Orders by Category
```http
GET /admin/analytics/orders-by-category
Authorization: Bearer ADMIN_TOKEN
```

### Get Top Products
```http
GET /admin/analytics/top-products?limit=10
Authorization: Bearer ADMIN_TOKEN
```

### Get Revenue Analytics
```http
GET /admin/analytics/revenue
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "today": {
    "revenue": 15000,
    "orders": 12
  },
  "thisMonth": {
    "revenue": 250000,
    "orders": 180
  },
  "lastMonth": {
    "revenue": 200000,
    "orders": 150
  },
  "growth": "25.00"
}
```

### Get Recent Activities
```http
GET /admin/analytics/recent-activities
Authorization: Bearer ADMIN_TOKEN
```

---

## 🔑 Admin Management Endpoints

### Get Admin Profile
```http
GET /admin/profile
Authorization: Bearer ADMIN_TOKEN
```

### Update Admin Profile
```http
PUT /admin/profile
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Admin Name"
}
```

### Change Admin Password
```http
PUT /admin/change-password
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

### Get All Admins (Admin Only)
```http
GET /admin/admins
Authorization: Bearer ADMIN_TOKEN
```

### Create New Admin (Admin Only)
```http
POST /admin/admins
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Sub Admin",
  "email": "subadmin@example.com",
  "password": "SecurePass123",
  "role": "sub-admin",
  "permissions": {
    "canManageProducts": true,
    "canManageOrders": true,
    "canManageCategories": false,
    "canManageCustomers": false,
    "canManageAdmins": false,
    "canViewAnalytics": true
  }
}
```

### Update Admin (Admin Only)
```http
PUT /admin/admins/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "sub-admin",
  "isActive": true,
  "permissions": {...}
}
```

### Delete Admin (Admin Only)
```http
DELETE /admin/admins/:id
Authorization: Bearer ADMIN_TOKEN
```

---

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "error": "Validation error message"
}
```

### Unauthorized (401)
```json
{
  "error": "Authentication required"
}
```

### Forbidden (403)
```json
{
  "error": "Admin access required"
}
```

### Not Found (404)
```json
{
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. All dates are in ISO 8601 format
2. All amounts are in base currency (e.g., paise for INR, cents for USD)
3. Pagination defaults: page=1, limit=20
4. JWT tokens expire in 7 days
5. Passwords must be at least 8 characters
6. Phone numbers should be 10 digits

## 🔒 Security Best Practices

1. Always use HTTPS in production
2. Store JWT tokens securely (httpOnly cookies preferred)
3. Validate all inputs on both client and server
4. Rate limit authentication endpoints
5. Use strong passwords and JWT secrets
6. Regularly rotate JWT secrets in production
