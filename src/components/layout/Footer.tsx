import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Men', href: '/category/men' },
    { name: 'Women', href: '/category/women' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'New Arrivals', href: '/new' },
    { name: 'Sale', href: '/sale' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-t border-gray-800">
      {/* Main Footer */}
      <div className="container-premium section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand - Enhanced with animated logo */}
          <div>
            <Link to="/" className="inline-block group">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent relative"
              >
                SOLE-MART
                {/* Glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </motion.span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
              Premium footwear crafted for comfort, style, and confidence.
            </p>

            {/* Enhanced Social Media Icons with brand colors */}
            <div className="flex items-center gap-3 md:gap-4 mt-6 flex-wrap">
              {[
                { 
                  icon: Instagram, 
                  link: "https://www.instagram.com/_prashanth__02_/",
                  gradient: "from-pink-500 via-purple-500 to-orange-500",
                  hoverGradient: "from-pink-600 via-purple-600 to-orange-600",
                  name: "Instagram"
                },
                { 
                  icon: Twitter, 
                  link: "https://twitter.com",
                  gradient: "from-blue-400 to-blue-600",
                  hoverGradient: "from-blue-500 to-blue-700",
                  name: "Twitter"
                },
                { 
                  icon: Facebook, 
                  link: "https://facebook.com",
                  gradient: "from-blue-600 to-blue-800",
                  hoverGradient: "from-blue-700 to-blue-900",
                  name: "Facebook"
                },
                { 
                  icon: Youtube, 
                  link: "https://youtube.com",
                  gradient: "from-red-500 to-red-700",
                  hoverGradient: "from-red-600 to-red-800",
                  name: "YouTube"
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2.5 md:p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-2xl"
                  aria-label={social.name}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${social.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                  
                  <social.icon className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop - Enhanced */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, idx) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-green-400" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company - Enhanced */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-orange-400" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact - Enhanced Icons */}
          <div>
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Contact</h4>
            <div className="space-y-4 text-gray-400 text-sm">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">123 bhimavaram, Andhra Pradesh, India</span>
              </motion.div>
              <motion.a 
                href="tel:+919492974445"
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">+91 9492974445</span>
              </motion.a>
              <motion.a 
                href="mailto:support@sole-mart.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all flex-shrink-0">
                  <Mail className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">support@sole-mart.com</span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SOLE-MART. All rights reserved.
        </div>
      </div>
    </footer>
  );
};