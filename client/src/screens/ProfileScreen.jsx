import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaBoxOpen } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

import { motion } from "framer-motion";
import {
  Loader,
  AlertCircle,
} from "lucide-react";

const ProfileScreen = () => {
  const { userInfo, setCredentials, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);


  useEffect(() => {
    if (!userInfo) {
      // navigate logic handled by protected route usually, but safety check
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get("/api/orders/myorders", config);

          // Apply sorting
          setOrders(data);
          setLoadingOrders(false);
        } catch (error) {
          const message = error.response?.data?.message || error.message;
          if (
            message === "Not authorized, token failed" ||
            error.response?.status === 401
          ) {
            logout();
            toast.error("Session expired. Please log in again.");
          } else {
            setOrdersError(message);
          }
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [userInfo, logout]);



  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.put(
          "/api/users/profile",
          { name, email, password },
          config,
        );
        setCredentials(data);
        toast.success("Profile Updated Successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative pt-32 bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      <div className="flex-1 overflow-hidden container mx-auto px-6 relative z-10 max-w-7xl pb-6">
        <div className="h-full flex flex-col">
          {/* Log Out Button */}


          {/* Orders List - Full Width */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-[30px] border border-[#2c2926]/5 bg-white/60 h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 className="text-xl font-serif font-bold text-primary flex items-center">
                  <FaBoxOpen className="mr-3 text-[#B08D55]" /> My Orders
                </h2>

              </div>

              {loadingOrders ? (
                <div className="flex justify-center p-10">
                  <Loader className="animate-spin text-[#B08D55]" size={32} />
                </div>
              ) : ordersError ? (
                <div className="text-red-500 font-bold p-4 bg-red-50 rounded-xl flex items-center gap-2">
                  <AlertCircle size={20} /> {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 text-secondary">
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                      <tr className="border-b border-[#2c2926]/10 text-left">
                        <th className="pb-3 font-bold uppercase tracking-wider text-xs text-secondary">
                          ID
                        </th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-xs text-secondary">
                          Date
                        </th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-xs text-secondary">
                          Total
                        </th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-xs text-secondary">
                          Status
                        </th>

                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2c2926]/5">
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="group hover:bg-[#B08D55]/5 transition-colors"
                        >
                          <td className="py-3 font-medium text-primary text-sm">
                            #{order._id.substring(0, 10)}...
                          </td>
                          <td className="py-3 text-secondary text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-bold text-primary text-sm">
                            ৳{order.totalPrice?.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "Cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.status === "Processing"
                                ? "Pending Approval"
                                : order.status === "Shipped"
                                  ? "Accepted/Shipped"
                                  : order.status === "Cancelled"
                                    ? "Rejected"
                                    : order.status}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
