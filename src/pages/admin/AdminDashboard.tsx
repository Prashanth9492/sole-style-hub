import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const AdminDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Products',
      value: loading ? '...' : products.length.toString(),
      change: '+12%',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'In Stock',
      value: loading ? '...' : products.filter(p => p.inStock).length.toString(),
      change: '+23%',
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      name: 'Out of Stock',
      value: loading ? '...' : products.filter(p => !p.inStock).length.toString(),
      change: '+18%',
      icon: Package,
      color: 'bg-red-500',
    },
    {
      name: 'Draft',
      value: loading ? '...' : products.filter(p => !p.inStock).length.toString(),
      change: '+8%',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No products found. Add your first product!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-sm capitalize">{product.category}</td>
                      <td className="py-3 px-4 text-sm font-medium">${product.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Top Products by Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-4">
              {['men', 'women', 'kids'].map((category) => {
                const count = products.filter(p => p.category?.toLowerCase() === category).length;
                return (
                  <div key={category} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">{category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {count} product{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Add New Product</p>
              <p className="text-sm text-blue-600">Create a new product listing</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Manage Orders</p>
              <p className="text-sm text-green-600">View and process orders</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
          >
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">View Analytics</p>
              <p className="text-sm text-purple-600">Check store performance</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-purple-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
