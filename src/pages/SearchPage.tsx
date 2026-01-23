import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/products`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
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
            return price < 50;
          case '50-100':
            return price >= 50 && price < 100;
          case '100-150':
            return price >= 100 && price < 150;
          case 'over-150':
            return price >= 150;
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
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
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
                className="text-muted-foreground text-lg"
              >
                Showing results for "<span className="font-semibold text-foreground">{query}</span>"
                {filteredProducts.length > 0 && (
                  <span> - {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</span>
                )}
              </motion.p>
            )}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-secondary rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-foreground"
                >
                  <option value="all">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 bg-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-foreground"
                >
                  <option value="all">All Prices</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-150">$100 - $150</option>
                  <option value="over-150">Over $150</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-background hover:bg-background/80 rounded-lg border border-border transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
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
