import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import menCategory from '@/assets/categories/men-category.jpg';
import womenCategory from '@/assets/categories/women-category.jpg';
import kidsCategory from '@/assets/categories/kids-category.jpg';

const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Premium footwear for the modern gentleman',
    image: menCategory,
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Elegant designs for every occasion',
    image: womenCategory,
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Durable comfort for active adventures',
    image: kidsCategory,
  },
];

export const CategorySection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container-premium section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-section mb-4">Shop by Category</h2>
          <p className="text-body max-w-md mx-auto">
            Find the perfect pair for everyone in the family
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/category/${category.id}`} className="group block">
                <div className="relative aspect-[4/5] bg-secondary rounded-3xl overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-primary-foreground/70">
                          {category.description}
                        </p>
                      </div>
                      <div className="p-3 bg-primary-foreground rounded-full transform transition-transform duration-300 group-hover:scale-110">
                        <ArrowUpRight className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
