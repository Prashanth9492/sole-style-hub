import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const PressPage = () => {
  const pressReleases = [
    {
      date: 'February 2026',
      title: 'STRIDE E-commerce Platform Completed',
      excerpt: 'Full-featured online shopping platform for footwear with modern design and complete functionality.',
    },
    {
      date: 'February 2026',
      title: 'Admin Dashboard Implementation',
      excerpt: 'Comprehensive admin panel for managing products, orders, categories, and customer data.',
    },
    {
      date: 'February 2026',
      title: 'Payment Integration Complete',
      excerpt: 'Razorpay payment gateway integrated for secure online transactions and order processing.',
    },
    {
      date: 'February 2026',
      title: 'Responsive Design Across All Pages',
      excerpt: 'Mobile-first approach ensuring perfect shopping experience on all devices and screen sizes.',
    },
  ];

  const mediaKits = [
    {
      title: 'Frontend Code',
      description: 'React components, pages, and styling',
      size: 'GitHub',
    },
    {
      title: 'Backend API',
      description: 'Server routes, models, and database',
      size: 'Node.js',
    },
    {
      title: 'Documentation',
      description: 'Setup guides and API reference',
      size: 'Markdown',
    },
  ];

  const awards = [
    { year: 'Features', award: 'Complete E-commerce Functionality' },
    { year: 'Design', award: 'Modern & Responsive UI/UX' },
    { year: 'Tech Stack', award: 'React, TypeScript, Node.js, MongoDB' },
    { year: 'Integration', award: 'Payment Gateway & Cloud Services' },
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
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Updates & Info</h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Latest updates and information about this e-commerce platform project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Press Releases Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Project Updates</h2>
              <p className="text-muted-foreground">
                Recent developments and milestones
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {pressReleases.map((release, index) => (
                <motion.article
                  key={release.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-8 hover:shadow-md transition-shadow"
                >
                  <time className="text-sm text-muted-foreground">{release.date}</time>
                  <h3 className="text-2xl font-semibold mt-2 mb-3">{release.title}</h3>
                  <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kits Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Project Resources</h2>
              <p className="text-muted-foreground">
                Access code and documentation
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              {mediaKits.map((kit, index) => (
                <motion.div
                  key={kit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-2">{kit.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{kit.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{kit.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-16 lg:py-24">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Key Highlights</h2>
              <p className="text-muted-foreground">
                Main features and capabilities of the platform
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
              {awards.map((award, index) => (
                <motion.div
                  key={`${award.year}-${award.award}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-6"
                >
                  <div className="text-sm font-semibold text-muted-foreground mb-2">{award.year}</div>
                  <div className="text-lg font-medium">{award.award}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-premium section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Contact Information</h2>
              <p className="text-lg text-muted-foreground mb-8">
                For inquiries or more information about this project.
              </p>
              <div className="bg-background rounded-xl p-8 inline-block">
                <div className="text-left space-y-2">
                  <div>
                    <span className="font-semibold">GitHub:</span>{' '}
                    <a href="https://github.com/Prashanth9492/sole-style-hub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      sole-style-hub
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Developer:</span>{' '}
                    <span className="text-muted-foreground">Prashanth</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PressPage;
