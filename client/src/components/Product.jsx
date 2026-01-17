import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

const Product = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="card-premium h-full flex flex-col p-4">
        {/* Image Container */}
        <Link to={`/products/${product._id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Subtle Accent Overlay */}
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {product.countInStock === 0 && (
            <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10">
              Sold Out
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{product.brand}</p>
            <div className="flex items-center space-x-1">
              <Star size={10} className="text-accent fill-accent" />
              <span className="text-[10px] font-bold text-secondary">{product.rating}</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-serif font-semibold text-white hover:text-accent transition-colors duration-300 mb-2 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-secondary line-clamp-2 mb-6 font-medium leading-relaxed">
            {product.description || "Sophisticated design meets unparalleled performance."}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-white tracking-tight">
              ${product.price}
            </span>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-accent hover:text-slate-950 transition-all duration-300"
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
