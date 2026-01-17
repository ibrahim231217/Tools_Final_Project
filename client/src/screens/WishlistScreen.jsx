import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

const WishlistScreen = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="h-screen overflow-hidden flex flex-col relative pt-32 bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4">
            Your Wishlist
          </h1>
          <p className="text-secondary tracking-wide">
            Curated favorites saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="glass-panel p-20 text-center rounded-[40px] border border-[#2c2926]/5 bg-white/40 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-[#B08D55]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={40} className="text-[#B08D55]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Your list is empty
            </h2>
            <p className="text-secondary mb-10 max-w-md mx-auto">
              Save items you love to revisit later. Start building your
              collection today.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-[#2c2926] text-[#F2EFE9] px-10 py-4 rounded-full font-bold hover:bg-[#4a4540] transition-colors shadow-xl"
            >
              Browse Collection <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6 rounded-[30px] border border-[#2c2926]/5 bg-white/60 flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square bg-[#F2EFE9] rounded-2xl p-6 mb-6 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-sm rounded-full text-secondary hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex-1 flex flex-col">
                  <Link
                    to={`/products/${item._id}`}
                    className="font-serif font-bold text-xl text-primary hover:text-[#B08D55] transition-colors mb-2 leading-tight"
                  >
                    {item.name}
                  </Link>
                  <p className="font-bold text-[#B08D55] mb-6">${item.price}</p>

                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      removeFromWishlist(item._id);
                    }}
                    className="w-full py-4 rounded-full border border-[#2c2926]/10 hover:bg-[#2c2926] hover:text-[#F2EFE9] transition-all font-bold text-sm flex items-center justify-center gap-2 mt-auto"
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistScreen;
