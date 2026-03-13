import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  { label: 'Sneakers', path: '/search?q=sneakers' },
  { label: 'Running Shoes', path: '/search?q=running shoes' },
  { label: 'Boots', path: '/search?q=boots' },
  { label: 'Sandals', path: '/search?q=sandals' },
  { label: 'Formal Shoes', path: '/search?q=formal shoes' },
];

const MobileSearchModal = ({ isOpen, onClose }: MobileSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handlePopularSearch = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] sm:hidden"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[101] bg-white sm:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <button
                onClick={onClose}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Search</h2>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>

            {/* Search Input */}
            <div className="px-5 py-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for shoes, sneakers, boots..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>
              </form>
            </div>

            {/* Popular Searches */}
            <div className="px-5 py-2 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {popularSearches.map((search) => (
                  <motion.button
                    key={search.label}
                    onClick={() => handlePopularSearch(search.path)}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-full transition-colors border border-gray-200"
                  >
                    {search.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;
