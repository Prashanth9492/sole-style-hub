import { Link } from 'react-router-dom';
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
          
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SOLE-MART
              </span>
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Premium footwear crafted for comfort, style, and confidence.
            </p>

            {/* Social */}
<div className="flex items-center gap-4 mt-6">
  {[
    { icon: Instagram, link: "https://www.instagram.com/_prashanth__02_/" },
    { icon: Twitter, link: "https://twitter.com" },
    { icon: Facebook, link: "https://facebook.com" },
    { icon: Youtube, link: "https://youtube.com" },
  ].map((social, i) => (
    <a
      key={i}
      href={social.link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-xl bg-gray-800 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
    >
      <social.icon className="w-4 h-4" />
    </a>
  ))}
</div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                123 bhimavaram, Andhra Pradesh, India
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                +91 9492974445
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                support@sole-mart.com
              </div>
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