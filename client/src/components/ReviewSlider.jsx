import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';
import axios from 'axios';

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getDefaultReviews = () => [
    {
      id: 1,
      name: "Tanvir Ahmed",
      rating: 5,
      comment: "The quality is absolutely phenomenal. Best authentic products I've found in Dhaka. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Sadia Islam",
      rating: 5,
      comment: "Fast delivery to Gulshan and the packaging was beautiful. A truly luxury experience.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Rahim Uddin",
      rating: 4,
      comment: "Great aesthetics and solid build quality. Fits perfectly in my office setup.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Flatten all reviews from all products
        const allReviews = data.reduce((acc, product) => {
          if (product.reviews && Array.isArray(product.reviews)) {
            const productReviews = product.reviews.map(review => ({
              ...review,
              id: review._id || Math.random(),
              image: review.image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 5)}?w=100&h=100&fit=crop`
            }));
            acc.push(...productReviews);
          }
          return acc;
        }, []);
        
        setReviews(allReviews.length > 0 ? allReviews : getDefaultReviews());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(getDefaultReviews());
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);



  useEffect(() => {
    if (reviews.length === 0) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => setIndex((index + 1) % reviews.length);
  const prevReview = () => setIndex((index - 1 + reviews.length) % reviews.length);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="relative glass-panel rounded-[40px] p-8 md:p-12 min-h-[300px] flex items-center justify-center">
          <p className="text-secondary">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="relative glass-panel rounded-[40px] p-8 md:p-12 min-h-[300px] flex items-center justify-center">
          <p className="text-secondary">No reviews yet. Be the first to review!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20">
      <div className="relative glass-panel rounded-[40px] p-8 md:p-12 min-h-[300px] flex items-center justify-center">
        {/* Navigation Buttons */}
        <button onClick={prevReview} className="absolute left-4 z-10 p-2 rounded-full hover:bg-black/5 transition-colors text-primary">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextReview} className="absolute right-4 z-10 p-2 rounded-full hover:bg-black/5 transition-colors text-primary">
          <ChevronRight size={24} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center max-w-2xl"
          >
            <div className="relative mb-6">
               <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#B08D55] p-1 flex items-center justify-center bg-[#B08D55]/5">
                 <User size={40} className="text-[#B08D55]" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-[#B08D55] text-white p-1 rounded-full shadow-lg">
                 <Quote size={12} fill="currentColor" />
               </div>
            </div>

            <div className="flex gap-1 text-[#B08D55] mb-6">
              {[...Array(reviews[index].rating)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-lg md:text-xl text-secondary italic leading-relaxed mb-6">
              "{reviews[index].comment}"
            </p>

            <h3 className="text-lg font-bold text-primary uppercase tracking-widest">
              {reviews[index].name}
            </h3>
            <span className="text-xs text-secondary/60 font-medium mt-1">
              Verified Buyer
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Review Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-[#B08D55] w-8' : 'bg-[#B08D55]/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
