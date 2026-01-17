import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartScreen = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  // Helper function to get countInStock, assuming it's part of the item object
  // If not, this would need to be fetched or passed differently.
  // For now, let's assume a default or a property on the item.
  const getCountInStock = (item) => item.countInStock || 10; // Default to 10 if not present

  return (
    <div className="min-h-screen flex flex-col relative pt-32 bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      <div className="flex-1 container mx-auto px-6 relative z-10 max-w-7xl pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 flex flex-col">
            <h1 className="text-4xl font-serif font-bold text-primary mb-8 flex-shrink-0">
              Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-12 rounded-[30px] border border-[#2c2926]/5 bg-white/60 text-center flex flex-col items-center justify-center flex-1"
              >
                <div className="w-24 h-24 rounded-full bg-[#B08D55]/10 flex items-center justify-center mb-6">
                  <ShoppingBag size={48} className="text-[#B08D55]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                  Your cart is empty
                </h2>
                <p className="text-secondary mb-8 max-w-md">
                  Looks like you haven't added any items to your cart yet.
                  Browse our collection to find something you love.
                </p>
                <Link
                  to="/"
                  className="px-8 py-4 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-lg hover:bg-[#4a4540] transition-all shadow-xl flex items-center gap-2"
                >
                  Start Shopping <ArrowRight size={20} />
                </Link>
              </motion.div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-6 pb-20">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product._id || item.product}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-panel p-6 rounded-[24px] border border-[#2c2926]/5 bg-white/60 flex items-center gap-6 group hover:border-[#B08D55]/20 transition-all"
                    >
                      <div className="w-24 h-24 rounded-xl bg-white p-2 border border-[#2c2926]/5 flex-shrink-0">
                        <img
                          src={item?.image || "/placeholder.png"}
                          alt={item?.name || "Product"}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="flex-1">
                        <Link
                          to={`/products/${item.product._id || item.product}`}
                          className="text-lg font-bold text-primary hover:text-[#B08D55] transition-colors mb-1 block"
                        >
                          {item?.name || "Product Name"}
                        </Link>
                        <p className="text-[#B08D55] font-bold text-xl">
                          ৳{(item?.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <select
                          value={item.qty}
                          onChange={async (e) => {
                            const newQty = Number(e.target.value);
                            await addToCart(
                              {
                                _id: item.product._id || item.product,
                                ...item,
                              },
                              newQty,
                            );
                          }}
                          className="bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-bold focus:outline-none focus:border-[#B08D55] transition-colors"
                        >
                          {[...Array(getCountInStock(item)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() =>
                            removeFromCart(item.product._id || item.product)
                          }
                          className="p-2 text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          aria-label="Remove from cart"
                        >
                          {" "}
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="p-4"></div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary - Fixed */}
          <div className="lg:col-span-1 h-full overflow-y-auto scrollbar-hide pb-20">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-[30px] border border-[#2c2926]/5 bg-white/60 sticky top-0"
            >
              <h2 className="text-2xl font-serif font-bold text-primary mb-8 pb-4 border-b border-[#2c2926]/10">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-secondary">
                  <span>
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                  <span className="font-medium text-primary">
                    ৳
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Shipping</span>
                  <span className="text-xs bg-[#B08D55]/10 text-[#B08D55] px-2 py-1 rounded">
                    Calculated at checkout
                  </span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Tax</span>
                  <span className="text-xs bg-[#B08D55]/10 text-[#B08D55] px-2 py-1 rounded">
                    Calculated at checkout
                  </span>
                </div>
                <div className="pt-4 border-t border-[#2c2926]/10 flex justify-between items-center">
                  <span className="font-bold text-lg text-primary">
                    Subtotal
                  </span>
                  <span className="font-bold text-2xl text-[#B08D55]">
                    ৳
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full py-4 rounded-full bg-[#111] text-white font-bold text-lg hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-sm font-bold text-secondary hover:text-[#B08D55] transition-colors border-b border-transparent hover:border-[#B08D55]"
                >
                  Or Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
