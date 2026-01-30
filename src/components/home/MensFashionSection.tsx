import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const MensFashionSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-gray-950">
      <div className="container-premium section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-lg mx-auto lg:mx-0"
          >
            <img
              src="https://img.freepik.com/free-photo/retro-man-dressed-shirt-lies-floor-posing_171337-9906.jpg?semt=ais_user_personalization&w=740&q=80"
              alt="Men's Fashion Collection"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
          

          {/* Right - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Footwear Collection Info */}
            <div className="space-y-6">
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 font-medium"
              >
                Premium Men's Collection
              </motion.p>
              <motion.h3 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Step into<br />
                <span className="italic font-light">Timeless</span> Elegance
              </motion.h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl font-light">
                Experience the perfect fusion of modern design and traditional craftsmanship in every pair.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                to="/category/men"
                className="inline-flex items-center justify-center gap-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-xl text-white dark:text-gray-900 px-10 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-300 group"
              >
                Visit Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
