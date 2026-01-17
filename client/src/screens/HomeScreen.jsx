import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Eye,
  Star,
  Zap,
  ShoppingBag,
  X,
  Sparkles,
  Quote,
} from "lucide-react";
import axios from "axios";
import ReviewSlider from "../components/ReviewSlider";

const categories = [
  {
    name: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  }, // Studio Headphone
  {
    name: "Watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  }, // Studio Watch
  {
    name: "Living",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
  }, // Studio Chair
  {
    name: "Optics",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  }, // Studio Camera
];

// Extended Categories for Scrolling
const scrollingCategories = [
  ...categories,
  {
    name: "Travel",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  }, // Studio Bag
  {
    name: "Work",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  }, // Studio Desk/Plant
  {
    name: "Decor",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80",
  }, // Studio Vase/Lamp
  {
    name: "Wellness",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  }, // Studio Bottle
];

const VerticalMarquee = ({ items, speed = 20, reverse = false }) => (
  <div
    className="flex flex-col gap-6 overflow-hidden h-[80vh] max-h-[600px] relative" // Adjusted height to fit viewport
    style={{
      maskImage:
        "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
    }}
  >
    <motion.div
      initial={{ y: reverse ? -1000 : 0 }}
      animate={{ y: reverse ? 0 : -1000 }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
      className="flex flex-col gap-8 pb-8"
    >
      {[...items, ...items, ...items].map((cat, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="w-64 h-80 rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
            {" "}
            {/* Bigger Cards */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-base font-bold text-secondary tracking-widest uppercase">
            {cat.name}
          </span>
        </div>
      ))}
    </motion.div>
  </div>
);

// Quick View Modal
const QuickViewModal = ({ product, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-xl p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel p-8 rounded-[40px] max-w-5xl w-full shadow-2xl border border-white/20 flex flex-col md:flex-row overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel hover:bg-black/5 transition-colors z-10"
          >
            <X size={20} className="text-primary" />
          </button>

          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-12 rounded-3xl">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-[400px] object-contain drop-shadow-xl"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#86868b] mb-3">
              {product.brand}
            </span>
            <h2 className="text-4xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
              {product.name}
            </h2>
            <p className="text-lg text-[#86868b] leading-relaxed mb-6">
              {product.desc}
            </p>

            <div className="text-3xl font-bold text-[#1d1d1f] mb-8">
              ৳{product.price}
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-black text-white px-6 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Add to Bag
              </button>
              <button className="px-6 py-4 rounded-full glass-panel font-semibold hover:bg-white/60 transition-colors">
                <Star size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Premium Product Card
const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="glass-panel group rounded-[28px] p-5 cursor-pointer hover:-translate-y-3 transition-all duration-500 border border-[#2c2926]/5 hover:border-[#B08D55]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative z-10"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl mb-5 bg-[#F2EFE9]/50">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6"
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="glass-ultra p-3 rounded-full shadow-lg">
              <Eye size={18} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="text-xs font-bold text-[#B08D55] block mb-1">
            {product.category || product.brand}
          </span>
          <h3 className="text-lg font-bold text-primary mb-2 leading-tight group-hover:text-[#B08D55] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              ৳{product.price?.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[#B08D55]">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-semibold text-primary">
                {product.rating || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-2xl w-full p-8 rounded-[40px] relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#F2EFE9]/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#B08D55] block mb-2">
                    {product.category || product.brand}
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                    {product.name}
                  </h2>
                  <p className="text-secondary mb-6">
                    {product.description || product.desc}
                  </p>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl font-bold text-primary">
                      ${product.price?.toFixed(2) || product.price}
                    </span>
                    <div className="flex items-center gap-1 text-[#B08D55]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.round(product.rating || 0)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full py-4 px-8 rounded-full bg-[#2c2926] text-white font-bold hover:bg-[#4a4540] transition-colors flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data.slice(0, 4)); // Show first 4 products on homepage
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // Removed unused scroll hooks for performance

  return (
    <div className="h-screen overflow-y-auto scroll-smooth bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      {/* Section 1: Compact E-Commerce Hero */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 pt-32">
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-[1500px] mx-auto w-full">
            {/* Left: Commercial Messaging */}
            <div>
              {/* <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[#2c2926]/10 bg-white/40 backdrop-blur-sm"
              >
                <Sparkles size={16} className="text-[#B08D55]" />
                <span className="text-sm font-bold text-primary tracking-wide">NEW COLLECTION</span>
              </motion.div> */}

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-primary mb-6 leading-[0.9]">
                Timeless <br />
                <span className="italic text-secondary">Elegance</span>
              </h1>

              <p className="text-xl text-secondary mb-10 leading-relaxed max-w-xl font-light">
                Discover our curated selection of premium essentials. Designed
                for the modern connoisseur, crafted for life.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/products"
                  className="bg-[#2c2926] text-[#F2EFE9] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#4a4540] transition-all flex items-center gap-3 shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    Shop Now
                    <ArrowRight size={20} />
                  </span>
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-5 rounded-full font-bold text-lg text-primary border border-primary/20 hover:bg-white/50 transition-all"
                >
                  Our Story
                </Link>
              </div>

              {/* Minimal Trust Indicators */}
              <div className="flex gap-12 pt-6 border-t border-[#2c2926]/10">
                <div className="flex flex-col">
                  <span className="text-2xl font-serif font-bold text-primary">
                    24h
                  </span>
                  <span className="text-xs text-secondary uppercase tracking-wider">
                    Shipping
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif font-bold text-primary">
                    100%
                  </span>
                  <span className="text-xs text-secondary uppercase tracking-wider">
                    Authentic
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Scrolling Vertical Marquees */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative flex gap-8 justify-center h-full max-h-[80vh] overflow-hidden items-center"
            >
              <VerticalMarquee
                items={scrollingCategories.slice(0, 4)}
                speed={40}
              />
              <VerticalMarquee
                items={scrollingCategories.slice(4, 8)}
                speed={50}
                reverse
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Latest Arrivals */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-serif font-bold text-primary tracking-tight">
                Latest Arrivals.
              </h2>
              <p className="text-lg text-secondary mt-2">
                Designed for excellence.
              </p>
            </div>
            <div>
              <Link
                to="/products"
                className="text-[#B08D55] hover:text-[#9A7B4A] flex items-center gap-1 font-semibold group transition-colors"
              >
                View All{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <p className="text-secondary">Loading products...</p>
              </div>
            ) : products && Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-secondary">No products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Customer Reviews */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-primary tracking-tight mb-4">
              Client Perspectives
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Real feedback from our valued customers who experience the
              difference.
            </p>
          </div>
          <div>
            <ReviewSlider />
          </div>
        </div>
      </section>

      {/* Section 4: Flagship CTA */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="rounded-[50px] glass-panel p-16 md:p-24 relative overflow-hidden text-center border border-[#2c2926]/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B08D55]/10 via-[#6B665F]/10 to-[#D4C5A0]/10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight text-primary">
                Premium. Reimagined.
              </h2>
              <p className="text-2xl text-secondary mb-12 font-medium leading-relaxed">
                Experience the pinnacle of innovation and design.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/products"
                  className="px-10 py-5 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-lg hover:bg-[#4a4540] transition-all shadow-xl"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-5 rounded-full glass-ultra font-bold text-lg text-primary hover:bg-white/50 transition-all border border-primary/20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
