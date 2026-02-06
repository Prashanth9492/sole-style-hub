import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';

interface Product {
  _id: string;
  id?: string;
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
  rating?: number;
  reviews?: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt?: string;
}

const NewArrivalsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      // Use dedicated new-arrivals endpoint or fallback to sorted products
      const response = await fetch(`${apiUrl}/products?sort=newest&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        // Map MongoDB _id to id for consistent navigation
        const mappedProducts = data.map((product: any) => ({
          ...product,
          id: product._id || product.id,
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 pb-20">
        <div className="container-premium section-padding">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium mb-6">
              Just Dropped
            </span>
            <h1 className="heading-hero mb-4">New Arrivals</h1>
            <p className="text-body max-w-md mx-auto">
              Be the first to explore our latest collection of premium footwear
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {products.map((product, index) => (
                <ProductCard 
                  key={product._id || product.id} 
                  product={{
                    ...product,
                    id: product._id || product.id || '',
                    rating: product.rating || 4.5,
                    reviews: product.reviews || 0,
                    isNew: true, // Mark all as new arrivals
                  }} 
                  index={index} 
                />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No new arrivals at the moment.</p>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium">
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
