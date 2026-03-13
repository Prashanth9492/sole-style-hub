import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Truck, RefreshCw, Star, ChevronLeft, ChevronRight, Check, Play, ShieldCheck, ImageIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<{type: 'image' | 'video', url: string} | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchReviews(id);
    }
  }, [id]);

  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/reviews/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('===== REVIEWS DEBUG =====');
        console.log('Total reviews:', data.reviews?.length || 0);
        data.reviews?.forEach((review: any, idx: number) => {
          console.log(`Review ${idx + 1}:`, {
            id: review._id,
            userName: review.userName,
            rating: review.rating,
            hasImages: !!review.images,
            imageCount: review.images?.length || 0,
            images: review.images,
            imageDetails: review.images?.map((img: any, i: number) => ({
              index: i,
              value: img,
              type: typeof img,
              length: img?.length,
              isValidString: typeof img === 'string' && img.trim().length > 0
            })),
            hasVideos: !!review.videos,
            videoCount: review.videos?.length || 0
          });
        });
        console.log('=========================');
        setReviews(data.reviews || []);
        setReviewStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        const mappedProduct = {
          id: data._id || data.id,
          name: data.name,
          brand: data.brand,
          category: data.category,
          subCategory: data.subCategory,
          price: data.price,
          discountPrice: data.discountPrice,
          sizes: data.sizes,
          colors: data.colors,
          stock: data.stock,
          images: data.images,
          description: data.description,
          rating: 4.5,
          reviews: 0,
          inStock: data.inStock,
          isNew: data.isNew,
          isBestseller: data.isBestseller,
        };
        setProduct(mappedProduct);
        
        // Fetch related products with intelligent matching
        // Priority: 1) Same brand + subcategory, 2) Same brand, 3) Same subcategory, 4) Same category
        const relatedResponse = await fetch(`${API_URL}/products`);
        if (relatedResponse.ok) {
          const allProducts = await relatedResponse.json();
          
          // Filter and score products for relevance
          const scoredProducts = allProducts
            .filter((p: any) => (p._id || p.id) !== productId) // Exclude current product
            .map((p: any) => {
              let score = 0;
              
              // Same brand + same subcategory = highest priority (50 points)
              if (p.brand?.toLowerCase() === data.brand?.toLowerCase() && 
                  p.subCategory?.toLowerCase() === data.subCategory?.toLowerCase()) {
                score += 50;
              }
              
              // Same brand only (30 points)
              if (p.brand?.toLowerCase() === data.brand?.toLowerCase()) {
                score += 30;
              }
              
              // Same subcategory (20 points)
              if (p.subCategory?.toLowerCase() === data.subCategory?.toLowerCase()) {
                score += 20;
              }
              
              // Same category (10 points)
              if (p.category?.toLowerCase() === data.category?.toLowerCase()) {
                score += 10;
              }
              
              return {
                ...p,
                relevanceScore: score
              };
            })
            .filter((p: any) => p.relevanceScore > 0) // Only show products with some relevance
            .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore) // Sort by relevance
            .slice(0, 4) // Take top 4
            .map((p: any) => ({
              id: p._id || p.id,
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
          
          setRelatedProducts(scoredProducts);
        }
      } else {
        // Fallback to static data if API product not found
        const { products: staticProducts } = await import('@/data/products');
        const staticProduct = staticProducts.find(p => p.id === productId || p.id === parseInt(productId));
        if (staticProduct) {
          setProduct(staticProduct);
          // Get related products from static data with intelligent matching
          const related = staticProducts
            .filter(p => p.id !== staticProduct.id)
            .map(p => {
              let score = 0;
              if (p.brand?.toLowerCase() === staticProduct.brand?.toLowerCase() && 
                  p.subCategory?.toLowerCase() === staticProduct.subCategory?.toLowerCase()) {
                score += 50;
              }
              if (p.brand?.toLowerCase() === staticProduct.brand?.toLowerCase()) {
                score += 30;
              }
              if (p.subCategory?.toLowerCase() === staticProduct.subCategory?.toLowerCase()) {
                score += 20;
              }
              if (p.category?.toLowerCase() === staticProduct.category?.toLowerCase()) {
                score += 10;
              }
              return { ...p, relevanceScore: score };
            })
            .filter(p => p.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to static data on error
      try {
        const { products: staticProducts } = await import('@/data/products');
        const staticProduct = staticProducts.find(p => p.id === productId || p.id === parseInt(productId));
        if (staticProduct) {
          setProduct(staticProduct);
          // Get related products from static data with intelligent matching
          const related = staticProducts
            .filter(p => p.id !== staticProduct.id)
            .map(p => {
              let score = 0;
              if (p.brand?.toLowerCase() === staticProduct.brand?.toLowerCase() && 
                  p.subCategory?.toLowerCase() === staticProduct.subCategory?.toLowerCase()) {
                score += 50;
              }
              if (p.brand?.toLowerCase() === staticProduct.brand?.toLowerCase()) {
                score += 30;
              }
              if (p.subCategory?.toLowerCase() === staticProduct.subCategory?.toLowerCase()) {
                score += 20;
              }
              if (p.category?.toLowerCase() === staticProduct.category?.toLowerCase()) {
                score += 10;
              }
              return { ...p, relevanceScore: score };
            })
            .filter(p => p.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (fallbackError) {
        console.error('Error loading static product data:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    // Navigate to cart page
    window.location.href = '/cart';
  };

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

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
              <li>
                <Link
                  to={`/category/${product.category}`}
                  className="text-muted-foreground hover:text-foreground transition-colors capitalize"
                >
                  {product.category}
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="relative aspect-square bg-secondary rounded-3xl overflow-hidden mb-4 cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="badge-new">New</span>}
                  {discount > 0 && <span className="badge-sale">-{discount}%</span>}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(reviewStats?.averageRating || product.rating)
                          ? 'fill-foreground stroke-foreground'
                          : 'stroke-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : product.rating} ({reviewStats?.totalReviews || product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold">₹{product.discountPrice}</span>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.price}
                    </span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                      Save ₹{product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">₹{product.price}</span>
                )}
              </div>

              {/* Colors */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                  Color: <span className="text-muted-foreground">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-foreground scale-110'
                          : 'border-border hover:border-foreground/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={`absolute inset-0 m-auto w-4 h-4 ${
                            color.hex === '#FFFFFF' || color.hex === '#FFD700'
                              ? 'text-foreground'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">
                    Size: <span className="text-muted-foreground">{selectedSize || 'Select'}</span>
                  </p>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-xl border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      if (product) {
                        toggleWishlist(product);
                        toast.success(
                          isInWishlist(product.id)
                            ? `Removed ${product.name} from wishlist`
                            : `Added ${product.name} to wishlist!`
                        );
                      }
                    }}
                    className={`p-4 rounded-full border-2 transition-all ${
                      product && isInWishlist(product.id)
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over ₹8,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-full">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-semibold mb-4">Description</h3>
                <p className="text-body">{product.description}</p>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-border">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Similar Products You'll Love
                </h2>
                <p className="text-muted-foreground">
                  Handpicked {product?.brand || 'products'} that match your style
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Customer Reviews Section */}
          <section className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                Customer Reviews & Photos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real reviews from verified customers</p>
            </div>
            
            {/* Review Stats */}
            {reviewStats && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto grid md:grid-cols-[200px_1fr] gap-6 items-center">
                  {/* Average Rating */}
                  <div className="text-center">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                      {reviewStats.averageRating ? reviewStats.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <div className="flex gap-0.5 justify-center mt-2 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(reviewStats.averageRating || 0)
                              ? 'fill-gray-900 text-gray-900 dark:fill-white dark:text-white'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats[`${['oneStar', 'twoStars', 'threeStars', 'fourStars', 'fiveStars'][rating - 1]}`] || 0;
                      const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs font-semibold w-6 text-gray-600 dark:text-gray-400 text-right">{rating}</span>
                          <Star className="w-3 h-3 fill-gray-900 text-gray-900 dark:fill-white dark:text-white" />
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white"></div>
                <p className="mt-3 text-sm text-gray-500">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center font-bold text-white dark:text-gray-900 text-sm">
                            {review.userName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          {review.isVerifiedPurchase && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                              <ShieldCheck className="w-2.5 h-2.5 text-white dark:text-gray-900" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{review.userName}</h4>
                            {review.isVerifiedPurchase && (
                              <span className="px-1.5 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-[10px] font-semibold">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= review.rating
                                    ? 'fill-gray-900 text-gray-900 dark:fill-white dark:text-white'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h5 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{review.title}</h5>
                    )}

                    {/* Review Comment */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{review.comment}</p>

                    {/* Review Images */}
                    {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                      <div className="mb-4">
                        {(() => {
                          console.log('🖼️ Processing images for review:', review._id);
                          console.log('Raw images array:', review.images);
                          
                          // Process and validate images
                          const validImages = review.images
                            .map((img: any) => {
                              // Handle different data types
                              if (typeof img === 'string') {
                                const trimmed = img.trim();
                                console.log('Image URL:', trimmed, 'Valid:', trimmed.length > 0);
                                return trimmed;
                              }
                              console.warn('Invalid image type:', typeof img, img);
                              return null;
                            })
                            .filter((img: string | null) => img && img.length > 10); // Must be at least 10 chars for a valid URL
                          
                          console.log('Valid images found:', validImages.length, validImages);
                          
                          if (validImages.length === 0) {
                            return (
                              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Images are not available for this review
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <>
                              <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>{validImages.length} {validImages.length === 1 ? 'Photo' : 'Photos'}</span>
                              </div>
                              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                {validImages.map((image: string, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedMediaPreview({ type: 'image', url: image })}
                                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 dark:bg-gray-800"
                                  >
                                    <img
                                      src={image}
                                      alt={`Review photo ${index + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      loading="lazy"
                                      onLoad={() => console.log('✅ Image loaded successfully:', image)}
                                      onError={(e) => {
                                        console.error('❌ Failed to load image:', image);
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                      <ImageIcon className="w-5 h-5 text-white drop-shadow-lg" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Review Videos */}
                    {review.videos && review.videos.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                          <Play className="w-3.5 h-3.5" />
                          <span>Video Review</span>
                        </div>
                        <div className="grid gap-2">
                          {review.videos.map((video: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setSelectedMediaPreview({ type: 'video', url: video })}
                              className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer bg-black shadow-md hover:shadow-xl transition-shadow"
                            >
                              <video
                                src={video}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Video failed to load:', video);
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                                  <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 dark:bg-white mb-3">
                  <Star className="w-7 h-7 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">No Reviews Yet</h3>
                <p className="text-sm text-gray-500">Be the first to share your experience!</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Media Preview Dialog */}
      <Dialog open={!!selectedMediaPreview} onOpenChange={() => setSelectedMediaPreview(null)}>
        <DialogContent className="max-w-5xl max-h-[92vh] p-0 bg-black/95 backdrop-blur-md border border-purple-500/30">
          <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
            {selectedMediaPreview?.type === 'image' ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedMediaPreview.url}
                alt="Customer photo preview"
                className="relative max-w-full max-h-[88vh] object-contain rounded-lg"
              />
            ) : selectedMediaPreview?.type === 'video' ? (
              <motion.video
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedMediaPreview.url}
                controls
                autoPlay
                className="relative max-w-full max-h-[88vh] rounded-lg"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductPage;
