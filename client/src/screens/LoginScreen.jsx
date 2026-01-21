import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Chrome, Github, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

const handleSocialLogin = async (provider, providerName) => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { data } = await axios.post(
        "/api/users/social-login",
        {
          email: user.email,
          // If user.displayName is null, we send null and let the backend handle the fallback
          name: user.displayName || "", 
          photoUrl: user.photoURL || "",
          provider: providerName,
        }
      );

      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Social Login Failed");
      toast.error(err.response?.data?.message || "Social Login Failed");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post("/api/users/login", { email, password }, config);

      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password");
      toast.error("Login Failed");
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[var(--color-surface)]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1816] relative flex-col items-center justify-center p-16 pt-32 overflow-hidden text-[#F2EFE9]">
        <div className="absolute top-[-20%] left-[-20%] w-[40vw] h-[40vw] bg-[#B08D55]/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">LUXE.</h1>
          <div className="w-24 h-1 bg-[#B08D55] mx-auto mb-8"></div>
          <p className="text-xl text-[#F2EFE9]/80 font-light leading-relaxed italic">
            "Styles that speak without words."
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-28 relative bg-[#F5F2F0]">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-secondary tracking-wide text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl mb-6 text-xs font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55]" size={16} />
                <input
                  type="email"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-[#B08D55]" size={16} />
                <input
                  type="password"
                  className="w-full bg-white border border-[#e5e5e5] rounded-full py-3 pl-12 pr-5 focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-base hover:bg-[#4a4540] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2c2926]/10"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="px-3 bg-[#F5F2F0] text-secondary">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin(googleProvider, "Google")}
                className="py-3 px-4 rounded-full bg-white border border-[#2c2926]/10 hover:bg-[#f9f9f9] transition-all flex items-center justify-center gap-2 text-xs font-bold text-primary shadow-sm"
              >
                <Chrome size={18} />
                <span>Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin(githubProvider, "GitHub")}
                className="py-3 px-4 rounded-full bg-white border border-[#2c2926]/10 hover:bg-[#f9f9f9] transition-all flex items-center justify-center gap-2 text-xs font-bold text-primary shadow-sm"
              >
                <Github size={18} />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-secondary text-sm font-medium">
            Don't have an account? <Link to="/register" className="text-[#B08D55] font-bold ml-2">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;