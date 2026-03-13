import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: User, label: 'Account', path: '/account' },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { setIsSearchOpen } = useSearch();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.path === '/search') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 sm:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const badge =
            item.path === '/cart' ? totalItems :
            item.path === '/wishlist' ? wishlistItems.length :
            0;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(item, e)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative',
                active
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', active && 'fill-current')} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-bold leading-none px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <span className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-purple-600" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default MobileBottomNav;
