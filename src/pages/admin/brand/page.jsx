import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  Globe,
  Trash2,
  Edit3,
  Save,
  X,
  ImageIcon,
  Layers,
  Package,
  Percent,
  Tag,
  LayoutGrid,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function BrandPage() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  // Logic States
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // UI State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOGIC FUNCTIONS ---

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/brand`);
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  const checkJWT = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return navigate('/account/login');
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      }
    } catch (error) {
      navigate('/account/login');
    }
  };

  const uploadFileOnBunney = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const response = await fetch(`/api/upload?file=${fileName}`, {
        method: "PUT",
        body: file,
      });
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      return null;
    }
  };

  const deleteFileFromBunny = async (fullUrl) => {
    try {
      const fileName = fullUrl.split('/').pop();
      const response = await fetch(`/api/delete-file?file=${fileName}`, { method: "DELETE" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    try {
      let finalPhotoUrl = photoUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadFileOnBunney(selectedFile);
        if (!uploadedUrl) throw new Error("CDN Upload failed");
        finalPhotoUrl = uploadedUrl;
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, photoUrl: finalPhotoUrl }),
      });

      if (res.ok) {
        setMessage("Success: Brand created");
        setTitle("");
        setSelectedFile(null);
        setIsModalOpen(false); // Close modal on success
        fetchBrands();
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brand) => {
    if (!confirm(`Delete ${brand.title}?`)) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/brand/${brand._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        if (brand.photoUrl) await deleteFileFromBunny(brand.photoUrl);
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/brand/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editingTitle }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchBrands();
  }, []);

  const navItems = [
    { name: "Categories", href: "/admin/categorie", icon: LayoutGrid },
    { name: "Brands", href: "/admin/brand", icon: Globe },
    { name: "Tax Rules", href: "/admin/taxrule", icon: Percent },
    { name: "Collections", href: "/admin/collection", icon: Layers },
    { name: "Attributes", href: "/admin/attribute", icon: Tag },
    { name: "All Products", href: "/admin/allproduct", icon: Package },
  ];

  const filteredBrands = brands.filter(brand =>
    brand.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">
      {/* 1. HEADER (Matches Inventory Manager Look) */}
      {/* <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <Package className="text-white" size={20}  />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Inventory Manager</h1>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${pathname === item.href ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}>
              {item.name}
            </Link>
          ))}
        </nav>
      </header> */}

      <main className="w-full p-6 lg:p-10 max-w-7xl mx-auto">
        {/* 2. TITLE SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">Brand List</h2>
            <p className="text-gray-500 mt-1">Browse and manage your entire brand directory.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}  />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-xl w-64 focus:ring-4 focus:ring-black/5 outline-none transition-all"
               />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <Plus size={20}  /> Add New Brand
            </button>
          </div>
        </div>

        {/* 3. TABLE VIEW (Matches the Product List UI) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-5">Preview</th>
                <th className="px-6 py-5">Brand Details</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBrands.map((brand) => (
                <tr key={brand._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2">
                      <img 
                        src={brand.photoUrl || "/placeholder.png"} 
                        alt="" width={40} height={40} 
                        className="object-contain" 
                       />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      {editingId === brand._id ? (
                        <input 
                          value={editingTitle} 
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="font-bold text-gray-900 border-b border-black outline-none bg-transparent"
                          autoFocus
                         />
                      ) : (
                        <>
                          <span className="font-bold text-gray-900 text-lg">{brand.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {brand._id.slice(-6)}</span>
                          </div>
                        < />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === brand._id ? (
                        <button onClick={() => saveEdit(brand._id)} className="p-2.5 bg-black text-white rounded-lg hover:scale-110 transition"><Save size={16} /></button>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(brand._id); setEditingTitle(brand.title); }} className="p-2.5 text-gray-400 hover:text-black border border-gray-100 rounded-lg hover:bg-white hover:shadow-sm transition-all"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(brand)} className="p-2.5 text-gray-400 hover:text-red-600 border border-gray-100 rounded-lg hover:bg-white hover:shadow-sm transition-all"><Trash2 size={16} /></button>
                        < />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBrands.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-medium italic">No brands found.</div>
          )}
        </div>
      </main>

      {/* 4. BRAND CREATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}  />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-gray-400 hover:text-black transition-colors"><X size={24}  /></button>
            
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Create New Brand</h2>
            <p className="text-gray-500 mb-8 font-medium">Add a professional touch to your inventory.</p>

            <form onSubmit={handleSingleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nike, Apple"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800"
                  required
                 />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Brand Logo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full bg-gray-50 border border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800"
                   />
                  <ImageIcon className="absolute left-4 top-4 text-gray-400" size={20}  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : <><Plus size={20}  /> Create Brand< />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}