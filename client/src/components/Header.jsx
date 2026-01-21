import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Floating Pill Navbar */}
      <div className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 w-full">
        <div className="glass-nav-pill w-full max-w-[85rem] h-16 px-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex flex-col items-center justify-center leading-none group gap-[2px]"
            >
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-primary group-hover:text-black transition-all duration-300">
                LUXE
              </span>
              <span className="text-[0.4rem] sm:text-[0.45rem] font-sans font-bold tracking-[0.4em] text-[#B08D55] uppercase group-hover:text-[#8c6b36] transition-colors">
                a luxery e-commerce shop
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {[
              { name: "HOME", path: "/" },
              { name: "PRODUCTS", path: "/products" },
              { name: "ABOUT", path: "/about" },
              { name: "CONTACT", path: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[13px] font-bold tracking-widest text-primary hover:text-accent transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            {userInfo ? (
              <>
                {/* User Avatar - Show when logged in */}
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-8 h-8 rounded-full bg-[#B08D55] text-white font-bold flex items-center justify-center text-sm hover:shadow-lg transition-all hover:scale-110"
                    title={userInfo.name}
                  >
                    {userInfo.name
                      ? userInfo.name.charAt(0).toUpperCase()
                      : "U"}
                  </button>

                  {/* Desktop User Dropdown */}
                  {isOpen && (
                    <div className="absolute right-0 top-full mt-4 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#2c2926]/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {userInfo && userInfo.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-[#B08D55]/5 hover:text-[#B08D55] transition-colors border-b border-[#2c2926]/5"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#B08D55] flex items-center justify-center text-white text-[10px]">
                            A
                          </div>
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-[#B08D55]/5 hover:text-[#B08D55] transition-colors"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart Icon - Only show when logged in */}
                <Link
                  to="/cart"
                  className="relative text-primary hover:text-accent transition-colors group"
                >
                  <ShoppingCart size={20} className="stroke-[1.5]" />
                  {cartItems && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#B08D55] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-primary hover:text-accent transition-colors"
                >
                  <User size={20} className="stroke-[1.5]" />
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:block px-6 py-2 bg-[#111] text-white rounded-full text-[11px] font-bold tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  REGISTER
                </Link>
              </div>
            )}



            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[110px] z-30 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col pt-10 px-8 gap-8 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-primary"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-primary"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-primary"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-primary"
          >
            Contact
          </Link>
          <div className="h-px bg-gray-200 my-4" />

          <div className="flex flex-col gap-4">
            {userInfo ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-lg font-medium text-red-500 text-left"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-primary"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
