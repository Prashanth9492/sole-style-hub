import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/image.png';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
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
  { name: 'Slides & Slippers', slug: 'flip-flops', icon: '🩴' },
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
  const [shoeTypeGender, setShoeTypeGender] = useState<'men' | 'women' | 'kids'>('men');
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
                                  {footwearTypes
                                    .filter(type => {
                                      if (link.name === 'Women' && type.slug === 'formal') return false;
                                      if (link.name === 'Kids' && (type.slug === 'formal' || type.slug === 'casual')) return false;
                                      return true;
                                    })
                                    .map((type, index) => (
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

            {/* Actions - Neumorphic Water Drop B&W */}
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative p-2.5 md:p-3 rounded-full transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                  boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                }}
              >
                <Search className="w-4 h-4 md:w-[18px] md:h-[18px] relative z-10 text-gray-700 group-hover:text-black transition-colors" />
              </motion.button>

              {/* Wishlist Button */}
              <Link to="/wishlist" className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative p-2.5 md:p-3 rounded-full transition-all duration-300 group overflow-visible"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                    boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                  }}
                >
                  <Heart className="w-4 h-4 md:w-[18px] md:h-[18px] relative z-10 text-gray-700 group-hover:text-black transition-all" />
                  {wishlistItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-[22px] md:h-[22px] bg-gray-900 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white z-20"
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Cart Button */}
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative p-2.5 md:p-3 rounded-full transition-all duration-300 group overflow-visible"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                    boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                  }}
                >
                  <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px] relative z-10 text-gray-700 group-hover:text-black transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-[22px] md:h-[22px] bg-gray-900 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white z-20"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
              
              {/* User Menu */}
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button 
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="rounded-full transition-all duration-300 hidden sm:flex relative group overflow-visible"
                        style={{
                          padding: '3px',
                          background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                          boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                        }}
                      >
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 relative z-10">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="text-xs bg-gray-900 text-white font-bold">
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
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="p-2.5 md:p-3 rounded-full transition-all duration-300"
                      style={{
                        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                        boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                      }}
                    >
                      <User className="w-4 h-4 md:w-[18px] md:h-[18px] text-gray-700" />
                    </motion.div>
                  </Link>
                )
              )}
              
              {/* Mobile Menu Button - 2x2 Grid Style */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-2.5 md:p-3 rounded-full transition-all duration-300 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                  boxShadow: '5px 5px 12px rgba(0,0,0,0.08), -5px -5px 12px rgba(255,255,255,0.9)',
                }}
              >
                <div className="w-5 h-5 md:w-[22px] md:h-[22px] grid grid-cols-2 gap-[3px]">
                  <span className="rounded-[3px] bg-gray-700" />
                  <span className="rounded-[3px] bg-gray-700" />
                  <span className="rounded-[3px] bg-gray-700" />
                  <span className="rounded-[3px] bg-gray-700" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Visuo Neumorphic Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[340px] z-50 lg:hidden flex flex-col overflow-hidden"
              style={{ background: '#eef0f5' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                <span className="text-lg font-bold text-gray-800 tracking-tight">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl"
                  style={{
                    background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                    boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -4px -4px 10px rgba(255,255,255,0.9)',
                  }}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="px-5 pb-4 flex-shrink-0">
                <form onSubmit={handleSearch} className="w-full">
                  <div
                    className="relative rounded-2xl"
                    style={{
                      background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                      boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.06), inset -3px -3px 6px rgba(255,255,255,0.8)',
                    }}
                  >
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for shoes..."
                      className="w-full pl-10 pr-4 py-3 bg-transparent rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-6">
                {/* Browse Categories */}
                <h3 className="text-base font-bold text-gray-800 mb-4 tracking-tight">Browse Categories</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {navLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    const iconBgs = ['bg-blue-100', 'bg-purple-100', 'bg-pink-100', 'bg-violet-100', 'bg-orange-100'];
                    const iconColors = ['text-blue-500', 'text-purple-500', 'text-pink-500', 'text-violet-500', 'text-orange-500'];

                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <Link
                          to={link.href}
                          className="flex flex-col items-center justify-center py-5 px-3 rounded-2xl transition-all active:scale-95"
                          style={{
                            background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                            boxShadow: '6px 6px 14px rgba(0,0,0,0.07), -6px -6px 14px rgba(255,255,255,0.85)',
                          }}
                        >
                          <div className={`w-12 h-12 rounded-full ${iconBgs[index % iconBgs.length]} flex items-center justify-center mb-2.5`}>
                            <IconComponent className={`w-5 h-5 ${iconColors[index % iconColors.length]}`} />
                          </div>
                          <span className="text-[13px] font-semibold text-gray-700">{link.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Shoe Types */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-800 tracking-tight">Shoe Types</h3>
                  <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'linear-gradient(145deg, #e2e4e9, #f5f7fc)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.06), inset -2px -2px 4px rgba(255,255,255,0.7)' }}>
                    {(['men', 'women', 'kids'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setShoeTypeGender(g)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          shoeTypeGender === g
                            ? 'text-white'
                            : 'text-gray-500'
                        }`}
                        style={shoeTypeGender === g ? {
                          background: 'linear-gradient(145deg, #3b3b3b, #1a1a1a)',
                          boxShadow: '3px 3px 8px rgba(0,0,0,0.15), -2px -2px 6px rgba(255,255,255,0.1)',
                        } : {}}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {footwearTypes
                    .filter(type => {
                      if (shoeTypeGender === 'women' && type.slug === 'formal') return false;
                      if (shoeTypeGender === 'kids' && (type.slug === 'formal' || type.slug === 'casual')) return false;
                      return true;
                    })
                    .map((type, index) => (
                    <motion.div
                      key={type.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.04 }}
                    >
                      <Link
                        to={`/category/${shoeTypeGender}/${type.slug}`}
                        className="flex flex-col items-center justify-center py-4 px-3 rounded-2xl transition-all active:scale-95"
                        style={{
                          background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                          boxShadow: '6px 6px 14px rgba(0,0,0,0.07), -6px -6px 14px rgba(255,255,255,0.85)',
                        }}
                      >
                        <span className="text-2xl mb-2">{type.icon}</span>
                        <span className="text-[12px] font-medium text-gray-600 text-center leading-tight">{type.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Links */}
                <h3 className="text-base font-bold text-gray-800 mb-4 tracking-tight">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Heart, label: 'Wishlist', href: '/wishlist', bg: 'bg-pink-100', color: 'text-pink-500' },
                    { icon: ShoppingBag, label: 'Cart', href: '/cart', bg: 'bg-amber-100', color: 'text-amber-500' },
                    { icon: Package, label: 'Orders', href: '/account?tab=orders', bg: 'bg-green-100', color: 'text-green-500' },
                    { icon: User, label: user ? 'Account' : 'Sign In', href: user ? '/account' : '/signin', bg: 'bg-blue-100', color: 'text-blue-500' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        className="flex flex-col items-center justify-center py-5 px-3 rounded-2xl transition-all active:scale-95 relative"
                        style={{
                          background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                          boxShadow: '6px 6px 14px rgba(0,0,0,0.07), -6px -6px 14px rgba(255,255,255,0.85)',
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-2.5`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{item.label}</span>
                        {item.label === 'Cart' && totalItems > 0 && (
                          <span className="absolute top-2 right-3 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                        {item.label === 'Wishlist' && wishlistItems.length > 0 && (
                          <span className="absolute top-2 right-3 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Logout button */}
                {user && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={handleLogout}
                    className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-red-500 text-sm font-semibold active:scale-95 transition-all"
                    style={{
                      background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                      boxShadow: '6px 6px 14px rgba(0,0,0,0.07), -6px -6px 14px rgba(255,255,255,0.85)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </motion.button>
                )}
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
