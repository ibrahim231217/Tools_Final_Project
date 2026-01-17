import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Check, Eye, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // 'date', 'total', 'status'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          toast.error("Please login to view orders");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get("/api/orders", config);
        let sorted = [...data];

        // Apply sorting
        switch (sortBy) {
          case "total":
            sorted.sort((a, b) => {
              const diff = a.totalPrice - b.totalPrice;
              return sortOrder === "asc" ? diff : -diff;
            });
            break;
          case "status":
            sorted.sort((a, b) => {
              const statusOrder = {
                Processing: 0,
                Shipped: 1,
                Delivered: 2,
                Cancelled: 3,
              };
              const diff =
                (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
              return sortOrder === "asc" ? diff : -diff;
            });
            break;
          case "date":
          default:
            sorted.sort((a, b) => {
              const diff = new Date(a.createdAt) - new Date(b.createdAt);
              return sortOrder === "asc" ? diff : -diff;
            });
            break;
        }

        setOrders(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        config,
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="h-screen pt-32 pb-40 flex items-center justify-center bg-[var(--color-surface)]">
        <p className="text-secondary">Loading orders...</p>
      </div>
    );
  }
  return (
    <div className="w-full relative tracking-wide">
      {/* Static Background - No Animations */}

      <div className="container mx-auto px-6 relative z-10 max-w-7xl flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Order Management
          </h1>
          <p className="text-secondary">Track and manage customer orders</p>
        </div>

        {/* Sort Controls */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-medium text-sm">Sort by:</span>
            <button
              onClick={() => toggleSort("date")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                sortBy === "date"
                  ? "bg-[#2c2926] text-white"
                  : "bg-white/40 border border-[#2c2926]/10 text-secondary hover:bg-white/60"
              }`}
            >
              Date
              {sortBy === "date" && (
                <ArrowUpDown
                  size={14}
                  className={sortOrder === "asc" ? "" : "rotate-180"}
                />
              )}
            </button>
            <button
              onClick={() => toggleSort("total")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                sortBy === "total"
                  ? "bg-[#2c2926] text-white"
                  : "bg-white/40 border border-[#2c2926]/10 text-secondary hover:bg-white/60"
              }`}
            >
              Total
              {sortBy === "total" && (
                <ArrowUpDown
                  size={14}
                  className={sortOrder === "asc" ? "" : "rotate-180"}
                />
              )}
            </button>
            <button
              onClick={() => toggleSort("status")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                sortBy === "status"
                  ? "bg-[#2c2926] text-white"
                  : "bg-white/40 border border-[#2c2926]/10 text-secondary hover:bg-white/60"
              }`}
            >
              Status
              {sortBy === "status" && (
                <ArrowUpDown
                  size={14}
                  className={sortOrder === "asc" ? "" : "rotate-180"}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10 container mx-auto px-6 max-w-7xl pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[30px] border border-[#2c2926]/5 bg-white/60 overflow-hidden shadow-xl h-full flex flex-col"
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-[#B08D55]/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Total
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Payment
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2926]/5">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/50 transition-colors"
                  >
                    <td className="px-8 py-6 text-sm text-secondary font-mono">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-primary">
                      {order.user?.name || "Unknown"}
                    </td>
                    <td className="px-8 py-6 text-sm text-secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-primary">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status || "Processing"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-0 focus:outline-none cursor-pointer ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-600"
                            : order.status === "Shipped"
                              ? "bg-blue-50 text-blue-600"
                              : order.status === "Cancelled"
                                ? "bg-red-50 text-red-600"
                                : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        <option value="Processing">Pending</option>
                        <option value="Shipped">Accept / Ship</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Reject</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      {order.isPaid ? (
                        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit text-xs font-bold uppercase tracking-wide">
                          <Check size={12} className="mr-1" /> Paid
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full w-fit text-xs font-bold uppercase tracking-wide">
                          <X size={12} className="mr-1" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center justify-center p-2 rounded-full hover:bg-[#B08D55]/10 text-secondary hover:text-[#B08D55] transition-colors"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-secondary text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListScreen;
