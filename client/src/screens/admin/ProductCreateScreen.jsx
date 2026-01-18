import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const ProductCreateScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit file size to 500KB
      if (file.size > 500000) {
        toast.error("Image size must be less than 500KB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max dimensions
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          const maxHeight = 800;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              const compressedReader = new FileReader();
              compressedReader.onloadend = () => {
                setImagePreview(compressedReader.result);
                setImage(compressedReader.result);
              };
              compressedReader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.75,
          );
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !price || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/products`,
        {
          name,
          price: parseFloat(price),
          image,
          description,
          countInStock: 0,
          category: "Sample category",
          brand: "Sample brand",
        },
        config,
      );

      toast.success("Product created successfully");
      navigate("/admin/productlist");
      // Force refresh the product list
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative tracking-wide max-w-5xl mx-auto h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/admin/productlist"
          className="inline-flex items-center text-secondary hover:text-[#B08D55] transition-colors font-medium text-sm"
        >
          <ArrowLeft className="mr-2" size={16} /> Back
        </Link>
        <h1 className="text-2xl font-serif font-bold text-primary">
          Add New Product
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
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                  placeholder="Product Name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B08D55] ml-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/50 border border-[#2c2926]/10 rounded-lg px-3 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08D55]/20 focus:border-[#B08D55] transition-all text-sm min-h-[80px] resize-none"
                  placeholder="Product Description"
                  required
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
                  {imagePreview ? (
                    <img
                      src={imagePreview}
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
              disabled={loading}
              className="flex items-center gap-2 bg-[#2c2926] text-[#F2EFE9] px-6 py-2.5 rounded-lg font-bold hover:bg-[#4a4540] transition-colors shadow-lg hover:translate-y-[-1px] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Save size={16} /> Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductCreateScreen;
