import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Edit2,
  Trash2,
  Check,
  X,
  Shield,
  ShieldAlert,
  User,
  Search,
  Loader,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const UserListScreen = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Admin Modal State
  const [showModal, setShowModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("/api/users", config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/users/${id}`, config);
        setUsers(users.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const createAdminHandler = async (e) => {
    e.preventDefault();

    if (newAdminPassword !== newAdminConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setCreating(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/users/admin",
        {
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword,
        },
        config,
      );

      setUsers([...users, data]);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setNewAdminConfirmPassword("");
      setShowModal(false);
      toast.success("Admin created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    <div className="w-full relative tracking-wide">
      {/* Static Background - No Animations */}

      <div className="container mx-auto relative z-10 max-w-7xl flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Users
            </h1>
            <p className="text-secondary">
              Manage system users and verify roles
            </p>
          </div>

          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="relative group flex-1 md:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary group-focus-within:text-[#B08D55] transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/50 border border-[#2c2926]/10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] w-full md:w-64 transition-all"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#2c2926] text-white rounded-full text-sm font-bold hover:bg-[#4a4540] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              <Shield size={16} />
              Create Admin
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10 container mx-auto max-w-7xl pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel overflow-hidden rounded-[30px] border border-[#2c2926]/5 bg-white/60 h-full flex flex-col"
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full">
              <thead className="sticky top-0 z-10 backdrop-blur-md">
                <tr className="bg-[#B08D55]/5 border-b border-[#2c2926]/5">
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    ID
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Admin
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-[#B08D55] uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2926]/5">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-white/50 transition-colors"
                  >
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-secondary/70">
                      #{user._id.substring(0, 8)}...
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#B08D55]/10 flex items-center justify-center text-[#B08D55] font-bold mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-primary">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-secondary">
                      <a
                        href={`mailto:${user.email}`}
                        className="hover:text-[#B08D55] transition-colors"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 shadow-sm">
                          <Shield size={12} className="mr-1 fill-current" />{" "}
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200">
                          <User size={12} className="mr-1" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/user/${user._id}/edit`}
                          className="p-2 text-secondary hover:text-[#B08D55] hover:bg-[#B08D55]/10 rounded-full transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="p-2 text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[30px] p-8 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-serif font-bold text-primary mb-6">
              Create New Admin
            </h2>

            <form onSubmit={createAdminHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                  placeholder="Admin name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-secondary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={newAdminConfirmPassword}
                  onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-full border border-[#2c2926]/10 text-secondary font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-full bg-[#2c2926] text-white font-bold hover:bg-[#4a4540] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;
