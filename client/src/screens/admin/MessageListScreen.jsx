import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Trash2, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const MessageListScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        const { data } = await axios.get("/api/messages", config);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load messages");
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userInfo]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        await axios.delete(`/api/messages/${id}`, config);
        setMessages(messages.filter((msg) => msg._id !== id));
        setSelectedMessage(null);
        toast.success("Message deleted");
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-secondary">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[var(--color-surface)]">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center space-x-3 text-secondary hover:text-primary transition-all mb-8 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
            Contact Messages
          </h1>
          <p className="text-secondary">
            Total:{" "}
            <span className="font-bold text-accent">{messages.length}</span>{" "}
            messages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedMessage?._id === message._id
                      ? "bg-white/50 border-accent shadow-lg"
                      : "bg-white/30 border-primary/10 hover:border-primary/30 hover:bg-white/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-primary text-lg">
                        {message.name}
                      </p>
                      <p className="text-sm text-secondary flex items-center gap-2 mt-1">
                        <Mail size={14} />
                        {message.email}
                      </p>
                    </div>
                    <span className="text-xs text-secondary/60">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-secondary line-clamp-2">
                    {message.message}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-secondary">
                No messages yet.
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-1 p-6 rounded-2xl bg-white/40 border border-primary/10"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">
                  Message Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 block">
                      Name
                    </label>
                    <p className="text-primary font-bold">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 block">
                      Email
                    </label>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-accent hover:underline font-bold"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary mb-1 block">
                      Date
                    </label>
                    <p className="text-primary">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary mb-2 block">
                      Message
                    </label>
                    <div className="p-4 rounded-xl bg-white/30 border border-primary/10 max-h-[300px] overflow-y-auto">
                      <p className="text-primary leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="w-full py-3 rounded-full bg-red-500/20 text-red-600 font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Message
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageListScreen;
