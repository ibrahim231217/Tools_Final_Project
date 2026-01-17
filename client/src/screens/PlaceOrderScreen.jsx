import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, MapPin, Truck, CreditCard, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth(); // Corrected from 'user' to 'userInfo'
  const navigate = useNavigate();

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 10000 ? 0 : 200;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(0)); // Rounded tax
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(0); // Rounded total

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [userInfo, shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: Number(itemsPrice),
          shippingPrice: Number(shippingPrice),
          taxPrice: Number(taxPrice),
          totalPrice: Number(totalPrice),
        },
        config
      );

      await clearCart();
      toast.success('Order placed successfully! Redirecting to your orders...');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative pt-32 bg-[var(--color-surface)]">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-[#B08D55]/5 rounded-full blur-[80px] animate-blob mix-blend-multiply filter will-change-transform"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[50vw] h-[50vw] bg-[#6B665F]/5 rounded-full blur-[80px] animate-blob-delayed mix-blend-multiply filter will-change-transform"></div>
      </div>

      <div className="flex-1 container mx-auto px-6 overflow-hidden relative z-10 max-w-7xl pb-6">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Review Details */}
            <div className="lg:col-span-2 h-full flex flex-col overflow-hidden">
                <div className="flex-shrink-0 mb-8">
                    <CheckoutSteps step1 step2 step3 step4 />
                    <div className="text-center mt-8 md:text-left">
                        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Order Review</h1>
                        <p className="text-secondary">Please review your order details before confirming.</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-8 pb-20">
                     {/* Shipping Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-8 rounded-[30px] border border-[#2c2926]/5 bg-white/60"
                    >
                        <div className="flex items-center gap-4 mb-6 text-[#B08D55]">
                            <MapPin />
                            <h2 className="text-xl font-bold uppercase tracking-widest">Shipping</h2>
                        </div>
                        <p className="text-lg text-primary font-medium leading-relaxed">
                            {shippingAddress.address}, <br />
                            {shippingAddress.city}, {shippingAddress.postalCode}, <br />
                            {shippingAddress.country} <br />
                            <span className="text-secondary text-sm mt-1 block">Phone: {shippingAddress.phone}</span>
                        </p>
                    </motion.div>

                    {/* Payment Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 rounded-[30px] border border-[#2c2926]/5 bg-white/60"
                    >
                        <div className="flex items-center gap-4 mb-6 text-[#B08D55]">
                            <CreditCard />
                            <h2 className="text-xl font-bold uppercase tracking-widest">Method</h2>
                        </div>
                        <p className="text-lg text-primary font-medium">
                            {paymentMethod}
                        </p>
                    </motion.div>

                    {/* Order Items */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 rounded-[30px] border border-[#2c2926]/5 bg-white/60"
                    >
                        <div className="flex items-center gap-4 mb-6 text-[#B08D55]">
                            <Truck />
                            <h2 className="text-xl font-bold uppercase tracking-widest">Items</h2>
                        </div>
                        {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between pb-6 border-b border-[#2c2926]/5 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white rounded-lg p-2 border border-[#2c2926]/5 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <Link to={`/products/${item._id}`} className="font-serif font-bold text-primary hover:text-[#B08D55] text-lg block">
                                                {item.name}
                                            </Link>
                                            <div className="text-sm text-secondary mt-1">
                                                {item.qty} x ৳{item.price?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary text-xl">
                                        ৳{(item.qty * item.price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 h-full overflow-y-auto scrollbar-hide pb-20">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-10 rounded-[40px] border border-[#2c2926]/5 bg-white/80 backdrop-blur-xl sticky top-0 shadow-2xl"
                >
                    <h2 className="text-2xl font-serif font-bold text-primary mb-8">Summary</h2>
                    
                    <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-secondary">
                                <span>Items</span>
                                <span>৳{Number(itemsPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Shipping</span>
                                <span>৳{Number(shippingPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Tax</span>
                                <span>৳{Number(taxPrice).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-[#2c2926]/10 pt-6 flex justify-between">
                                <span className="font-bold text-xl text-primary">Total</span>
                                <span className="font-serif font-bold text-2xl text-primary">৳{Number(totalPrice).toLocaleString()}</span>
                            </div>
                    </div>

                    <button
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cartItems.length === 0}
                        className="w-full py-5 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-lg hover:bg-[#4a4540] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        Confirm Order
                    </button>
                    
                    <div className="mt-8 flex items-center justify-center gap-2 text-secondary/60 text-xs font-medium">
                        <CheckCircle size={14} />
                        <span>Secure SSL Encryption</span>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
