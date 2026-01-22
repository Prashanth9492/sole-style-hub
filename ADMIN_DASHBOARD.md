# Admin Dashboard Documentation

## Overview

A comprehensive admin dashboard for managing the Sole Style Hub e-commerce store. Built with React, TypeScript, and Tailwind CSS.

## Access

Navigate to: **`http://localhost:5173/admin`**

## Features

### 📊 Dashboard
- Real-time statistics (Products, Orders, Revenue, Customers)
- Recent orders overview
- Top products list
- Quick action shortcuts

### 📦 Product Management
- **List View**: View all products with search and filters
- **Add Product**: Create new product listings
- **Edit Product**: Update existing products
- **Delete Product**: Remove products from inventory
- **Bulk Operations**: Delete multiple products at once

### Product Features:
- Basic Information (Name, Brand, Category, Description)
- Pricing (Regular price, Sale price, Stock quantity)
- Size Selection (5-13)
- Color Variants with hex values
- Multiple Image Upload (via Cloudinary)
- Status Options (In Stock, New Arrival, Bestseller)

## File Structure

```
src/
├── components/
│   └── admin/
│       └── AdminLayout.tsx          # Main admin layout with sidebar
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx       # Dashboard home page
│       ├── ProductManagement.tsx    # Product list & management
│       └── ProductForm.tsx          # Add/Edit product form
server/
└── routes/
    ├── products.ts                  # Product CRUD API endpoints
    └── cloudinary.ts                # Image upload endpoints
```

## Routes

### Frontend Routes
```
/admin                              - Dashboard home
/admin/products                     - Product list
/admin/products/new                 - Add new product
/admin/products/edit/:id            - Edit product
/admin/orders                       - Orders (placeholder)
/admin/categories                   - Categories (placeholder)
/admin/customers                    - Customers (placeholder)
/admin/media                        - Media library (placeholder)
/admin/analytics                    - Analytics (placeholder)
/admin/settings                     - Settings (placeholder)
```

### API Endpoints
```
GET    /api/products                - Get all products (with filters)
GET    /api/products/:id            - Get single product
POST   /api/products                - Create new product
PUT    /api/products/:id            - Update product
DELETE /api/products/:id            - Delete product
POST   /api/products/bulk/delete    - Delete multiple products
POST   /api/cloudinary/upload       - Upload image
POST   /api/cloudinary/delete       - Delete image
```

## Usage Guide

### Adding a New Product

1. Navigate to `/admin/products`
2. Click "Add Product" button
3. Fill in required fields:
   - Product Name *
   - Brand *
   - Category * (Men/Women/Kids)
   - Sub Category * (Sneakers, Boots, etc.)
   - Description *
   - Regular Price *
   - Stock Quantity *
   - Select Sizes *
4. Optional fields:
   - Sale Price
   - Colors (Add multiple with color picker)
   - Images (Upload via Cloudinary)
   - Checkboxes (In Stock, New Arrival, Bestseller)
5. Click "Save Product"

### Editing a Product

1. Go to product list page
2. Click the edit icon (pencil) on any product
3. Modify fields as needed
4. Click "Save Product"

### Deleting Products

**Single Delete:**
- Click the three-dot menu on a product
- Select "Delete"
- Confirm deletion

**Bulk Delete:** (Feature to be implemented)
- Select multiple products using checkboxes
- Click bulk delete button

### Searching & Filtering

**Search:**
- Use the search bar to find products by name

**Filters:**
- Category dropdown (All/Men/Women/Kids)
- More filters button for advanced options

## Product Data Structure

```typescript
interface Product {
  name: string;
  brand: string;
  category: 'men' | 'women' | 'kids';
  subCategory: string; // sneakers, boots, casual, etc.
  price: number;
  discountPrice?: number;
  sizes: number[]; // [7, 8, 9, 10, 11, 12]
  colors: { name: string; hex: string }[];
  stock: number;
  images: string[]; // Cloudinary URLs
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Image Upload Integration

The admin uses Cloudinary for image storage:

1. Click the file input in the Images section
2. Select an image (max 5MB)
3. Image automatically uploads to Cloudinary
4. URL is added to product images array
5. Remove images by clicking the X button

**Configure Cloudinary:**
- See `CLOUDINARY_SETUP.md` for setup instructions
- Make sure upload preset `sole-style-uploads` is created

## API Integration

### Creating a Product
```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

### Updating a Product
```typescript
const response = await fetch(`/api/products/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedData)
});
```

### Deleting a Product
```typescript
const response = await fetch(`/api/products/${id}`, {
  method: 'DELETE'
});
```

## Customization

### Adding New Fields

1. Update the `ProductFormData` interface in `ProductForm.tsx`
2. Add form fields in the UI
3. Update the MongoDB schema
4. Modify API endpoints if needed

### Adding New Pages

1. Create page component in `src/pages/admin/`
2. Add route in `src/App.tsx` under `/admin`
3. Add navigation link in `AdminLayout.tsx`

### Styling

The admin uses:
- Tailwind CSS for styling
- Shadcn/ui components
- Lucide React for icons
- Framer Motion for animations

## Security Considerations

⚠️ **Important**: This admin dashboard currently has no authentication!

### Production Recommendations:

1. **Add Authentication:**
   ```typescript
   // Implement JWT or session-based auth
   // Protect admin routes with auth middleware
   ```

2. **Environment Variables:**
   - Keep API secrets in `.env`
   - Never commit credentials to git

3. **API Security:**
   - Add auth tokens to API requests
   - Validate user permissions
   - Rate limit API endpoints

4. **Input Validation:**
   - Validate all form inputs
   - Sanitize user data
   - Use TypeScript for type safety

## Troubleshooting

### Images not uploading
- Check Cloudinary credentials in `.env`
- Verify upload preset is created and set to "unsigned"
- Check browser console for errors

### Products not saving
- Check MongoDB connection
- Verify API server is running (`npm run server:watch`)
- Check network tab for API errors

### Layout issues
- Clear browser cache
- Check Tailwind CSS is compiling
- Verify all imports are correct

## Future Enhancements

- [ ] Authentication & user management
- [ ] Order management system
- [ ] Customer database
- [ ] Analytics dashboard with charts
- [ ] Bulk import/export (CSV)
- [ ] Product categories management
- [ ] Email notifications
- [ ] Inventory tracking
- [ ] Sales reports
- [ ] Discount/coupon system

## Development

### Start Development Servers

```bash
# Frontend (Vite)
npm run dev

# Backend (Express + MongoDB)
npm run server:watch
```

### Build for Production

```bash
npm run build
```

## Support

For issues or questions:
1. Check this documentation
2. Review component code comments
3. Check API endpoint responses
4. Review browser console errors
5. Check MongoDB collections

---

**Version**: 1.0.0  
**Last Updated**: January 2026
