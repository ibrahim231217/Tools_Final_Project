import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImagePreview(data.image);
        setDescription(data.description);
        setCountInStock(data.countInStock);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/products/${id}`,
        {
          name,
          price,
          image,
          description,
          countInStock,
          brand: "Sample brand",
          category: "Sample category",
        },
        config,
      );
      toast.success("Product updated successfully");
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-[#B08D55]" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );

  return (
    <div className="w-full relative tracking-wide max-w-5xl mx-auto h-full flex flex-col justify-center">
      {/* Static Background - No Animations */}

      <div className="flex items-center justify-between mb-4">
        <Link
          to="/admin/productlist"
          className="inline-flex items-center text-secondary hover:text-[#B08D55] transition-colors font-medium text-sm"
        >
          <ArrowLeft className="mr-2" size={16} /> Back
        </Link>
        <h1 className="text-2xl font-serif font-bold text-primary">
          Edit Product
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-[24px] border border-[#2c2926]/5 bg-white/60 shadow-xl"
      >
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Main Info */}
            <div className="col-span-8 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                  placeholder="Product Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Price (৳)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Right Column - Image & Meta */}
            <div className="col-span-4 space-y-3 flex flex-col">
              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Image Preview
                </label>
                <div className="flex-1 rounded-xl bg-white/40 border border-[#2c2926]/10 flex items-center justify-center relative overflow-hidden group min-h-[140px]">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <ImageIcon className="text-secondary/30" size={40} />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#B08D55]/20 file:text-[#B08D55] file:font-bold file:cursor-pointer hover:file:bg-[#B08D55]/30"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-[#2c2926]/5">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#2c2926] text-[#F2EFE9] px-6 py-2.5 rounded-lg font-bold hover:bg-[#4a4540] transition-colors shadow-lg hover:translate-y-[-1px] text-sm"
            >
              <Save size={16} /> Update Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductEditScreen;
