import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Users,
  UserCircle2,
  Baby
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/contexts/SearchContext';

const footwearTypes = [
  { name: 'Boots', slug: 'boots', icon: '👢' },
  { name: 'Casual Shoes', slug: 'casual', icon: '👟' },
  { name: 'Flip Flops & Slippers', slug: 'flip-flops', icon: '🩴' },
  { name: 'Formal Shoes', slug: 'formal', icon: '👞' },
  { name: 'Sandals', slug: 'sandals', icon: '👡' },
  { name: 'Sneakers', slug: 'sneakers', icon: '👟' },
  { name: 'Sports Shoes', slug: 'sports', icon: '⚽' },
];

const navLinks = [
  { name: 'New', href: '/new', icon: Sparkles },
  { name: 'Men', href: '/category/men', hasDropdown: true, icon: Users },
  { name: 'Women', href: '/category/women', hasDropdown: true, icon: UserCircle2 },
  { name: 'Kids', href: '/category/kids', hasDropdown: true, icon: Baby },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { isSearchOpen, setIsSearchOpen, setSearchQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-sm' : 'bg-background'
          }`}
      >
        <div className="container-premium section-padding">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold tracking-tight">STRIDE</span>
            </Link>

            {/* Center Section - Navigation or Search */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.form
                    key="search"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="w-full max-w-xl"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for shoes, sneakers, boots..."
                        className="w-full pl-10 pr-10 py-2 bg-secondary border border-border/50 rounded-full text-sm focus:outline-none focus:border-foreground/50 transition-all duration-200"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchInput('');
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background/80 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.nav
                    key="nav"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-8"
                  >
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <div
                          key={link.name}
                          className="relative"
                          onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <Link
                            to={link.href}
                            className={`nav-link flex items-center gap-2 ${location.pathname === link.href ? 'text-foreground' : ''
                              }`}
                          >
                            <Icon className="w-4 h-4" />
                            {link.name}
                            {link.hasDropdown && (
                              <ChevronDown
                                className="w-4 h-4 transition-transform duration-200"
                                style={{
                                  transform: activeDropdown === link.name ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                              />
                            )}
                          </Link>

                        {/* Dropdown Menu */}
                        {link.hasDropdown && (
                          <AnimatePresence>
                            {activeDropdown === link.name && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50"
                              >
                                <div className="py-2">
                                  {footwearTypes.map((type, index) => (
                                    <Link
                                      key={type.slug}
                                      to={`/category/${link.name.toLowerCase()}/${type.slug}`}
                                      className="block px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                                    >
                                      <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="text-base">{type.icon}</span>
                                        <span className="font-semibold">{type.name}</span>
                                      </motion.div>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                        </div>
                      );
                    })}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>

            {/* Actions - Right side */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                to="/wishlist"
                className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:flex relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full text-xs flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="p-2 hover:bg-secondary rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs font-semibold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:flex">
                <User className="w-5 h-5" />
              </button>
              <button
                className="p-2 hover:bg-secondary rounded-full transition-colors lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background z-50 shadow-xl lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-secondary rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className="block py-3 text-lg font-medium hover:text-muted-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                      {link.hasDropdown && (
                        <div className="ml-4 mt-2 space-y-2">
                          {footwearTypes.map((type) => (
                            <Link
                              key={type.slug}
                              to={`/category/${link.name.toLowerCase()}/${type.slug}`}
                              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {type.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </Link>
                    <Link
                      to="/account"
                      className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Account
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};
