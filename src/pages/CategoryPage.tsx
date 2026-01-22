import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Rated', value: 'rating' },
];

const subcategoryDescriptions: Record<string, Record<string, { title: string; description: string }>> = {
  men: {
    boots: {
      title: "Men's Boots",
      description: "Men's boots are a versatile essential for any wardrobe, offering both style and durability across various occasions. From rugged work boots to sleek Chelsea designs, these shoes provide protection and confidence in any weather condition. Whether you're navigating city streets or outdoor trails, the right pair of boots combines comfort with a bold statement that elevates your entire look."
    },
    casual: {
      title: "Men's Casual Shoes",
      description: "Men's casual shoes strike the perfect balance between comfort and style for everyday wear. Designed for versatility, these shoes effortlessly transition from weekend outings to relaxed office environments. With a wide range of styles from loafers to canvas sneakers, casual footwear offers the freedom to express your personal style while keeping your feet comfortable throughout the day."
    },
    'flip-flops': {
      title: "Men's Flip Flops & Slippers",
      description: "Men's flip flops and slippers provide the ultimate in relaxation and easy-going style. Perfect for beach days, poolside lounging, or simply unwinding at home, these shoes prioritize comfort without compromising on design. From sporty athletic slides to cushioned flip flops, this footwear category ensures your feet stay cool and comfortable during leisure time."
    },
    formal: {
      title: "Men's Formal Shoes",
      description: "Men formal shoes have always held a distinct place in a man's wardrobe, shaping the way outfits are perceived. From sleek designs to structured finishes, these shoes offer a polished look that can subtly transform an appearance. Choosing the right pair means understanding the different types and designs available, so you can select shoes that match both the setting and your personal taste. With so many options available, formal shoes for guys provide an easy way to achieve a refined and confident look."
    },
    sandals: {
      title: "Men's Sandals",
      description: "Men's sandals offer breathable comfort and effortless style for warm weather adventures. Whether you're exploring coastal paths or enjoying urban summer days, sandals provide the perfect combination of support and ventilation. From sporty designs with adjustable straps to minimalist leather options, these shoes keep your feet cool while maintaining a contemporary aesthetic."
    },
    sneakers: {
      title: "Men's Sneakers",
      description: "Men's sneakers have evolved from athletic wear to a cornerstone of modern fashion. These versatile shoes seamlessly blend performance technology with street-style aesthetics, making them suitable for everything from gym sessions to casual social gatherings. With endless colorways, materials, and designs, sneakers allow you to express your personality while enjoying unmatched comfort and support."
    },
    sports: {
      title: "Men's Sports Shoes",
      description: "Men's sports shoes are engineered for peak performance, offering specialized features for various athletic activities. From running tracks to basketball courts, these shoes provide the support, cushioning, and traction needed to excel in your chosen sport. Advanced materials and innovative designs ensure your feet stay protected and comfortable, helping you push your limits and achieve your fitness goals."
    }
  },
  women: {
    boots: {
      title: "Women's Boots",
      description: "Women's boots are a fashion-forward essential that combines elegance with practicality. From ankle booties to knee-high designs, these shoes add instant sophistication to any outfit while providing warmth and protection. Whether you prefer classic leather styles or trendy embellished options, boots empower you to make a bold statement while staying comfortable throughout the seasons."
    },
    casual: {
      title: "Women's Casual Shoes",
      description: "Women's casual shoes offer endless possibilities for creating effortlessly chic everyday looks. Designed for comfort and versatility, these shoes adapt to your lifestyle whether you're running errands or meeting friends for brunch. From stylish sneakers to comfortable flats, casual footwear allows you to express your unique style while keeping pace with your busy day."
    },
    'flip-flops': {
      title: "Women's Flip Flops & Slippers",
      description: "Women's flip flops and slippers are the perfect companions for relaxation and casual comfort. Ideal for beach vacations, spa days, or cozy evenings at home, these shoes prioritize ease without sacrificing style. With options ranging from embellished designs to minimalist classics, they offer a quick and comfortable solution for those moments when you want to unwind in style."
    },
    formal: {
      title: "Women's Formal Shoes",
      description: "Women's formal shoes are the finishing touch that elevates professional and elegant ensembles. From classic pumps to sophisticated heels, these shoes exude confidence and grace for important meetings, special events, and formal occasions. Choosing the perfect pair means finding the balance between timeless elegance and modern trends, ensuring you look polished and feel empowered in any formal setting."
    },
    sandals: {
      title: "Women's Sandals",
      description: "Women's sandals bring a breath of fresh air to warm-weather wardrobes with their open designs and stylish appeal. Perfect for showcasing pedicured toes while keeping feet cool, sandals range from casual flat designs to dressy heeled options. Whether you're strolling through summer festivals or dining al fresco, the right pair of sandals combines comfort with feminine charm."
    },
    sneakers: {
      title: "Women's Sneakers",
      description: "Women's sneakers have become a fashion statement that seamlessly merges athletic functionality with contemporary style. These versatile shoes complement everything from athleisure outfits to casual dresses, offering all-day comfort without compromising on aesthetics. With countless designs, colors, and collaborations available, sneakers allow you to showcase your personality while enjoying superior support and cushioning."
    },
    sports: {
      title: "Women's Sports Shoes",
      description: "Women's sports shoes are specifically designed to support female athletes in achieving their fitness goals. Engineered with features that accommodate women's biomechanics, these shoes provide optimal cushioning, stability, and flexibility for various activities. From yoga studios to running trails, sports shoes empower you to perform at your best while keeping your feet protected and comfortable during every workout."
    }
  },
  kids: {
    boots: {
      title: "Kids' Boots",
      description: "Kids' boots are designed to keep little feet warm, dry, and protected during outdoor adventures. Built to withstand active play in various weather conditions, these durable shoes feature easy-on designs that encourage independence. From waterproof rain boots to cozy winter styles, kids' boots combine practical functionality with fun colors and patterns that children love to wear."
    },
    casual: {
      title: "Kids' Casual Shoes",
      description: "Kids' casual shoes are the go-to choice for everyday activities, offering comfort and durability for growing feet. Designed to keep up with energetic lifestyles, these shoes feature flexible soles and breathable materials that support healthy foot development. With styles that appeal to children's tastes and easy closures for independent dressing, casual shoes make daily routines simpler for both kids and parents."
    },
    'flip-flops': {
      title: "Kids' Flip Flops & Slippers",
      description: "Kids' flip flops and slippers provide easy-wearing comfort for leisure time and warm weather fun. Perfect for pool days, beach outings, or relaxing at home, these lightweight shoes are simple to slip on and off. Designed with non-slip soles and child-friendly materials, they offer safe and comfortable options for kids to enjoy their downtime in carefree style."
    },
    formal: {
      title: "Kids' Formal Shoes",
      description: "Kids' formal shoes help young ones look their best for special occasions and important events. From weddings to school ceremonies, these polished shoes add a sophisticated touch to dressy outfits. Designed with both style and comfort in mind, formal footwear for children ensures they can participate in events with confidence while still feeling comfortable enough to enjoy the celebration."
    },
    sandals: {
      title: "Kids' Sandals",
      description: "Kids' sandals offer breathable comfort for active children during warm weather months. Designed with secure straps and supportive soles, these open shoes allow little feet to stay cool while providing the protection needed for playground adventures. From sporty designs to cute summer styles, sandals are perfect for keeping kids comfortable whether they're exploring nature or playing in the backyard."
    },
    sneakers: {
      title: "Kids' Sneakers",
      description: "Kids' sneakers are essential footwear that supports active play and healthy foot development. Built to endure the rigors of running, jumping, and climbing, these shoes feature durable construction and cushioned support. With exciting colors, fun designs, and easy-to-use closures like Velcro or elastic laces, sneakers make it simple for kids to stay active while expressing their personal style."
    },
    sports: {
      title: "Kids' Sports Shoes",
      description: "Kids' sports shoes are specially engineered to support young athletes in their favorite activities. Whether for soccer practice, basketball games, or track and field, these shoes provide the specific features needed for each sport. Designed to protect growing feet while enhancing performance, sports shoes help children build confidence and skills in their athletic pursuits while ensuring comfort and safety."
    }
  }
};

const CategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [category, subcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      let url = `${apiUrl}/products?category=${category}`;
      if (subcategory) {
        url += `&subcategory=${subcategory}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Map API data to expected format
        const mappedProducts = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          subCategory: p.subCategory,
          price: p.price,
          discountPrice: p.discountPrice,
          sizes: p.sizes,
          colors: p.colors,
          stock: p.stock,
          images: p.images,
          description: p.description,
          rating: 4.5,
          reviews: 0,
          inStock: p.inStock,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryInfo = {
    id: category,
    name: category ? category.charAt(0).toUpperCase() + category.slice(1) : '',
    subCategories: ['boots', 'casual', 'flip-flops', 'formal', 'sandals', 'sneakers', 'sports']
  };

  // Handle URL subcategory parameter or query parameter for footwear type
  useEffect(() => {
    // Don't apply client-side filtering if subcategory is in URL (already filtered by API)
    if (subcategory) {
      setSelectedSubCategories([]);
    } else {
      const typeParam = searchParams.get('type');
      if (typeParam) {
        setSelectedSubCategories([typeParam]);
      } else {
        setSelectedSubCategories([]);
      }
    }
  }, [subcategory, searchParams]);

  const filteredProducts = selectedSubCategories.length > 0 && !subcategory
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
      <main className="pb-20">
        <div className="container-premium section-padding">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link
                  to={`/category/${category}`}
                  className={subcategory ? "text-muted-foreground hover:text-foreground transition-colors" : "font-medium"}
                >
                  {categoryInfo.name}
                </Link>
              </li>
              {subcategory && (
                <>
                  <li className="text-muted-foreground">/</li>
                  <li className="font-medium capitalize">
                    {subcategory === 'flip-flops' ? 'Flip Flops & Slippers' : subcategory.replace('-', ' ')}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            {subcategory && category && subcategoryDescriptions[category]?.[subcategory] ? (
              <>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2" style={{ fontSize: '10px', letterSpacing: '2px' }}>
                  {categoryInfo.name}'s
                </p>
                <h1 className="text-4xl lg:text-5xl font-serif mb-3" style={{ fontWeight: 300, lineHeight: '0.7' }}>
                  {subcategory === 'flip-flops' ? 'Flip Flops & Slippers' : subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')}
                </h1>
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-2" style={{ lineHeight: '1.5', color: '#666' }}>
                    {subcategoryDescriptions[category][subcategory].description}
                  </p>
                  {/* <button className="text-sm font-medium underline hover:no-underline transition-all">
                    Read More
                  </button> */}
                </div>
              </>
            ) : (
              <>
                <h1 className="heading-section mb-2">{categoryInfo.name}'s Footwear</h1>
                <p className="text-body">{categoryInfo.description}</p>
              </>
            )}
          </motion.div>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
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
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
