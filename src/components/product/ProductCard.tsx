import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewStats, setReviewStats] = useState({ 
    rating: product.rating || 0, 
    reviews: product.reviews || 0 
  });
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Fetch review images and stats
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await api.get(`/reviews/product/${product.id}?limit=5`);
        if (response.stats) {
          setReviewStats({
            rating: response.stats.averageRating || product.rating || 0,
            reviews: response.stats.totalReviews || product.reviews || 0
          });
        }
        
        // Extract images from reviews
        const images: string[] = [];
        response.reviews?.forEach((review: any) => {
          if (review.images && review.images.length > 0) {
            images.push(...review.images.slice(0, 1)); // Take first image from each review
          }
        });
        setReviewImages(images.slice(0, 3)); // Show max 3 review images
      } catch (error) {
        // Silently fail and use static data
        console.debug('Could not fetch review data:', error);
      }
    };

    fetchReviewData();
  }, [product.id, product.rating, product.reviews]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get first available size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0]?.name;
    
    if (!defaultSize || !defaultColor) {
      toast.error('Product options not available');
      return;
    }
    
    addToCart(product, defaultSize, defaultColor);
    toast.success(`Added ${product.name} to cart!`);
  };

  const productId = product.id;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`} className="block">
        <div className="product-card">
          {/* Image Container */}
          <div className="relative aspect-square bg-secondary overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <span className="badge-new">New</span>}
              {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            </div>

            {/* Quick Actions - Wishlist Button */}
            <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                  toast.success(
                    isWishlisted 
                      ? `Removed ${product.name} from wishlist` 
                      : `Added ${product.name} to wishlist!`
                  );
                }}
                className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-foreground stroke-foreground' : ''
                  }`}
                />
              </button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-4 left-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleQuickAdd}
                className="w-full py-3 bg-background/95 backdrop-blur-sm rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-background transition-colors shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </p>
            <h3 className="heading-product text-foreground">{product.name}</h3>
            
            {/* Price and Rating on Same Row */}
            <div className="mt-2 flex items-center justify-between gap-2">
              {/* Price */}
              <div className="flex items-center gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="font-semibold">₹{product.discountPrice}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">₹{product.price}</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {/* Desktop: Show all 5 stars */}
                <div className="hidden md:flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(reviewStats.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Mobile: Show single star with rating */}
                <div className="flex md:hidden items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">
                    {(reviewStats.rating || 0).toFixed(1)}
                  </span>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  ({reviewStats.reviews || 0})
                </span>
              </div>
            </div>

            {/* Review Images Preview */}
            {reviewImages.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5">
                {reviewImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-md overflow-hidden border border-border"
                  >
                    <img
                      src={image}
                      alt={`Review ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(reviewStats.reviews || 0) > reviewImages.length && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{(reviewStats.reviews || 0) - reviewImages.length} reviews
                  </span>
                )}
              </div>
            )}

            {/* Color Options */}
            <div className="mt-3 flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
