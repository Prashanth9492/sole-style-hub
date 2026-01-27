import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const MaterialsSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container-premium section-padding py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-black text-foreground uppercase leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Made With<br />
                <span className="text-gray-600 dark:text-gray-400">Core Materials</span>
              </motion.h2>
              
              <motion.p 
                className="text-sm lg:text-base text-muted-foreground max-w-md mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  className="rounded-full px-8 py-6 text-sm font-semibold uppercase tracking-wider border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  See Our Materials
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Right Image */}
            <motion.div
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                {/* Main Image */}
                <motion.img
                  src="https://images.unsplash.com/photo-1621844061203-84cc4622b1be?q=80&w=1974&auto=format&fit=crop"
                  alt="Athlete with skateboard"
                  className="w-full h-auto object-contain relative z-10"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Decorative elements */}
                <motion.div
                  className="absolute -bottom-4 -left-4 w-24 h-24 bg-foreground/5 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-4 -right-4 w-32 h-32 bg-foreground/5 rounded-full blur-2xl"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="bg-foreground text-background py-4 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {[...Array(10)].map((_, index) => (
            <span
              key={index}
              className="text-sm lg:text-base font-bold uppercase tracking-[0.3em] mx-8 flex items-center"
            >
              Our Latest Arrivals
              <span className="mx-8 w-2 h-2 bg-background rounded-full" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
