import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useSearch } from '@/contexts/SearchContext';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query || searchQuery) {
      filterProducts(query || searchQuery);
    }
  }, [query, searchQuery, products, selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/products`);
      
      if (response.ok) {
        const data = await response.json();
        // Map MongoDB _id to id for consistent navigation
        const mappedProducts = data.map((product: any) => ({
          ...product,
          id: product._id || product.id,
        }));
        setProducts(mappedProducts);
      } else {
        // Fallback to static data if API fails
        const { products: staticProducts } = await import('@/data/products');
        setProducts(staticProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data
      const { products: staticProducts } = await import('@/data/products');
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    let results = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.subCategory.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    });

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter((product) => product.category === selectedCategory);
    }

    // Apply price range filter
    if (priceRange !== 'all') {
      results = results.filter((product) => {
        const price = product.discountPrice || product.price;
        switch (priceRange) {
          case 'under-50':
            return price < 4000;
          case '50-100':
            return price >= 4000 && price < 8000;
          case '100-150':
            return price >= 8000 && price < 12000;
          case 'over-150':
            return price >= 12000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(results);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 pb-20">
        <div className="container-premium section-padding">
          {/* Header + Filters inline */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <Search className="w-6 h-6" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Search Results
                </h1>
              </motion.div>
              {query && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground text-base"
                >
                  Showing results for "<span className="font-semibold text-foreground">{query}</span>"
                  {filteredProducts.length > 0 && (
                    <span> - {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</span>
                  )}
                </motion.p>
              )}
            </div>

            {/* Compact Filters - top right corner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 flex-shrink-0 flex-wrap"
            >
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-xl text-xs font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                    boxShadow: '3px 3px 8px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.85)',
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-xl text-xs font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                    boxShadow: '3px 3px 8px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.85)',
                  }}
                >
                  <option value="all">All Prices</option>
                  <option value="under-50">Under ₹4,000</option>
                  <option value="50-100">₹4,000 - ₹8,000</option>
                  <option value="100-150">₹8,000 - ₹12,000</option>
                  <option value="over-150">Over ₹12,000</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {(selectedCategory !== 'all' || priceRange !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 transition-all active:scale-90"
                  style={{
                    background: 'linear-gradient(145deg, #f5f7fc, #e2e4e9)',
                    boxShadow: '3px 3px 8px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.85)',
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
          ) : !query && !searchQuery ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">Start Your Search</h2>
              <p className="text-muted-foreground mb-8">
                Enter a search term to find your perfect pair of shoes
              </p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                Browse All Products
              </Link>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">No Results Found</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't find any products matching "{query || searchQuery}"
                <br />
                Try adjusting your search or filters
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="btn-outline"
                >
                  Clear Filters
                </button>
                <Link to="/" className="btn-primary">
                  Browse All Products
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id || product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
