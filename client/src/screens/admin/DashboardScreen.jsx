import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Box,
  DollarSign,
  ArrowRight,
  LogOut,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const DashboardScreen = () => {
  const { userInfo } = useAuth();
  const [statsData, setStatsData] = useState({
   
    totalProducts: 0,
    totalUsers: 0,
    
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get("/api/orders/stats", config);
        setStatsData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchStats();
    }
  }, [userInfo]);

  const stats = [
    {
      id: 1,
      label: "Total Products",
      value: statsData.totalProducts.toLocaleString(),
      icon: <Box size={24} />,
      color: "#2c2926",
    },
    {
      id: 2,
      label: "Total Users",
      value: statsData.totalUsers.toLocaleString(),
      icon: <Users size={24} />,
      color: "#B08D55",
    },
  ];

  return (
    <div className="flex flex-col relative w-full tracking-wide">
      {/* Static Background - No Animations */}

      <div className="w-full">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-[24px] border border-[#2c2926]/5 bg-white/60 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="p-3 rounded-2xl bg-white/80 shadow-sm text-primary"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary mb-1">
                {loading ? "..." : stat.value}
              </h3>
              <p className="text-secondary text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="w-full">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 rounded-[30px] border border-[#2c2926]/5 bg-white/60"
          >
            <h3 className="font-serif font-bold text-2xl text-primary mb-8">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/admin/productlist"
                className="p-6 rounded-2xl bg-white/50 border border-[#2c2926]/5 hover:bg-white hover:border-[#B08D55]/30 transition-all group"
              >
                <Box
                  className="text-secondary mb-4 group-hover:text-[#B08D55] transition-colors"
                  size={24}
                />
                <h4 className="font-bold text-primary mb-1">Manage Products</h4>
                <div className="flex items-center text-xs text-secondary font-medium group-hover:text-[#B08D55]">
                  <span>View All</span>{" "}
                  <ArrowRight
                    size={12}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
              <Link
                to="/admin/orderlist"
                className="p-6 rounded-2xl bg-white/50 border border-[#2c2926]/5 hover:bg-white hover:border-[#B08D55]/30 transition-all group"
              >
                <ShoppingBag
                  className="text-secondary mb-4 group-hover:text-[#B08D55] transition-colors"
                  size={24}
                />
                <h4 className="font-bold text-primary mb-1">Manage Orders</h4>
                <div className="flex items-center text-xs text-secondary font-medium group-hover:text-[#B08D55]">
                  <span>View All</span>{" "}
                  <ArrowRight
                    size={12}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
