import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Search, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductListScreen = () => {
  const { userInfo } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
    } catch (err) {
        setError(err.message);
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.delete(`/api/products/${id}`, config);
          setProducts(products.filter(p => p._id !== id));
          toast.success('Product deleted');
      } catch (err) {
          toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const createProductHandler = async () => {
      try {
          const config = {
              headers: {
                  Authorization: `Bearer ${userInfo.token}`,
              },
          };
          const { data: createdProduct } = await axios.post('/api/products', {}, config);
          toast.success('Product created');
          navigate(`/admin/product/${createdProduct._id}/edit`);
      } catch (err) {
          toast.error(err.response?.data?.message || 'Create failed');
      }
  };

  return (
    <div className="w-full relative tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div>
                <h1 className="text-4xl font-serif font-bold text-primary mb-2">Products</h1>
                <p className="text-secondary text-sm font-medium tracking-wide">Manage and organize your catalog</p>
            </div>
            <button 
                onClick={createProductHandler}
                className="bg-[#2c2926] text-[#F2EFE9] px-6 py-3 rounded-full font-bold flex items-center hover:bg-[#4a4540] transition-colors shadow-lg"
            >
                 <Plus className="mr-2" size={18} /> Add Product
            </button>
      </div>

      <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[30px] border border-[#2c2926]/5 bg-white/60 overflow-hidden shadow-xl flex flex-col"
        >
            <div className="p-6 border-b border-[#2c2926]/5 flex items-center gap-4 flex-shrink-0">
                <Search className="text-secondary" size={20} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="bg-transparent border-none focus:outline-none text-primary placeholder:text-secondary/50 w-full"
                />
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <table className="w-full">
                    <thead className="bg-[#B08D55]/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                        <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">ID</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">Product</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-[#B08D55] uppercase tracking-widest">Price</th>

                        <th className="px-8 py-5 text-right text-xs font-bold text-[#B08D55] uppercase tracking-widest">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2c2926]/5">
                    {products.map((product) => (
                        <tr key={product._id} className="hover:bg-white/50 transition-colors">
                        <td className="px-8 py-6 text-sm text-secondary font-mono">{product._id.substring(0, 6)}...</td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white p-1 border border-[#2c2926]/5 flex-shrink-0">
                                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-primary">{product.name}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-primary">৳{product.price?.toLocaleString()}</td>

                        <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                                <Link to={`/admin/product/${product._id}/edit`} className="p-2 rounded-full hover:bg-[#B08D55]/10 text-secondary hover:text-[#B08D55] transition-colors">
                                    <Edit2 size={18} />
                                </Link>
                                <button onClick={() => deleteHandler(product._id)} className="p-2 rounded-full hover:bg-red-50 text-secondary hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 border-t border-[#2c2926]/5 flex justify-between items-center text-sm text-secondary flex-shrink-0">
                <span>Showing {products.length} products</span>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg hover:bg-white/50 disabled:opacity-50">Previous</button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

export default ProductListScreen;
