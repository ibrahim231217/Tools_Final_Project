import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Eye, Plus, Minus, ShoppingCart } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [quantities, setQuantities] = useState({});

  const { userInfo } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
        setFilteredProducts(data);
        const initialQty = {};
        data.forEach((p) => (initialQty[p._id] = 0));
        setQuantities(initialQty);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(products) ? [...products] : [];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products, sortBy]);

  const categories = [
    "All",
    ...new Set(
      (Array.isArray(products) ? products : []).map((p) => p.category),
    ),
  ];

  const updateQuantity = (productId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(
        1,
        Math.min(
          (prev[productId] || 1) + change,
          products.find((p) => p._id === productId)?.countInStock || 1,
        ),
      ),
    }));
  };

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      toast.error("Please login to add items to cart");
      return;
    }
    await addToCart(product, quantities[product._id] || 1);
    toast.success("Added to cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-secondary">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative bg-[var(--color-surface)]">
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row items-end justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-1">
                Our Collection
              </h1>
              <p className="text-base text-secondary">
                Curated excellence, designed for you.
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl p-3 rounded-2xl border border-[#2c2926]/5 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start flex-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${
                    selectedCategory === category
                      ? "bg-[#2c2926] text-white shadow-lg scale-105"
                      : "bg-white/50 border border-[#2c2926]/5 text-secondary hover:bg-white/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-4 md:border-l border-[#2c2926]/10">
              <span className="text-secondary font-medium text-xs whitespace-nowrap hidden md:block">
                {filteredProducts?.length || 0} items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-secondary font-medium text-xs">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-full bg-white/50 border border-[#2c2926]/10 text-primary font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 transition-all cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: (index % 8) * 0.04,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-panel rounded-2xl p-3 h-full flex flex-col cursor-pointer border border-[#2c2926]/5 hover:border-[#B08D55]/30 hover:shadow-xl transition-all duration-300 bg-white/40"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="relative aspect-square overflow-hidden rounded-xl mb-3 bg-[#F2EFE9]/50"
                  >
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="glass-ultra p-2 rounded-full shadow-lg hover:bg-[#B08D55] hover:text-white transition-colors">
                        <Eye size={16} />
                      </div>
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col relative">
                    <Link to={`/products/${product._id}`} className="mb-2">
                      <span className="text-[10px] font-bold text-[#B08D55] block mb-1 tracking-wider uppercase">
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                      <h3 className="text-base font-bold text-primary group-hover:text-[#B08D55] transition-colors leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-primary">
                          ৳{product.price?.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-[#B08D55]">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-bold text-primary">
                            {product.rating || 0}
                          </span>
                        </div>
                      </div>

                      {product.countInStock > 0 && (
                        <>
                          {!quantities[product._id] ||
                          quantities[product._id] === 0 ? (
                            <button
                              onClick={() => {
                                if (!userInfo) {
                                  toast.error(
                                    "Please login to add items to cart",
                                  );
                                  return;
                                }
                                updateQuantity(product._id, 1);
                                handleAddToCart(product);
                              }}
                              className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-[#2c2926] text-white rounded-full hover:bg-[#4a4540] transition-all shadow-lg hover:scale-110"
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <div className="w-full flex items-center bg-white/50 rounded-lg border border-[#2c2926]/10">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                className="flex-1 p-2 hover:bg-[#2c2926]/5 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-bold min-w-[32px] text-center">
                                {quantities[product._id]}
                              </span>
                              <button
                                onClick={async () => {
                                  updateQuantity(product._id, 1);
                                  await handleAddToCart(product);
                                }}
                                className="flex-1 p-2 hover:bg-[#2c2926]/5 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-secondary text-lg">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-8 py-3 rounded-full bg-[#2c2926] text-white font-bold hover:bg-[#4a4540] transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductListScreen;
