import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
import modelImage from '../../assets/images/model7.png';

export const StyleShowcase = () => {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="container-premium section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Headline with Shoe Icon */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tighter">
                <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent animate-gradient">
                  STEP INTO
                </span>
                <br />
                <span className="inline-block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold">
                  BOLD STYLE.
                </span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-md leading-relaxed font-light tracking-wide">
              Discover shoes that blend <span className="font-semibold text-gray-900 dark:text-white">comfort</span>, <span className="font-semibold text-gray-900 dark:text-white">craftsmanship</span>, and <span className="font-semibold text-gray-900 dark:text-white">trendsetting design</span> - made to move with you.
            </p>

            {/* Shop Now Button */}
            <Link
              to="category/women"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 hover:shadow-2xl hover:shadow-gray-500/50 dark:hover:shadow-white/30 text-white dark:text-gray-900 pl-8 pr-6 py-4 rounded-full font-bold text-base transition-all duration-300 group transform hover:scale-105"
            >
              Shop Now
              <span className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all duration-300 shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-gray-900 dark:text-white" />
              </span>
            </Link>

            {/* Rating */}
            {/* <div className="flex items-center gap-2 pt-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-white">4.9</span>
              <span className="text-gray-500 dark:text-gray-400">Average Customer Rating</span>
            </div> */}

            {/* Product Card */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 max-w-[280px] shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop"
                    alt="Classic Leather"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Classic Leather</h4>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">₹19,999</p>
                  </div>
                  <Link 
                    to="/products"
                    className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <ArrowUpRight className="w-4 h-4 text-white dark:text-gray-900" />
                  </Link>
                </div>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
          >
            {/* Main Model Image */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <img
                src={modelImage}
                alt="Model wearing stylish shoes"
                className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Floating Decorative Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 text-4xl"
            >
              🌈
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 left-10 text-3xl"
            >
              🌵
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-32 right-20 text-3xl"
            >
              ✌️
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className="absolute bottom-40 right-8 text-4xl"
            >
              🍉
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-32 left-5 text-3xl"
            >
              💖
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute top-48 left-0 text-3xl"
            >
              🍐
            </motion.div>

            {/* Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute top-8 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 max-w-[220px] shadow-xl border border-gray-100 dark:border-gray-800"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed mb-3">
                "The most comfortable sneakers I've ever owned - stylish enough for work and durable enough for weekend hikes."
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Sara M., Verified Buyer</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
