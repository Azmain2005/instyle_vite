import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Trash2,
  Plus,
  Edit3,
  Search,
  Package,
  LayoutGrid,
  Globe,
  Percent,
  Layers,
  Tag,
  ExternalLink,
  MoreVertical,
  Calendar,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct for v4


export default function ProductsPage() {
  const pathname = useLocation().pathname;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");



  const navigate = useNavigate();

  const checkJWT = async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      navigate('/account/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      console.log(decoded.exp);
      console.log(currentTime);
      if (decoded.exp < currentTime) {

        localStorage.removeItem('auth_token');
        navigate('/account/login');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      navigate('/account/login');
    }
  }



  useEffect(() => {
    // checkJWT();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // 1. Add the CDN deletion helper function
  const deleteFileFromBunny = async (fullUrl) => {
    try {
      // Splits by '/' and takes the last part (the filename)
      const fileName = fullUrl.split('/').pop();

      const response = await fetch(`/api/delete-file?file=${fileName}`, {
        method: "DELETE",
      });

      return response.ok;
    } catch (error) {
      console.error("CDN Delete Error:", error);
      return false;
    }
  };

  // 2. Update the handleDelete function
  const handleDelete = async (product) => { // Change 'id' to the whole 'product' object
    if (!confirm(`Are you sure you want to delete "${product.title}" and its images?`)) return;

    const token = localStorage.getItem("auth_token");

    try {
      // First, delete from your database
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Second, if the product has photos, delete each one from Bunny.net
      if (product.photos && product.photos.length > 0) {
        toast.loading("Cleaning up images from CDN...");

        // Loop through the photos array and delete each file
        const deletePromises = product.photos
          .filter(url => url && url.trim() !== "") // Only attempt to delete valid URLs
          .map(url => deleteFileFromBunny(url));

        await Promise.all(deletePromises);
      }

      // Update UI
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.dismiss(); // Remove the loading toast
      toast.success("Product and images removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const navItems = [
    { name: "Categories", href: "/admin/categorie", icon: LayoutGrid },
    { name: "Brands", href: "/admin/brand", icon: Globe },
    { name: "Tax Rules", href: "/admin/taxrule", icon: Percent },
    { name: "Collections", href: "/admin/collection", icon: Layers },
    { name: "Attributes", href: "/admin/attribute", icon: Tag },
    { name: "All Products", href: "/admin/allproduct", icon: Package },
  ];

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">

      {/* 1. FULL WIDTH HEADER NAVIGATION */}
      {/* <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Package className="text-white" size={20}  />
            </div>
            <span className="text-xl font-bold tracking-tight">Inventory Manager</span>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                >
                  <Icon size={16}  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header> */}

      {/* 2. MAIN CONTENT AREA */}
      <main className="w-full p-6 lg:p-10">

        {/* Page Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Product List</h1>
            <p className="text-gray-500 mt-2 font-medium">Browse and manage your entire store inventory.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20}  />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all shadow-sm"
               />
            </div>
            <Link
              to="/admin/product"
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 w-full sm:w-auto active:scale-95"
            >
              <Plus size={20}  /> Add New Product
            </Link>
          </div>
        </div>

        {/* 3. FULL WIDTH TABLE CONTAINER */}
        <div className="w-full bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              <p className="text-gray-400 font-bold animate-pulse">Syncing Inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-40">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-gray-300" size={32}  />
              </div>
              <p className="text-gray-400 text-xl font-medium">No products found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Preview</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Associations</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Stock Info</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.slice(0).reverse().map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                      {/* Photo */}
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 mx-auto bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {p.photos?.[0] ? (
                            <img
                              src={p.photos[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                             />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={20}  />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-900 text-lg line-clamp-1">{p.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded-md">Public</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">ID: {p._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-black flex items-center gap-1">
                            {/* Replaced DollarSign with a span containing the BDT symbol */}
                            <span className="text-green-600 text-base leading-none">৳</span>
                            {p.selling}
                            <span className="text-[10px] text-gray-400 font-medium">Sale</span>
                          </span>
                          <span className="text-xs font-medium text-gray-400 line-through">
                            {p.purchased} BDT Cost
                          </span>
                        </div>
                      </td>

                      {/* Brand & Category */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1">
                            <Globe size={12} className="text-gray-400"  />
                            <span className="text-xs font-bold text-gray-700">{p.brand?.title || "No Brand"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag size={12} className="text-gray-400"  />
                            <span className="text-[10px] font-medium text-gray-500 truncate max-w-[150px]">
                              {p.categorie?.map(c => c.title).join(", ") || "Uncategorized"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Unit & Date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-gray-800 bg-gray-100 px-2 py-1 rounded-lg w-fit">
                            {p.unit} <span className="text-[10px] font-bold opacity-50 uppercase">Stock</span>
                          </span>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar size={12}  />
                            <span className="text-[10px] font-bold uppercase">{new Date(p.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/productedit/${p._id}`}
                            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black rounded-xl transition-all shadow-sm hover:shadow-md"
                            title="Edit Product"
                          >
                            <Edit3 size={18}  />
                          </Link>
                          <button
                            onClick={() => handleDelete(p)} // Pass the whole object 'p'
                            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                            title="Delete Product"
                          >
                            <Trash2 size={18}  />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {!loading && (
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Viewing <span className="text-black">{filteredProducts.length}</span> of <span className="text-black">{products.length}</span> products
              </span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
                <button className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:border-black transition-colors shadow-sm">Next Page</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}