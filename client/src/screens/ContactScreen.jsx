import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: "concierge@premium.store",
    },
    { icon: <Phone size={24} />, label: "Phone", value: "+880 1711-123456" },
    {
      icon: <MapPin size={24} />,
      label: "Studio",
      value: "Road 71, Agrabad 2, Chattogram 1212",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto scroll-smooth bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      {/* Section 1: Contact Information */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 p-6 pt-32">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B08D55] mb-4 block">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary tracking-tight">
              Contact Us
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="glass-panel p-8 rounded-[32px] border border-[#2c2926]/5 bg-white/60 hover:bg-white/80 transition-all flex flex-col items-center text-center gap-4 group"
              >
                <div className="p-4 rounded-full bg-[#B08D55]/10 text-[#B08D55] group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] mb-2">
                    {info.label}
                  </div>
                  <div className="text-lg font-serif font-bold text-primary">
                    {info.value}
                  </div>
                </div>
              </div>
            ))}

            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <div className="p-10 rounded-[40px] bg-[#2c2926] text-[#F2EFE9] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 text-left">
                  <h3 className="font-serif font-bold text-2xl mb-2">
                    Visit Our Showroom
                  </h3>
                  <p className="text-white/70 leading-relaxed text-sm max-w-md">
                    Experience our collection in person. Our design consultants
                    are ready to assist you at our Gulshan flagship.
                  </p>
                </div>
                <div className="relative z-10">
                  <button className="px-8 py-3 rounded-full bg-white text-[#2c2926] font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-all">
                    Get Directions
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary/50">
            <span className="text-[10px] uppercase tracking-widest">
              Scroll to Message
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-secondary/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="min-h-screen w-full flex items-center justify-center relative z-10 p-6 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-[900px]">
          <div className="glass-panel p-10 md:p-16 rounded-[40px] border border-[#2c2926]/5 bg-white/80 relative overflow-hidden shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                Send us a Message
              </h2>
              <p className="text-secondary">We'd love to hear from you.</p>
            </div>

            <AnimatePresence>
              {submitted ? (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl">
                  <div className="w-20 h-20 rounded-full bg-[#B08D55]/10 flex items-center justify-center mb-6">
                    <Send className="text-[#B08D55]" size={32} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-primary mb-2">
                    Message Sent
                  </h2>
                  <p className="text-secondary text-lg">
                    We will respond within 24 hours.
                  </p>
                </div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B08D55] ml-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/50 border border-[#2c2926]/5 rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-lg"
                    placeholder="Tanvir Ahmed"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#B08D55] ml-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/50 border border-[#2c2926]/5 rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium text-lg"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#B08D55] ml-4">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full bg-white/50 border border-[#2c2926]/5 rounded-[30px] py-5 px-6 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55]/50 transition-all text-primary placeholder:text-secondary/40 font-medium resize-none text-lg"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-5 rounded-full bg-[#2c2926] text-[#F2EFE9] font-bold text-xl hover:bg-[#4a4540] transition-all shadow-xl flex items-center justify-center gap-3 group"
                >
                  <span>Send Message</span>
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactScreen;
