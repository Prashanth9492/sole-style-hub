import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import strideImage from '@/assets/image.png';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">About STRIDE</h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                A modern e-commerce platform for premium footwear shopping.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">About This Project</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    STRIDE is a full-featured e-commerce platform designed and developed for selling 
                    premium footwear online. The website provides a seamless shopping experience with 
                    modern design and user-friendly interfaces.
                  </p>
                  <p>
                    Built with React, TypeScript, and modern web technologies, this platform features 
                    product browsing, shopping cart, wishlist, secure checkout, user authentication, 
                    and an admin dashboard for managing products and orders.
                  </p>
                  <p>
                    The website showcases a complete e-commerce solution with responsive design, 
                    smooth animations, and intuitive navigation for both customers and administrators.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-secondary"
              >
                <img 
                  src={strideImage} 
                  alt="STRIDE E-commerce Platform" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground">
                What makes this platform special
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Modern Design',
                  description: 'Clean, responsive interface with smooth animations and intuitive navigation.',
                },
                {
                  title: 'Full E-commerce',
                  description: 'Complete shopping experience with cart, wishlist, checkout, and payment integration.',
                },
                {
                  title: 'Admin Dashboard',
                  description: 'Comprehensive admin panel for managing products, orders, and customers.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-background rounded-xl p-8"
                >
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Technologies Used</h2>
              <p className="text-muted-foreground mb-12">
                Built with modern web technologies and best practices
              </p>
              <p className="text-lg text-muted-foreground">
                React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Razorpay payment integration, 
                Firebase authentication, Cloudinary for media management, and Framer Motion for animations.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
