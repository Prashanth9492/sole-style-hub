# MongoDB Connection - Backend Setup

## ✅ Setup Complete

Your MongoDB connection is now properly configured with an Express backend server.

## 🚀 Running the Application

### Start Backend Server (Terminal 1)
```bash
npm run server:watch
```
Server will run on: `http://localhost:3001`

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend will run on: `http://localhost:8080`

## 📡 API Endpoints

Base URL: `http://localhost:3001/api`

### Products
- **GET** `/products` - Get all products
- **GET** `/products/:id` - Get single product
- **POST** `/products` - Create new product
- **PUT** `/products/:id` - Update product
- **DELETE** `/products/:id` - Delete product

### Health Check
- **GET** `/health` - Check server status

## 💻 Usage in React Components

```tsx
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Creating Products

```tsx
const handleCreate = async () => {
  await api.createProduct({
    name: 'Nike Air Max',
    price: 129.99,
    description: 'Comfortable running shoes',
    category: 'sneakers',
    image: '/images/nike-air.jpg'
  });
};
```

## 📝 Environment Variables

Your `.env` file contains:
```
MONGODB_URI=mongodb+srv://prashanth:prashanth@cluster0.mcuwliu.mongodb.net/?appName=Cluster0
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## 🛡️ Security Note

**Important**: Add `.env` to your `.gitignore` to protect credentials!
