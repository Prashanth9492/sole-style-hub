export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'men' | 'women' | 'kids';
  subCategory: string;
  price: number;
  discountPrice?: number;
  sizes: number[];
  colors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  // Men's Products
  {
    id: 'men-sneaker-1',
    name: 'Air Flow Elite',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'sneakers',
    price: 189,
    discountPrice: 149,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' },
    ],
    stock: 45,
    images: ['/placeholder.svg'],
    description: 'Premium leather sneakers with advanced cushioning technology. Designed for all-day comfort with a sleek, modern aesthetic.',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    isNew: true,
  },
  {
    id: 'men-running-1',
    name: 'Velocity Pro X',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'running',
    price: 219,
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1a1a2e' },
    ],
    stock: 32,
    images: ['/placeholder.svg'],
    description: 'Engineered for performance with responsive foam technology. Ultra-lightweight design for maximum speed.',
    rating: 4.9,
    reviews: 567,
    inStock: true,
    isBestseller: true,
  },
  {
    id: 'men-casual-1',
    name: 'Urban Classic',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'casual',
    price: 129,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Black', hex: '#000000' },
    ],
    stock: 58,
    images: ['/placeholder.svg'],
    description: 'Timeless casual design crafted from premium suede. Perfect for everyday wear.',
    rating: 4.6,
    reviews: 189,
    inStock: true,
  },
  {
    id: 'men-formal-1',
    name: 'Executive Oxford',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'formal',
    price: 279,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8B4513' },
    ],
    stock: 25,
    images: ['/placeholder.svg'],
    description: 'Handcrafted leather oxford shoes with Goodyear welt construction. The epitome of refined elegance.',
    rating: 4.9,
    reviews: 156,
    inStock: true,
  },
  {
    id: 'men-sandal-1',
    name: 'Coastal Slide',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'sandals',
    price: 79,
    discountPrice: 59,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    stock: 120,
    images: ['/placeholder.svg'],
    description: 'Comfortable slide sandals with contoured footbed. Perfect for post-workout recovery.',
    rating: 4.5,
    reviews: 423,
    inStock: true,
  },
  {
    id: 'men-sports-1',
    name: 'Court Dominator',
    brand: 'STRIDE',
    category: 'men',
    subCategory: 'sports',
    price: 159,
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colors: [
      { name: 'White/Black', hex: '#FFFFFF' },
      { name: 'Black/Red', hex: '#000000' },
    ],
    stock: 67,
    images: ['/placeholder.svg'],
    description: 'Multi-court sports shoe with superior grip and ankle support. Built for champions.',
    rating: 4.7,
    reviews: 312,
    inStock: true,
  },

  // Women's Products
  {
    id: 'women-sneaker-1',
    name: 'Cloud Walker',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'sneakers',
    price: 169,
    sizes: [5, 6, 7, 8, 9, 10],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Black', hex: '#000000' },
    ],
    stock: 89,
    images: ['/placeholder.svg'],
    description: 'Luxuriously soft sneakers with cloud-like cushioning. Style meets ultimate comfort.',
    rating: 4.8,
    reviews: 678,
    inStock: true,
    isNew: true,
  },
  {
    id: 'women-heels-1',
    name: 'Elegance Stiletto',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'heels',
    price: 249,
    sizes: [5, 6, 7, 8, 9],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Nude', hex: '#E8BEAC' },
      { name: 'Red', hex: '#DC143C' },
    ],
    stock: 34,
    images: ['/placeholder.svg'],
    description: 'Sophisticated stiletto heels crafted from Italian leather. Elevate every occasion.',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    isBestseller: true,
  },
  {
    id: 'women-flats-1',
    name: 'Ballet Grace',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'flats',
    price: 119,
    discountPrice: 89,
    sizes: [5, 6, 7, 8, 9, 10],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Beige', hex: '#F5F5DC' },
    ],
    stock: 78,
    images: ['/placeholder.svg'],
    description: 'Classic ballet flats with cushioned insole. Effortless elegance for every day.',
    rating: 4.6,
    reviews: 345,
    inStock: true,
  },
  {
    id: 'women-sandal-1',
    name: 'Riviera Strappy',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'sandals',
    price: 139,
    sizes: [5, 6, 7, 8, 9, 10],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Black', hex: '#000000' },
    ],
    stock: 56,
    images: ['/placeholder.svg'],
    description: 'Elegant strappy sandals with block heel. Mediterranean-inspired summer essential.',
    rating: 4.8,
    reviews: 189,
    inStock: true,
  },
  {
    id: 'women-running-1',
    name: 'Swift Motion',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'running',
    price: 199,
    sizes: [5, 6, 7, 8, 9, 10],
    colors: [
      { name: 'White/Pink', hex: '#FFFFFF' },
      { name: 'Black/Mint', hex: '#000000' },
    ],
    stock: 45,
    images: ['/placeholder.svg'],
    description: 'Lightweight running shoes with energy-return technology. Run faster, go further.',
    rating: 4.9,
    reviews: 456,
    inStock: true,
  },
  {
    id: 'women-casual-1',
    name: 'Weekend Loafer',
    brand: 'STRIDE',
    category: 'women',
    subCategory: 'casual',
    price: 149,
    sizes: [5, 6, 7, 8, 9, 10],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#000080' },
    ],
    stock: 67,
    images: ['/placeholder.svg'],
    description: 'Sophisticated loafers for the modern woman. From brunch to business casual.',
    rating: 4.7,
    reviews: 234,
    inStock: true,
  },

  // Kids' Products
  {
    id: 'kids-school-1',
    name: 'Scholar Step',
    brand: 'STRIDE',
    category: 'kids',
    subCategory: 'school',
    price: 69,
    sizes: [10, 11, 12, 13, 1, 2, 3],
    colors: [
      { name: 'Black', hex: '#000000' },
    ],
    stock: 145,
    images: ['/placeholder.svg'],
    description: 'Durable school shoes with scuff-resistant leather. Built for active learners.',
    rating: 4.6,
    reviews: 567,
    inStock: true,
  },
  {
    id: 'kids-sneaker-1',
    name: 'Playground Pro',
    brand: 'STRIDE',
    category: 'kids',
    subCategory: 'sneakers',
    price: 79,
    discountPrice: 59,
    sizes: [10, 11, 12, 13, 1, 2, 3, 4],
    colors: [
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Black', hex: '#000000' },
    ],
    stock: 234,
    images: ['/placeholder.svg'],
    description: 'Fun and functional sneakers for endless play. Easy velcro closure for independence.',
    rating: 4.8,
    reviews: 789,
    inStock: true,
    isBestseller: true,
  },
  {
    id: 'kids-sports-1',
    name: 'Junior Athlete',
    brand: 'STRIDE',
    category: 'kids',
    subCategory: 'sports',
    price: 89,
    sizes: [10, 11, 12, 13, 1, 2, 3, 4, 5],
    colors: [
      { name: 'White/Blue', hex: '#FFFFFF' },
      { name: 'Black/Lime', hex: '#000000' },
    ],
    stock: 123,
    images: ['/placeholder.svg'],
    description: 'Performance sports shoes for young athletes. Supportive design for growing feet.',
    rating: 4.7,
    reviews: 345,
    inStock: true,
  },
  {
    id: 'kids-sandal-1',
    name: 'Adventure Trek',
    brand: 'STRIDE',
    category: 'kids',
    subCategory: 'sandals',
    price: 49,
    sizes: [10, 11, 12, 13, 1, 2, 3],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Pink', hex: '#FFC0CB' },
    ],
    stock: 189,
    images: ['/placeholder.svg'],
    description: 'Water-friendly sandals for summer adventures. Quick-dry design with secure fit.',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    isNew: true,
  },
  {
    id: 'kids-party-1',
    name: 'Sparkle Star',
    brand: 'STRIDE',
    category: 'kids',
    subCategory: 'party',
    price: 59,
    sizes: [10, 11, 12, 13, 1, 2, 3],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Rose', hex: '#FF007F' },
    ],
    stock: 78,
    images: ['/placeholder.svg'],
    description: 'Glittering party shoes for special occasions. Let them shine bright.',
    rating: 4.8,
    reviews: 156,
    inStock: true,
  },
];

export const categories = [
  {
    id: 'men',
    name: 'Men',
    description: 'Premium footwear for the modern gentleman',
    subCategories: ['sneakers', 'running', 'casual', 'formal', 'sandals', 'sports'],
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Elegant designs for every occasion',
    subCategories: ['sneakers', 'heels', 'flats', 'sandals', 'running', 'casual'],
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Durable comfort for active adventures',
    subCategories: ['school', 'sneakers', 'sports', 'sandals', 'party'],
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter((p) => p.category === category);
};

export const getProductById = (id: string) => {
  return products.find((p) => p.id === id);
};

export const getFeaturedProducts = () => {
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, 8);
};

export const getNewArrivals = () => {
  return products.filter((p) => p.isNew);
};
