import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';

interface ProductFormData {
  name: string;
  brand: string;
  category: 'men' | 'women' | 'kids';
  subCategory: string;
  price: number;
  discountPrice?: number;
  sizes: number[];
  colors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  description: string;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  brand: 'STRIDE',
  category: 'men',
  subCategory: 'sneakers',
  price: 0,
  discountPrice: 0,
  sizes: [],
  colors: [],
  stock: 0,
  images: [],
  description: '',
  inStock: true,
  isNew: false,
  isBestseller: false,
};

const categories = ['men', 'women', 'kids'];
const subCategories = ['sneakers', 'running', 'casual', 'formal', 'sandals', 'sports', 'boots', 'flip-flops'];
const availableSizes = [5, 6, 7, 8, 9, 10, 11, 12, 13];

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Fetch product data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct(id);
    }
  }, [isEditMode, id]);

  const fetchProduct = async (productId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        setFormData({
          name: product.name || '',
          brand: product.brand || 'STRIDE',
          category: product.category || 'men',
          subCategory: product.subCategory || 'sneakers',
          price: product.price || 0,
          discountPrice: product.discountPrice || 0,
          sizes: product.sizes || [],
          colors: product.colors || [],
          stock: product.stock || 0,
          images: product.images || [],
          description: product.description || '',
          inStock: product.inStock !== undefined ? product.inStock : true,
          isNew: product.isNew || false,
          isBestseller: product.isBestseller || false,
        });
      } else {
        alert('Failed to load product');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b),
    }));
  };

  const handleAddColor = () => {
    if (newColor.name && newColor.hex) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor],
      }));
      setNewColor({ name: '', hex: '#000000' });
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const handleMultipleImageUpload = (images: { url: string; publicId: string }[]) => {
    // Images are already added one by one via handleImageUpload callback
    // This callback can be used for batch processing if needed
    console.log(`Successfully uploaded ${images.length} images`);
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // API call to save product
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const endpoint = isEditMode
        ? `${apiUrl}/products/${id}`
        : `${apiUrl}/products`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/products');
      } else {
        const error = await response.json();
        alert(`Failed to save product: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update product information' : 'Create a new product listing'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Air Flow Elite Sneakers"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="e.g., STRIDE"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category *</Label>
              <select
                id="subCategory"
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the product features, materials, and benefits..."
                rows={4}
                required
              />
            </div>
          </div>
        </Card>

        {/* Pricing & Stock */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Regular Price ($) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : 0)}
                placeholder="189.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Sale Price ($)</Label>
              <Input
                id="discountPrice"
                type="number"
                value={formData.discountPrice || ''}
                onChange={(e) => handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="149.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ''}
                onChange={(e) => handleInputChange('stock', e.target.value ? parseInt(e.target.value) : 0)}
                placeholder="50"
                min="0"
                required
              />
            </div>
          </div>
        </Card>

        {/* Sizes */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Available Sizes *</h2>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                  formData.sizes.includes(size)
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </Card>

        {/* Colors */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Available Colors</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Color name (e.g., Black)"
                value={newColor.name}
                onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor((prev) => ({ ...prev, hex: e.target.value }))}
                className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <Button type="button" onClick={handleAddColor} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                >
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Product Images</h2>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={handleImageUpload}
              onMultipleUploadComplete={handleMultipleImageUpload}
              folder="products"
              maxSize={5}
              multiple={true}
            />

            {formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Images ({formData.images.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Options */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Additional Options</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleInputChange('inStock', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => handleInputChange('isNew', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => handleInputChange('isBestseller', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Mark as Bestseller</span>
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProductForm;
