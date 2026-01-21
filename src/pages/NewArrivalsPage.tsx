import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { getNewArrivals } from '@/data/products';

const NewArrivalsPage = () => {
  const products = getNewArrivals();

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

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {products.length === 0 && (
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
