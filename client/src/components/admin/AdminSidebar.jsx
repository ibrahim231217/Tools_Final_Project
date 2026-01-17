import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Box, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/productlist', icon: Box },
        { name: 'Orders', path: '/admin/orderlist', icon: ShoppingBag },
        { name: 'Users', path: '/admin/userlist', icon: Users },
    ];

    return (
        <div className="hidden lg:flex flex-col w-64 bg-[#1a1816] h-screen fixed left-0 top-0 border-r border-[#2c2926]/20 z-50">
            {/* Branding */}
            <div className="p-8 pb-4">
                 <Link to="/admin/dashboard" className="flex flex-col items-start leading-none group gap-[2px]">
                    <span className="font-serif text-2xl font-bold tracking-tight text-[#F2EFE9] group-hover:text-white transition-all duration-300">
                      DARAZ
                    </span>
                    <span className="text-[0.5rem] font-sans font-bold tracking-[0.4em] text-[#B08D55] uppercase">
                      ADMIN PORTAL
                    </span>
                  </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                active 
                                ? 'bg-[#B08D55] text-white shadow-lg shadow-[#B08D55]/20' 
                                : 'text-[#F2EFE9]/60 hover:text-[#F2EFE9] hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={20} className={active ? 'text-white' : 'text-[#B08D55]'} />
                            <span className="text-sm font-bold tracking-wide">{item.name}</span>
                            
                            {active && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-[#B08D55] rounded-xl -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-white/5">
                <button 
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-wide">Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
