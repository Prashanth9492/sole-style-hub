import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/products?isBestseller=true`);
      if (response.ok) {
        const data = await response.json();
        // Map API data to expected format
        const mappedProducts = data.slice(0, 8).map((p: any) => ({
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          subCategory: p.subCategory,
          price: p.price,
          discountPrice: p.discountPrice,
          sizes: p.sizes,
          colors: p.colors,
          stock: p.stock,
          images: p.images,
          description: p.description,
          rating: 4.5,
          reviews: 0,
          inStock: p.inStock,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-secondary/30">
        <div className="container-premium section-padding">
          <p className="text-center text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      // <section className="py-20 lg:py-32 bg-secondary/30">
      //   <div className="container-premium section-padding">
      //     <p className="text-center text-gray-500">No products adrtfgyvbhunjkmvailable yet.</p>
      //   </div>
      // </section> null return if no products
      null
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="container-premium section-padding">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="heading-section mb-2">Featured Collection</h2>
            <p className="text-body">Our most lovedxcfgvbhnjmk,d styles this season</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              to="/new"
              className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
