import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹8,000',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
  },
];

export const PromoSection = () => {
  return (
    <>
      {/* New Arrivals Section */}
      <section className="py-4 lg:py-5 bg-gradient-to-br from-50 via-white  dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="container-premium section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-4 items-center">
            
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-2 space-y-3"
            >
              {/* New Arrival Info */}
              <div className="space-y-2">
                <motion.h3 
                  initial={{ opacity: 0, x: -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tight"
                >
                  <motion.span
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-cyan-500"
                  >
                    New
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-purple-700 dark:text-purple-400 font-black uppercase tracking-tight"
                  >
                    ARRIVAL
                  </motion.span>
                </motion.h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                  Step into our latest footwear collection designed for all-day comfort, modern style, and everyday performance. Find your perfect pair today.
                </p>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 hover:shadow-2xl hover:scale-105 text-white px-12 py-5 rounded-full font-bold text-base uppercase tracking-wider transition-all duration-300 group"
                >
                  EXPLORE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right - Image (Larger) */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="lg:col-span-3 relative"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="https://www.therewardsfactory.com/img/wallets1.svg"
                  alt="New Arrival - Shopping Experience"
                  className="w-full h-auto max-h-[500px] lg:max-h-[600px] object-contain drop-shadow-2xl"
                />
              </div>
              {/* Decorative circles */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-cyan-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="py-16 border-y border-border">
        <div className="container-premium section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
