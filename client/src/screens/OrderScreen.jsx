import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, MapPin, Truck, CreditCard, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock order data lookup
const mockOrder = {
  _id: '1',
  user: { name: 'Tanvir Ahmed', email: 'tanvir@example.com' },
  orderItems: [
    { name: 'Premium Wireless Headphones', qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', price: 35000, product: '1' },
  ],
  shippingAddress: { address: 'Road 71, Gulshan 2', city: 'Dhaka', postalCode: '1212', country: 'Bangladesh' },
  paymentMethod: 'PayPal',
  itemsPrice: 35000,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 35000,
  isPaid: true,
  paidAt: '2025-01-12',
  isDelivered: false,
};

const OrderScreen = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        toast.error('Failed to load order');
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  const payHandler = async () => {
    try {
        setPaying(true);
        const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const paymentResult = {
            id: 'MOCK_PAYMENT_ID_' + Math.random().toString(36).substr(2, 9),
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: userInfo.email,
        };

        const { data } = await axios.put(`/api/orders/${id}/pay`, paymentResult, config);
        setOrder(data);
        setPaying(false);
        toast.success('Payment Successful!');
    } catch (error) {
        setPaying(false);
        toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  const deliverHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
          <Loader className="animate-spin text-[#B08D55]" size={48} />
      </div>
  );

  if (error) return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] text-red-500 font-bold">
          <AlertCircle className="mr-2" /> {error}
      </div>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col relative pt-32 bg-[var(--color-surface)]">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] bg-[#B08D55]/5 rounded-full blur-[100px] animate-blob mix-blend-multiply filter will-change-transform"></div>
      </div>

      <div className="flex-1 container mx-auto px-6 overflow-hidden relative z-10 max-w-7xl pb-6">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-2 h-full flex flex-col overflow-hidden">
                 <div className="flex-shrink-0 mb-8">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">Order <span className="text-[#B08D55]">#{order._id}</span></h1>
                            <p className="text-secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        {!order.isPaid && (
                            <span className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-red-100 text-red-600 font-bold text-sm flex items-center">
                                <AlertCircle size={16} className="mr-2" /> Payment Pending
                            </span>
                        )}
                        {order.isPaid && (
                            <span className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-green-100 text-green-600 font-bold text-sm flex items-center">
                                <CheckCircle size={16} className="mr-2" /> Paid Successfully
                            </span>
                        )}
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
                        <div className="space-y-2">
                            <p className="font-bold text-primary text-lg">{order.user.name}</p>
                            <p className="text-secondary hover:text-[#B08D55] transition-colors"><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p className="text-lg text-primary font-medium leading-relaxed mt-4">
                                {order.shippingAddress.address}, <br />
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}, <br />
                                {order.shippingAddress.country} <br />
                                <span className="text-secondary text-base font-bold mt-1 block">Phone: {order.shippingAddress.phone}</span>
                            </p>
                            {order.isDelivered ? (
                                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center font-bold">
                                    <CheckCircle size={18} className="mr-2" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                </div>
                            ) : (
                                <div className={`mt-4 p-3 rounded-xl flex items-center font-bold ${
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    <Truck size={18} className="mr-2" /> 
                                    Status: {
                                        order.status === 'Processing' ? 'Pending Admin Approval' : 
                                        order.status === 'Shipped' ? 'Accepted & Shipped' : 
                                        order.status === 'Cancelled' ? 'Rejected' : 
                                        order.status
                                    }
                                </div>
                            )}
                        </div>
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
                            <h2 className="text-xl font-bold uppercase tracking-widest">Payment Method</h2>
                        </div>
                        <p className="text-lg text-primary font-bold mb-4">
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="p-3 bg-green-100 text-green-700 rounded-xl flex items-center font-bold">
                                <CheckCircle size={18} className="mr-2" /> Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'Recently'}
                            </div>
                        ) : (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center font-bold">
                                <AlertCircle size={18} className="mr-2" /> Not Paid
                            </div>
                        )}
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
                            <h2 className="text-xl font-bold uppercase tracking-widest">Order Items</h2>
                        </div>
                        <div className="space-y-6">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between pb-6 border-b border-[#2c2926]/5 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white rounded-lg p-2 border border-[#2c2926]/5 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <Link to={`/products/${item.product}`} className="font-serif font-bold text-primary hover:text-[#B08D55] text-lg block">
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
                                <span>৳{order.itemsPrice?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Shipping</span>
                                <span>৳{order.shippingPrice?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Tax</span>
                                <span>৳{order.taxPrice?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-[#2c2926]/10 pt-6 flex justify-between">
                                <span className="font-bold text-xl text-primary">Total</span>
                                <span className="font-serif font-bold text-2xl text-primary">৳{order.totalPrice?.toLocaleString()}</span>
                            </div>
                    </div>

                    {!order.isPaid && (
                        <button
                            onClick={payHandler}
                            disabled={paying}
                            className="w-full py-5 rounded-full bg-[#111] text-white font-bold text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {paying ? <Loader className="animate-spin" /> : 'Pay Now (Mock)'}
                        </button>
                    )}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <button onClick={deliverHandler} className="w-full btn-primary mb-2">
                             Mark As Delivered
                        </button>
                    )}
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
