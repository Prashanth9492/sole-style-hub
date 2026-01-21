import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
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
      {/* Banner */}
      <section className="py-20 lg:py-32">
        <div className="container-premium section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-foreground text-primary-foreground rounded-3xl overflow-hidden"
          >
            <div className="relative z-10 p-12 lg:p-20 max-w-2xl">
              <span className="inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-6">
                Limited Time Offer
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Get 20% Off Your First Order
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md">
                Sign up for our newsletter and receive an exclusive discount code for your 
                first purchase. Stay updated with new arrivals and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-4 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 transition-colors"
                />
                <button className="px-8 py-4 bg-primary-foreground text-foreground rounded-full font-semibold text-sm tracking-wide inline-flex items-center justify-center gap-2 hover:bg-primary-foreground/90 transition-colors">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-foreground/5 to-transparent" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
          </motion.div>
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
