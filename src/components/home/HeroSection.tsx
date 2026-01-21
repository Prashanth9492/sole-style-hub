import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-sneaker.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-premium section-padding w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="relative z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="inline-block px-4 py-2 bg-secondary rounded-full text-sm font-medium mb-6">
                New Collection 2024
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="heading-hero mb-6"
            >
              Step Into
              <br />
              <span className="text-muted-foreground">The Future</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-body max-w-md mb-8"
            >
              Discover premium footwear designed for those who dare to stand out. 
              Crafted with precision, built for comfort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/category/men" className="btn-primary inline-flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/new" className="btn-outline">
                Explore Collection
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="flex gap-12 mt-12 pt-8 border-t border-border"
            >
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100+</p>
                <p className="text-sm text-muted-foreground">Premium Styles</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-secondary/50 to-transparent rounded-full blur-3xl transform scale-150" />
              <motion.img
                src={heroImage}
                alt="Premium Sneaker"
                className="relative w-full max-w-2xl mx-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-border flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};
