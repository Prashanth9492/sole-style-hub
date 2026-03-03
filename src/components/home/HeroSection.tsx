import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Shoe {
  _id?: string;
  id?: number;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  gradient: string;
  accentColor: string;
}

// Fallback data if API fails - Add your images to: public/images/hero/
const fallbackShoes: Shoe[] = [
  {
    id: 1,
    name: 'Velocity X',
    tagline: 'Unleash Your Speed',
    description: 'Revolutionary bubble-sole technology for maximum energy return and ultra-lightweight performance.',
    price: 249,
    originalPrice: 299,
    image: '/images/hero/shoe-1.png',
    color: 'Sunrise Orange',
    gradient: 'from-orange-500/30 via-amber-400/15 to-transparent',
    accentColor: '#f97316',
  },
  {
    id: 2,
    name: 'Air Flow Elite',
    tagline: 'Breathe & Perform',
    description: 'Engineered mesh upper with adaptive cushioning for runners who demand excellence.',
    price: 220,
    originalPrice: 280,
    image: '/images/hero/shoe-2.png',
    color: 'Pure White',
    gradient: 'from-blue-600/20 via-cyan-500/10 to-transparent',
    accentColor: '#3b82f6',
  },
  {
    id: 3,
    name: 'Shadow Strike',
    tagline: 'Born To Dominate',
    description: 'Premium construction with iconic style that elevates your street presence.',
    price: 189,
    originalPrice: 229,
    image: '/images/hero/shoe-3.png',
    color: 'Midnight Black',
    gradient: 'from-purple-600/20 via-violet-500/10 to-transparent',
    accentColor: '#8b5cf6',
  },
  {
    id: 4,
    name: 'Cloud Runner Pro',
    tagline: 'Float Through Life',
    description: 'Next-gen foam technology meets retro aesthetics for all-day comfort.',
    price: 175,
    originalPrice: 215,
    image: '/images/hero/shoe-4.png',
    color: 'Ocean Blue',
    gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    accentColor: '#10b981',
  },
];

