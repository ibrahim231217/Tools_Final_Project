import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const { userInfo } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
        const initialQty = {};
        data.forEach((p) => (initialQty[p._id] = 0));
        setQuantities(initialQty);
        setLoading(false);
      } catch {
        toast.error("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          <div className="flex flex-col lg:flex-row items-end justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-1">
                Our Collection
              </h1>
              <p className="text-base text-secondary">
                Curated excellence, designed for you.
              </p>
            </div>
          </div>
        </motion.div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
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
                      <div className="mb-2">
                        <span className="text-lg font-bold text-primary">
                          ৳{product.price?.toLocaleString()}
                        </span>
                      </div>
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
              No products available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductListScreen;
