import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/image.png';
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
            {/* Logo - Enhanced with Animation */}
            <Link to="/" className="flex-shrink-0 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <img 
                  src={logo} 
                  alt="STRIDE Logo" 
                  className="h-16 w-24 md:h-20 md:w-28 lg:h-24 lg:w-32 object-contain transition-all duration-300 group-hover:drop-shadow-2xl" 
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
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

            {/* Actions - Enhanced Icons with Gradient Backgrounds */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative p-2 md:p-2.5 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 hover:shadow-lg group"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              </motion.button>

              {/* Wishlist Button */}
              <Link to="/wishlist" className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 md:p-2.5 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 hover:from-pink-200 hover:to-red-200 dark:hover:from-pink-900/50 dark:hover:to-red-900/50 transition-all duration-300 hover:shadow-lg group overflow-visible"
                >
                  <Heart className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300 group-hover:fill-pink-200 transition-all" />
                  {wishlistItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-pink-500 text-white text-xs md:text-sm font-extrabold rounded-full flex items-center justify-center shadow-xl ring-2 ring-white dark:ring-gray-900 z-20"
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Cart Button */}
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 md:p-2.5 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 transition-all duration-300 hover:shadow-lg group overflow-visible"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-red-500 text-white text-xs md:text-sm font-extrabold rounded-full flex items-center justify-center shadow-xl ring-2 ring-white dark:ring-gray-900 z-20"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
              
              {/* User Menu - Enhanced */}
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-full transition-all duration-300 hidden sm:flex hover:shadow-lg relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all" />
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all relative z-10">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                            {getInitials(user.displayName || user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </motion.button>
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
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="sm" className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                        <User className="w-4 h-4" />
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                )
              )}
              
              {/* Mobile Menu Button - Enhanced */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hidden hover:shadow-lg group overflow-hidden relative"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all" />
                <Menu className="w-5 h-5 md:w-6 md:h-6 relative z-10 text-foreground group-hover:text-orange-600 transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Enhanced */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Enhanced Backdrop with gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-pink-900/30 backdrop-blur-md z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Enhanced Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 z-50 shadow-2xl lg:hidden flex flex-col border-l-2 border-purple-500/20"
            >
              {/* Header - Enhanced with gradient */}
              <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 border-b border-border/30">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Menu className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Menu
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <X className="w-6 h-6 text-foreground group-hover:text-red-600 transition-colors" />
                </motion.button>
              </div>

              {/* Mobile Search - Enhanced */}
              <div className="px-6 py-4 flex-shrink-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                <form onSubmit={handleSearch} className="w-full">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                      <Search className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for shoes..."
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-border/50 rounded-2xl text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 shadow-sm"
                    />
                  </motion.div>
                </form>
              </div>

              {/* Scrollable Navigation - Enhanced with icons and gradients */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent via-purple-50/20 to-blue-50/20 dark:via-gray-900/20 dark:to-gray-800/20">
                <nav className="flex flex-col py-2">
                  {navLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    const gradients = [
                      'from-blue-500/10 to-cyan-500/10',
                      'from-purple-500/10 to-pink-500/10',
                      'from-green-500/10 to-emerald-500/10',
                      'from-orange-500/10 to-red-500/10',
                      'from-yellow-500/10 to-amber-500/10',
                    ];
                    const iconColors = [
                      'text-blue-600',
                      'text-purple-600',
                      'text-green-600',
                      'text-orange-600',
                      'text-yellow-600',
                    ];
                    
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 mb-2"
                      >
                        <Link
                          to={link.href}
                          className="group"
                        >
                          <motion.div
                            whileHover={{ x: 5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${gradients[index % gradients.length]} hover:shadow-lg transition-all duration-300 border border-transparent hover:border-current`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-sm group-hover:shadow-md transition-all`}>
                                <IconComponent className={`w-5 h-5 ${iconColors[index % iconColors.length]}`} />
                              </div>
                              <span className="text-base font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                                {link.name}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                          </motion.div>
                        </Link>
                        
                        {/* Subcategories - Enhanced */}
                        {link.hasDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="mt-2 ml-4 space-y-1 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-2 border border-border/30"
                          >
                            {footwearTypes.map((type, typeIndex) => (
                              <Link
                                key={type.slug}
                                to={`/category/${link.name.toLowerCase()}/${type.slug}`}
                                className="group"
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 + typeIndex * 0.03 }}
                                  whileHover={{ x: 8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 hover:shadow-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                                      {type.icon}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                      {type.name}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                </motion.div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Section - Enhanced User Profile & Quick Navigation */}
              <div className="flex-shrink-0 border-t border-border/50 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 backdrop-blur-sm">
                {user && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-6 py-4 border-b border-border/30 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-md" />
                      <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-purple-500/30 relative z-10">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback className="text-sm bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                          {getInitials(user.displayName || user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {user.displayName || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </motion.div>
                )}
                
                {/* Navigation Icons - Enhanced Mobile */}
                <div className="flex items-center justify-around px-4 py-6">
                  <Link to="/wishlist" className="flex flex-col items-center gap-2 group">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 group-hover:from-pink-500/30 group-hover:to-red-500/30 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                    >
                      <Heart className="w-6 h-6 text-pink-600 group-hover:fill-pink-500 transition-all" />
                    </motion.div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-pink-600 transition-colors">Wishlist</span>
                  </Link>
                  <Link to="/account" className="flex flex-col items-center gap-2 group">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                    >
                      <User className="w-6 h-6 text-blue-600 transition-transform" />
                    </motion.div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">Account</span>
                  </Link>
                  <Link to="/account?tab=orders" className="flex flex-col items-center gap-2 group">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                    >
                      <Package className="w-6 h-6 text-green-600 transition-transform" />
                    </motion.div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-green-600 transition-colors">Orders</span>
                  </Link>
                  {user ? (
                    <>
                      <Link to="/account" className="flex flex-col items-center gap-2 group">
                        <motion.div 
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-lg group-hover:blur-xl transition-all" />
                          <Avatar className="h-10 w-10 ring-2 ring-purple-500/40 group-hover:ring-purple-500/60 transition-all relative z-10">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                              {getInitials(user.displayName || user.email)}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">Profile</span>
                      </Link>
                      <button onClick={handleLogout} className="flex flex-col items-center gap-2 group">
                        <motion.div 
                          whileHover={{ scale: 1.15, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                        >
                          <LogOut className="w-6 h-6 text-red-600 transition-transform" />
                        </motion.div>
                        <span className="text-[10px] font-medium text-muted-foreground group-hover:text-red-600 transition-colors">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link to="/signin" className="flex flex-col items-center gap-2 group">
                      <motion.div 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 group-hover:from-purple-500/30 group-hover:to-indigo-500/30 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                      >
                        <User className="w-6 h-6 text-purple-600 transition-transform" />
                      </motion.div>
                      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">Sign In</span>
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