export const HeroSection = () => {
  const [shoes, setShoes] = useState<Shoe[]>(fallbackShoes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${apiUrl}/hero-slides`);
        if (response.ok) {
          const data = await response.json();
          // Only use API data if we got results
          if (data && data.length > 0) {
            const activeSlides = data.filter((slide: Shoe & { isActive?: boolean }) => slide.isActive !== false);
            if (activeSlides.length > 0) {
              setShoes(activeSlides);
            }
          }
        }
      } catch (error) {
        console.log('Using fallback hero data');
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [apiUrl]);

  const currentShoe = shoes[currentIndex] || shoes[0];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % shoes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % shoes.length);
  };

  const prevSlide = () => {
    setDirection(1); // Always enter from right for cinematic effect
    setCurrentIndex((prev) => (prev - 1 + shoes.length) % shoes.length);
  };

  const goToSlide = (index: number) => {
    setDirection(1); // Always enter from right for cinematic effect
    setCurrentIndex(index);
  };

  // Premium cinematic shoe entrance animation
  // Shoe ALWAYS enters from right, small & blurry, scales up to center with sharp focus
  const slideVariants = {
    enter: () => ({
      x: 600,
      opacity: 0,
      scale: 0.2,
      rotateY: 35,
      rotateX: 20,
      rotateZ: -12,
      filter: 'blur(15px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 80, damping: 18, mass: 1.5 },
        opacity: { duration: 0.5, ease: 'easeOut' },
        scale: { duration: 1, ease: [0.34, 1.56, 0.64, 1] },
        rotateY: { type: 'spring', stiffness: 60, damping: 12 },
        rotateX: { type: 'spring', stiffness: 60, damping: 12 },
        rotateZ: { type: 'spring', stiffness: 80, damping: 15 },
        filter: { duration: 0.8, ease: 'easeOut' },
      },
    },
    exit: () => ({
      x: -500,
      opacity: 0,
      scale: 0.4,
      rotateY: -25,
      rotateX: -15,
      rotateZ: 8,
      filter: 'blur(10px)',
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    }),
  };

  // Growing shadow animation that syncs with shoe scale
  const shadowVariants = {
    enter: {
      opacity: 0,
      scale: 0.15,
      y: 100,
    },
    center: {
      opacity: 0.7,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      y: 50,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Dynamic Background Gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentShoe.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-radial from-gray-100/30 via-white/20 to-transparent"
        />
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Glowing Circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-black/20 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}  
      </div>

      {/* Main Content Container */}
      <div className="container-premium section-padding w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="relative z-20 order-2 lg:order-1 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentShoe.id}
                initial="enter"
                animate="center"
                exit="exit"
                variants={textVariants}
                transition={{ duration: 0.5 }}
              >
                {/* Decorative Line */}
                <motion.div 
                  className="hidden lg:flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div 
                    className="w-12 h-[2px] rounded-full bg-black"
                  />
                  <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500">
                    Premium Collection
                  </span>
                </motion.div>

                {/* Product Name with Gradient */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-4 tracking-tight leading-[0.9]">
                  <span className="block">{currentShoe.name.split(' ')[0]}</span>
                  <span 
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-gray-800 to-black"
                  >
                    {currentShoe.name.split(' ').slice(1).join(' ') || currentShoe.name}
                  </span>
                </h1>

                {/* Animated Underline */}
                <motion.div 
                  className="w-24 h-1 rounded-full mb-8 mx-auto lg:mx-0 bg-black"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />

                {/* Description with Icon */}
                <div className="flex items-start gap-4 max-w-lg mx-auto lg:mx-0 mb-10">
                  <div 
                    className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0 mt-1 bg-gray-100 border border-gray-200"
                  >
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {currentShoe.description}
                  </p>
                </div>

                {/* Feature Pills */}
                {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10">
                  {['Premium Quality', 'Free Shipping', 'Easy Returns'].map((feature, idx) => (
                    <motion.span
                      key={feature}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="px-4 py-2 rounded-full text-xs font-medium text-white/70 border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div> */}

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                  <Link to="/category/men">
                    <motion.button
                      className="group relative px-10 py-5 bg-black text-white rounded-full font-bold text-base overflow-hidden shadow-2xl shadow-black/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Shop Now
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"
                        initial={{ x: '100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </Link>

                  <Link to="/new">
                    <motion.button
                      className="group px-10 py-5 rounded-full font-semibold text-black border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Explore More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>

                {/* Stats Row */}
                {/* <motion.div 
                  className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">50K+</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Happy Customers</div>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">4.9</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <span>Rating</span>
                      <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden md:block" />
                  <div className="text-center lg:text-left hidden md:block">
                    <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">Authentic</div>
                  </div>
                </motion.div> */}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Product Showcase */}
          <div className="relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Cinematic Spotlight Glow */}
            <motion.div
              className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full"
              style={{
                background: 'conic-gradient(from 180deg, rgba(0,0,0,0.08), transparent, rgba(0,0,0,0.05), transparent, rgba(0,0,0,0.06))',
                filter: 'blur(60px)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [0.95, 1.05, 0.95],
                rotate: [0, 180, 360],
              }}
              transition={{
                opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              }}
            />

            {/* Depth Glow Ring - Enhances 3D effect */}
            <motion.div
              className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 30%, transparent 60%)',
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Rotating Decorative Circle */}
            <motion.div
              className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] border border-black/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"
              />
            </motion.div>

            {/* Main Product Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentShoe._id || currentShoe.id}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative"
                style={{ 
                  perspective: '1500px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Dynamic Growing Shadow */}
                <motion.div
                  key={`shadow-${currentShoe._id || currentShoe.id}`}
                  variants={shadowVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[90%] h-[50px] md:h-[70px]"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 35%, transparent 70%)',
                    filter: 'blur(25px)',
                    borderRadius: '50%',
                  }}
                />
                
                <motion.img
                  src={currentShoe.image}
                  alt={currentShoe.name}
                  className="relative w-[380px] md:w-[500px] lg:w-[650px]"
                  style={{
                    filter: 'drop-shadow(0 50px 100px rgba(0,0,0,0.2)) drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    y: [0, -18, 0],
                    rotateZ: [-2, 2, -2],
                    rotateY: [-4, 4, -4],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.8, // Start floating after entrance animation completes
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 lg:bottom-1/2 lg:translate-y-1/2 flex lg:flex-col gap-4">
              <motion.button
                onClick={prevSlide}
                className="p-3 md:p-4 rounded-full bg-white border-2 border-black text-black backdrop-blur-sm hover:bg-black hover:text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="p-3 md:p-4 rounded-full bg-white border-2 border-black text-black backdrop-blur-sm hover:bg-black hover:text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots & Stats */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-12">
          {/* Slide Indicators */}
          {/* <div className="flex items-center gap-3">
            {shoes.map((shoe, index) => (
              <button
                key={shoe.id}
                onClick={() => goToSlide(index)}
                className="group relative"
              >
                <motion.div
                  className={`w-12 h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  initial={false}
                  animate={{
                    width: index === currentIndex ? 48 : 24,
                  }}
                />
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    layoutId="activeSlide"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
            <span className="ml-4 text-sm text-white/50 font-medium">
              {String(currentIndex + 1).padStart(2, '0')} / {String(shoes.length).padStart(2, '0')}
            </span>
          </div> */}

          {/* Quick Stats */}
          {/* <div className="hidden md:flex items-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="text-sm">30-Day Returns</div>
            <div className="text-sm">Secure Checkout</div>
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-black/30 flex justify-center pt-2"
        >
          <motion.div
            className="w-1 h-2 bg-black/60 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
