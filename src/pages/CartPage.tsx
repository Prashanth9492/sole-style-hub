import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-8 pb-20">
          <div className="container-premium section-padding">
            <div className="max-w-2xl mx-auto text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-8 bg-secondary rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8 pb-20">
        <div className="container-premium section-padding">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section mb-12"
          >
            Shopping Cart
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 bg-secondary/50 rounded-2xl"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.id}`}
                      className="w-28 h-28 bg-secondary rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {item.product.brand}
                          </p>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-semibold hover:underline"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Size: {item.selectedSize}</span>
                        <span>Color: {item.selectedColor}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 bg-background rounded-lg hover:bg-accent transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 bg-background rounded-lg hover:bg-accent transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold">
                            ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          {item.product.discountPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-6 text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-28 p-6 bg-secondary/50 rounded-2xl"
              >
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{totalPrice >= 100 ? 'Free' : '$10.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between mb-6">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      ${(totalPrice + (totalPrice >= 100 ? 0 : 10) + totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>

                  <button 
                    className="w-full btn-primary mb-4"
                    onClick={() => {
                      if (!user) {
                        navigate('/signin?redirect=/checkout');
                      } else {
                        navigate('/checkout');
                      }
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    Free shipping on orders over $100
                  </p>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium mb-3">Promo Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <button className="px-4 py-3 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
