import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  MessageSquare,
  User,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        toast.error("Product not found");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login to review");
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        config,
      );
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      // Refresh product to show new review
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setActiveTab("reviews");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const addToCartHandler = () => {
    addToCart(product, qty);
    toast.success("Added to cart!");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      {/* Section 1: Product Overview */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 p-6 pt-32">
        <div className="container mx-auto max-w-7xl h-full flex flex-col justify-center">
          <Link
            to="/products"
            className="inline-flex items-center space-x-3 text-secondary hover:text-primary transition-all mb-8 group self-start"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium tracking-wide">
              Back to Collection
            </span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="glass-panel p-8 rounded-[40px] border border-[#2c2926]/5 shadow-2xl relative overflow-hidden bg-white/40">
                <div className="aspect-[4/5] rounded-[30px] overflow-hidden bg-[#F2EFE9] max-h-[60vh] flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col justify-center"
            >
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-[#2c2926]/5 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-[#2c2926]/10">
                    {product.category}
                  </span>
                  <div className="flex text-[#B08D55] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          i < Math.round(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-secondary text-xs font-bold uppercase tracking-widest">
                    {product.numReviews} Reviews
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
                  {product.name}
                </h1>

                <p className="text-3xl font-light text-primary mb-8">
                  ৳{product.price?.toLocaleString()}
                </p>

                <p className="text-secondary text-lg leading-relaxed mb-10 font-light border-l-2 border-[#B08D55]/30 pl-6 line-clamp-4">
                  {product.description}
                </p>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              {true && (
                <div className="p-8 glass-panel rounded-[30px] border border-[#2c2926]/5 bg-white/30 backdrop-blur-md mb-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                      Quantity
                    </span>
                    <div className="flex items-center gap-6 bg-white/50 rounded-full px-4 py-2 border border-[#2c2926]/5">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="text-xl text-primary hover:text-[#B08D55] w-8 h-8 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold text-primary w-4 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(Math.min(99, qty + 1))}
                        className="text-xl text-primary hover:text-[#B08D55] w-8 h-8 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addToCartHandler}
                    className="w-full py-5 rounded-full bg-[#2c2926] text-[#F2EFE9] text-lg font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-[#4a4540] transition-colors"
                  >
                    <ShoppingBag size={20} />
                    <span>Add to Bag</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Detailed Specs & Reviews */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 p-6 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">
            In-Depth Details
          </h2>
          {/* Tabs */}
          <div>
            <div className="flex gap-8 border-b border-[#2c2926]/10 mb-8 justify-center">
              {["reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-primary" : "text-secondary/60 hover:text-primary"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B08D55]"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-secondary leading-relaxed min-h-[400px]"
              >
                {activeTab === "reviews" && (
                  <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                    {/* Review List */}
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div
                            key={review._id}
                            className="p-6 bg-white/40 rounded-[20px] border border-[#2c2926]/5"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55] font-bold">
                                {review.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-primary">
                                  {review.name}
                                </p>
                                <div className="flex text-[#B08D55] gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      fill={
                                        i < review.rating
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="ml-auto text-xs text-secondary">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-secondary leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-secondary">
                        No reviews yet. Be the first to review!
                      </p>
                    )}

                    {/* Review Form */}
                    <div className="pt-8 border-t border-[#2c2926]/10">
                      <h3 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                        <MessageSquare size={20} className="text-[#B08D55]" />
                        Write a Review
                      </h3>
                      {userInfo ? (
                        <form
                          onSubmit={submitReviewHandler}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                              Rating
                            </label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="transition-colors"
                                >
                                  <Star
                                    size={24}
                                    fill={star <= rating ? "#B08D55" : "none"}
                                    className="text-[#B08D55]"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                              Comment
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              required
                              rows="4"
                              className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all resize-none"
                              placeholder="Share your experience..."
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="w-full py-4 rounded-full bg-[#2c2926] text-white font-bold text-lg hover:bg-[#4a4540] transition-colors disabled:opacity-50 shadow-lg"
                          >
                            {submittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>
                        </form>
                      ) : (
                        <p className="text-secondary">
                          Please{" "}
                          <Link
                            to="/login"
                            className="text-[#B08D55] hover:underline font-bold"
                          >
                            login
                          </Link>{" "}
                          to write a review
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductScreen;
