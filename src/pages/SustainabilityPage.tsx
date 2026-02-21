import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Globe, Package } from 'lucide-react';

const SustainabilityPage = () => {
  const initiatives = [
    {
      icon: Leaf,
      title: 'React & TypeScript',
      description: 'Type-safe component-based architecture for maintainable and scalable code.',
      stat: '100%',
      statLabel: 'Type coverage',
    },
    {
      icon: Recycle,
      title: 'Modern UI/UX',
      description: 'Tailwind CSS and Framer Motion for beautiful, responsive, and animated interfaces.',
      stat: 'Fully',
      statLabel: 'Responsive design',
    },
    {
      icon: Globe,
      title: 'Backend API',
      description: 'Node.js and Express with MongoDB for robust data management and REST API.',
      stat: 'RESTful',
      statLabel: 'API architecture',
    },
    {
      icon: Package,
      title: 'Third-party Integration',
      description: 'Payment gateway, authentication, and media management services integrated.',
      stat: 'Multiple',
      statLabel: 'Services integrated',
    },
  ];

  const timeline = [
    { year: 'Phase 1', milestone: 'Project setup and initial UI design' },
    { year: 'Phase 2', milestone: 'Product catalog and shopping features' },
    { year: 'Phase 3', milestone: 'User authentication and accounts' },
    { year: 'Phase 4', milestone: 'Checkout and payment integration' },
    { year: 'Phase 5', milestone: 'Admin dashboard and management tools' },
    { year: 'Phase 6', milestone: 'Testing, optimization, and deployment' },
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
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Development</h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Built with modern best practices and performance optimization in mind.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Technical Stack</h2>
              <p className="text-muted-foreground">
                Technologies powering this e-commerce platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background mb-4">
                    <initiative.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{initiative.title}</h3>
                  <p className="text-muted-foreground mb-4">{initiative.description}</p>
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-3xl font-bold mb-1">{initiative.stat}</div>
                    <div className="text-sm text-muted-foreground">{initiative.statLabel}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Development Timeline</h2>
              <p className="text-muted-foreground">
                Key milestones in building this platform
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 pb-8 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border/50 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="text-lg">{item.milestone}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Code Quality</h2>
              <p className="text-lg text-muted-foreground mb-8">
                This project follows modern development practices with clean code, component reusability, 
                proper state management, and comprehensive error handling to ensure reliability and maintainability.
              </p>
              <p className="text-muted-foreground">
                Want to learn more about the technical implementation?{' '}
                <a href="https://github.com/Prashanth9492/sole-style-hub" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                  View on GitHub
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SustainabilityPage;
