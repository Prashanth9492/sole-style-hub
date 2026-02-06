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
  ChevronRight,
  Sparkles,
  Users,
  UserCircle2,
  Baby,
  Home,
  LogOut,
  Settings,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Package,
  Mail
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
  { name: 'Home', href: '/', icon: Home },
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
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
              
              {/* User Menu */}
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-secondary rounded-full transition-colors hidden sm:flex">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.displayName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.displayName || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/signin" className="hidden sm:flex">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                )
              )}
              
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
              className="fixed top-0 right-0 bottom-0 w-80 bg-background z-50 shadow-xl lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start p-6 pb-4 flex-shrink-0">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-0 hover:opacity-70 transition-opacity"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-6 pb-4 flex-shrink-0">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for shoes..."
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border/50 rounded-full text-sm focus:outline-none focus:border-foreground/50 transition-all duration-200"
                    />
                  </div>
                </form>
              </div>

              {/* Scrollable Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors border-b border-border/30"
                      >
                        <span className="text-base font-normal">{link.name}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                      {link.hasDropdown && (
                        <div className="bg-secondary/20">
                          {footwearTypes.map((type) => (
                            <Link
                              key={type.slug}
                              to={`/category/${link.name.toLowerCase()}/${type.slug}`}
                              className="flex items-center justify-between px-6 py-3 pl-12 hover:bg-secondary/50 transition-colors border-b border-border/20"
                            >
                              <span className="text-sm text-muted-foreground">{type.name}</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  

                </nav>
              </div>

              {/* Bottom Section - Quick Navigation Icons */}
              <div className="flex-shrink-0 border-t border-border bg-gradient-to-b from-background to-secondary/20">
                {user && (
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30 bg-background/50">
                    <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-primary/20">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="text-sm bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold">
                        {getInitials(user.displayName || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">{user.displayName || 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>
                )}
                
                {/* Navigation Icons */}
                <div className="flex items-center justify-around px-4 py-6">
                  <Link to="/wishlist" className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2.5 rounded-full bg-pink-500/10 group-hover:bg-pink-500/20 transition-all duration-200">
                      <Heart className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
                    </div>
                  </Link>
                  <Link to="/account" className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-200">
                      <User className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                  </Link>
                  <Link to="/account?tab=orders" className="flex flex-col items-center gap-1.5 group">
                    <div className="p-2.5 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-200">
                      <Package className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                    </div>
                  </Link>
                  {user ? (
                    <>
                      <Link to="/account" className="flex flex-col items-center gap-1.5 group">
                        <div className="ring-2 ring-primary/30 rounded-full group-hover:ring-primary/50 transition-all duration-200">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-primary text-white">
                              {getInitials(user.displayName || user.email)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </Link>
                      <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 group">
                        <div className="p-2.5 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-200">
                          <LogOut className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                        </div>
                      </button>
                    </>
                  ) : (
                    <Link to="/signin" className="flex flex-col items-center gap-1.5 group">
                      <div className="p-2.5 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-200">
                        <User className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 lg:hidden"
          >
            <div className="container-premium section-padding h-full flex flex-col">
              <div className="flex items-center justify-between h-16 gap-4">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchInput('');
                  }}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">Search</span>
                <div className="w-9" /> {/* Spacer for centering */}
              </div>
              
              <div className="pt-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for shoes, sneakers, boots..."
                      className="w-full pl-12 pr-4 py-4 bg-secondary border border-border/50 rounded-2xl text-base focus:outline-none focus:border-foreground/50 transition-all duration-200"
                      autoFocus
                    />
                  </div>
                </form>
                
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Sneakers', 'Running Shoes', 'Boots', 'Sandals', 'Formal Shoes'].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchInput(term);
                          setSearchQuery(term);
                          setIsSearchOpen(false);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="px-4 py-2 bg-secondary hover:bg-accent rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};
