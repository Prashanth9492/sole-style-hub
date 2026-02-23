import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleQuickAdd = (product: any) => {
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0]?.name;
    
    if (!defaultSize || !defaultColor) {
      toast.error('Product options not available');
      return;
    }
    
    addToCart(product, defaultSize, defaultColor);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 pb-20">
        <div className="container-premium section-padding">
          {/* Header */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              My Wishlist
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </motion.p>
          </div>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Save your favorite items here for easy access later
              </p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product, index) => {
                const discount = product.discountPrice
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <Link to={`/product/${product.id}`} className="block">
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

                          {/* Remove from Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFromWishlist(product.id);
                              toast.success(`Removed ${product.name} from wishlist`);
                            }}
                            className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                          >
                            <Heart className="w-5 h-5 fill-foreground stroke-foreground" />
                          </button>

                          {/* Quick Add Button */}
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickAdd(product);
                            }}
                            className="absolute bottom-4 left-4 right-4 py-3 bg-background/95 backdrop-blur-sm rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Quick Add
                          </motion.button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            {product.brand}
                          </p>
                          <h3 className="heading-product text-foreground">{product.name}</h3>
                          <div className="mt-2 flex items-center gap-2">
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
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
