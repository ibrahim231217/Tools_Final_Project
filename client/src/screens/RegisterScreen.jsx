import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Chrome, Github } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users",
        { name, email, password },
        config,
      );

      login(data);
      toast.success("Registration setup successful!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
      toast.error("Registration Failed");
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[var(--color-surface)]">
      {/* Left Panel - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1816] relative flex-col items-center justify-center p-16 pt-32 overflow-hidden text-[#F2EFE9]">
        <div className="relative z-10 text-center max-w-lg">
          <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">
            ELEVATE.
          </h1>
          <div className="w-24 h-1 bg-[#B08D55] mx-auto mb-8"></div>
          <p className="text-xl text-[#F2EFE9]/80 font-light leading-relaxed tracking-wide italic">
            "Join a community where style meets substance. Your journey to
            exceptional taste begins here."
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-28 relative bg-[#F5F2F0]">
        {/* Mobile blobs */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#B08D55]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-5">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              Create Account
            </h1>
            <p className="text-secondary tracking-wide text-sm">
              Join our community of connoisseurs
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl mb-5 text-xs font-bold border border-red-100 flex items-center justify-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55] transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-sm shadow-sm"
                  placeholder="Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55] transition-colors"
                  size={16}
                />
                <input
                  type="email"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-sm shadow-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55] transition-colors"
                  size={16}
                />
                <input
                  type="password"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-sm shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55] transition-colors"
                  size={16}
                />
                <input
                  type="password"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-sm shadow-sm"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-base hover:bg-[#4a4540] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group mt-5"
            >
              <span>Register</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-secondary text-sm font-medium">
              Already have an account?
              <Link
                to="/login"
                className="text-[#B08D55] font-bold ml-2 hover:underline transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterScreen;
