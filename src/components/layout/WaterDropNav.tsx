import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';

const WaterDropNav = () => {
  const [activeLink, setActiveLink] = useState('new');

  const navLinks = [
    { id: 'new', label: 'New', path: '/' },
    { id: 'men', label: 'Men', path: '/category/men' },
    { id: 'women', label: 'Women', path: '/category/women' },
    { id: 'kids', label: 'Kids', path: '/category/kids' },
  ];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="water-drop-nav">
        {/* Home Icon */}
        <Link 
          to="/"
          className="nav-home-icon"
          onClick={() => setActiveLink('home')}
        >
          <Home size={20} />
        </Link>

        {/* Navigation Links */}
        <div className="nav-links-container">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={() => setActiveLink(link.id)}
              className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
            >
              {link.label}
              {activeLink === link.id && (
                <span className="nav-link-droplet" />
              )}
            </Link>
          ))}
        </div>

        {/* Email/Contact */}
        <button className="nav-contact-btn">
          <Mail size={16} className="mr-2" />
          contact@solestyle.com
        </button>
      </nav>
    </div>
  );
};

export default WaterDropNav;
