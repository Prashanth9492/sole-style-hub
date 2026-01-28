import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import menCategory from '@/assets/categories/men-category.jpg';
import womenCategory from '@/assets/categories/women-category.jpg';
import kidsCategory from '@/assets/categories/kids-category.jpg';
import { useState } from 'react';

const categories = [
  {
    id: 'men',
    name: 'Men',
    subtitle: 'Premium Collection',
    count: '500+ styles',
    image: menCategory,
  },
  {
    id: 'women',
    name: 'Women',
    subtitle: 'Elegant Designs',
    count: '650+ styles',
    image: womenCategory,
  },
  {
    id: 'kids',
    name: 'Kids',
    subtitle: 'Comfortable & Fun',
    count: '300+ styles',
    image: kidsCategory,
  },
];

export const CategorySection = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/10">
      <div className="container-premium section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section mb-4">Shop by Category</h2>
          <p className="text-body max-w-md mx-auto">
            Find the perfect pair for everyone in the family
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col items-center"
            >
              <Link to={`/category/${category.id}`} className="block">
                {/* Circle Container */}
                <div className="relative">
                  {/* Heart Icon */}
                  <button
                    onClick={(e) => toggleWishlist(category.id, e)}
                    className="absolute -top-2 -right-2 z-20 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors duration-300 ${
                        wishlist.includes(category.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-red-400'
                      }`}
                    />
                  </button>

                  {/* Circle Image */}
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 border-4 border-white dark:border-gray-800 ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-primary/50 group-hover:ring-4">
                    <div className="relative w-full h-full">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Hover Arrow */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="p-4 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-500">
                          <ArrowRight className="w-6 h-6 text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content Below Circle */}
                <div className="text-center mt-6 space-y-2">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-medium">
                    {category.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
