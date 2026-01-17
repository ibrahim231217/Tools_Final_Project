import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const { shippingAddress = {}, saveShippingAddress } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country, phone });
        navigate('/payment');
    };

    return (
        <div className="min-h-screen pt-32 pb-40 relative bg-[var(--color-surface)]">
            <div className="relative z-10 w-full max-w-2xl px-6 mx-auto">
                <CheckoutSteps step1 step2 />

                <div className="glass-panel p-10 rounded-[40px] border border-[#2c2926]/5 bg-white/60 shadow-2xl mt-8">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-8 text-center">Shipping Details</h1>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1">Address</label>
                            <input
                                type="text"
                                placeholder="e.g. House 12, Road 4, Dhanmondi"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1">Phone Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 01711..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1">City</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Dhaka"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1">Postal Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1209"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                    className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-secondary ml-1">Country</label>
                            <input
                                type="text"
                                placeholder="Bangladesh"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 rounded-full bg-[#111] text-white font-bold text-xl hover:bg-black transition-all shadow-xl mt-4 flex items-center justify-center gap-2 group"
                        >
                            Continue to Payment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingScreen;
