import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const subCategories = ['boots', 'casual', 'flip-flops', 'formal', 'sandals', 'sneakers', 'sports'];

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubCategory = selectedSubCategory === 'all' ||
                               product.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' ||
                          (selectedStatus === 'inStock' && product.inStock) ||
                          (selectedStatus === 'outOfStock' && !product.inStock) ||
                          (selectedStatus === 'new' && product.isNew) ||
                          (selectedStatus === 'bestseller' && product.isBestseller);
    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSubCategory !== 'all' || selectedStatus !== 'all' || searchQuery !== '';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Link to="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold mt-1">{products.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">In Stock</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {products.filter((p) => p.inStock).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {products.filter((p) => !p.inStock).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {products.filter((p) => p.status === 'Draft').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            <Button 
              variant={showMoreFilters ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="text-red-600 hover:text-red-700">
                Clear All
              </Button>
            )}
          </div>

          {/* More Filters Section */}
          {showMoreFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                  >
                    <option value="all">All Sub Categories</option>
                    {subCategories.map((sub) => (
                      <option key={sub} value={sub} className="capitalize">
                        {sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="inStock">In Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                    <option value="new">New Arrivals</option>
                    <option value="bestseller">Bestsellers</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{product.subCategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm capitalize">{product.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      {product.discountPrice ? (
                        <>
                          <p className="font-medium">${product.discountPrice}</p>
                          <p className="text-sm text-gray-500 line-through">${product.price}</p>
                        </>
                      ) : (
                        <p className="font-medium">${product.price}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-sm ${
                        product.stock > 20
                          ? 'text-green-600'
                          : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-6">
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
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/product/${product._id}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/products/edit/${product._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product._id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductManagement;
