import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductsByCategory, categories } from '@/data/products';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Rated', value: 'rating' },
];

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const products = getProductsByCategory(category || '');
  const categoryInfo = categories.find((c) => c.id === category);

  const filteredProducts = selectedSubCategories.length
    ? products.filter((p) => selectedSubCategories.includes(p.subCategory))
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case 'price-desc':
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleSubCategory = (sub: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 pb-20">
        <div className="container-premium section-padding">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium">{categoryInfo.name}</li>
            </ol>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="heading-section mb-2">{categoryInfo.name}'s Footwear</h1>
            <p className="text-body">{categoryInfo.description}</p>
          </motion.div>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-accent transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <span className="text-sm text-muted-foreground">
                {sortedProducts.length} Products
              </span>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-secondary rounded-full text-sm font-medium cursor-pointer focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Filter Tags */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-2">
                {categoryInfo.subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => toggleSubCategory(sub)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedSubCategories.includes(sub)
                        ? 'bg-foreground text-background'
                        : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {selectedSubCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggleSubCategory(sub)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-foreground text-background rounded-full text-xs font-medium capitalize"
                >
                  {sub}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={() => setSelectedSubCategories([])}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <button
                onClick={() => setSelectedSubCategories([])}
                className="mt-4 text-sm font-medium underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
