import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute top-4 right-4"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
                className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-foreground stroke-foreground' : ''
                  }`}
                />
              </button>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Quick add to cart logic
                }}
                className="w-full py-3 bg-background/95 backdrop-blur-sm rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-background transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
            </motion.div>
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
                  <span className="font-semibold">${product.discountPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="font-semibold">${product.price}</span>
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
};
