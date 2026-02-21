import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Briefcase, Heart, TrendingUp, Users } from 'lucide-react';

const CareersPage = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'User Experience',
      description: 'Intuitive design with smooth interactions and animations',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Code',
      description: 'Well-structured and maintainable codebase',
    },
    {
      icon: Users,
      title: 'Full Stack',
      description: 'Complete frontend and backend implementation',
    },
    {
      icon: Briefcase,
      title: 'Real Features',
      description: 'Authentic e-commerce functionality and workflows',
    },
  ];

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
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Project Info</h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                This is a demonstration e-commerce website showcasing modern web development 
                practices and full-stack capabilities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Project Highlights</h2>
              <p className="text-muted-foreground">
                Key features and capabilities of this e-commerce platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Complete Features</h2>
              <p className="text-muted-foreground">
                Everything you need in a modern e-commerce platform
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-4">
              {[
                'User authentication and account management',
                'Product browsing with categories and search',
                'Shopping cart and wishlist functionality',
                'Secure checkout with payment integration',
                'Order tracking and history',
                'Admin dashboard for product management',
                'Responsive design for all devices',
                'Image upload and media management',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-background rounded-xl p-6"
                >
                  <p className="text-lg">✓ {feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
