import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentScreen = () => {
  const { savePaymentMethod } = useCart();
  const navigate = useNavigate();
  
  const paymentMethod = 'Cash on Delivery';

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center relative pt-32 bg-[var(--color-surface)]">
      {/* Background Blobs - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-[#B08D55]/5 rounded-full blur-[100px] animate-blob mix-blend-multiply filter will-change-transform"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-[#6B665F]/5 rounded-full blur-[100px] animate-blob-delayed mix-blend-multiply filter will-change-transform"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-10 rounded-[40px] border border-[#2c2926]/5 bg-white/60 shadow-2xl mt-8"
        >
            <h1 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Payment Method</h1>
            
            <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1 mb-2 block">Payment Option</label>
                    
                    <label className="flex items-center p-5 rounded-2xl border-2 border-[#B08D55] bg-white transition-all">
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Cash on Delivery" 
                            checked={true}
                            readOnly
                            className="w-5 h-5 text-[#B08D55] focus:ring-[#B08D55] border-gray-300"
                        />
                        <div className="ml-4 flex items-center justify-between w-full">
                            <span className="font-bold text-lg text-primary">Cash on Delivery</span>
                            <div className="flex gap-2 text-[#B08D55]">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </label>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        className="w-full py-5 rounded-full bg-[#111] text-white font-bold text-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group"
                    >
                        Continue to Review <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentScreen;
