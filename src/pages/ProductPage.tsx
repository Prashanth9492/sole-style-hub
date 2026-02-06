import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Truck, RefreshCw, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/products/${productId}`);
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
        
        // Fetch related products
        const relatedResponse = await fetch(`${apiUrl}/products?category=${data.category}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const mappedRelated = relatedData
            .filter((p: any) => (p._id || p.id) !== productId)
            .slice(0, 4)
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
          setRelatedProducts(mappedRelated);
        }
      } else {
        // Fallback to static data if API product not found
        const { products: staticProducts } = await import('@/data/products');
        const staticProduct = staticProducts.find(p => p.id === productId || p.id === parseInt(productId));
        if (staticProduct) {
          setProduct(staticProduct);
          // Get related products from static data
          const related = staticProducts
            .filter(p => p.category === staticProduct.category && p.id !== staticProduct.id)
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
          // Get related products from static data
          const related = staticProducts
            .filter(p => p.category === staticProduct.category && p.id !== staticProduct.id)
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
              <div className="relative aspect-square bg-secondary rounded-3xl overflow-hidden mb-4">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                        i < Math.floor(product.rating)
                          ? 'fill-foreground stroke-foreground'
                          : 'stroke-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold">${product.discountPrice}</span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price}
                    </span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                      Save ${product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">${product.price}</span>
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
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
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
              <h2 className="heading-section mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
