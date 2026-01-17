import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader, AlertCircle, ArrowLeft, Save, Shield } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const UserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`/api/users/${id}`, config);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        toast.error("Failed to fetch user data");
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchUser();
    }
  }, [id, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/users/${id}`, { name, email, isAdmin }, config);
      toast.success("User updated successfully");
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <Loader className="animate-spin text-[#B08D55]" size={48} />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] text-red-500 font-bold">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );

  return (
    <div className="min-h-screen pt-32 pb-40 relative bg-[var(--color-surface)]">
      {/* Static Background - No Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-2xl">
        <Link
          to="/admin/userlist"
          className="inline-flex items-center text-secondary hover:text-[#B08D55] font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to User List
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-[40px] border border-[#2c2926]/5 bg-white/60 shadow-xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              Edit User
            </h1>
            <p className="text-secondary">
              Update user permissions and details
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-secondary">
                Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all font-medium text-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-secondary">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all font-medium text-primary"
              />
            </div>

            <div className="py-4 flex items-center justify-between border-t border-b border-[#2c2926]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55]">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-primary">
                    Administrator Privileges
                  </h3>
                  <p className="text-xs text-secondary">
                    Grant full access to dashboard
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#B08D55]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#B08D55]"></div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#111] text-white font-bold text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
            >
              <Save size={20} /> Update User
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserEditScreen;
