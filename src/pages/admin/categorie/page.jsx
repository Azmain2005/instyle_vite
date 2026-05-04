import React, { useState, useEffect } from "react";
import {
  Plus,
  Tag,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  AlertCircle,
  CheckCircle2,
  GitBranch
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function CategoryPage() {
  // States
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("parent");
  const [parentId, setParentId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      if (decoded.exp < currentTime) {
        localStorage.removeItem('auth_token');
        navigate('/account/login');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      navigate('/account/login');
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorie`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchCategories();
  }, []);

  // Helper to find parent title
  const getParentTitle = (pId) => {
    if (!pId) return null;
    const parent = categories.find(cat => cat._id === pId);
    return parent ? parent.title : "Unknown Parent";
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!title.trim()) {
      setMessage("Category title cannot be empty.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");
    const payload = {
      title,
      type,
      parentid: type === "child" ? parentId : null,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Success: Category added successfully!");
        setTitle("");
        setType("parent");
        setParentId("");
        fetchCategories();
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorie/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (res.ok) {
        setMessage("Success: Category deleted");
        fetchCategories();
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setEditingTitle(category.title);
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("auth_token");
    if (!editingTitle.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categorie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTitle }),
      });
      if (res.ok) {
        setMessage("Success: Category updated");
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans p-4 md:p-8 lg:p-10 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-6 w-full">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Category List</h1>
          <p className="text-gray-500 mt-2">Organize your store structure and parent-child relations.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}  />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-[#f9f9f9] border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
             />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={20}  /> Add New Category
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-50 text-[11px] uppercase tracking-widest text-gray-400 font-bold bg-[#fafafa]">
                <th className="px-8 py-6">Icon</th>
                <th className="px-8 py-6">Category Name</th>
                <th className="px-8 py-6">Parent Category</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-gray-400 font-medium">
                    No results found for your search.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Tag size={20}  />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {editingId === category._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="border-2 border-black rounded-lg px-3 py-1.5 outline-none font-bold"
                            autoFocus
                           />
                          <button onClick={() => saveEdit(category._id)} className="text-green-600 p-1 hover:bg-green-50 rounded"><Save size={20} /></button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-lg text-gray-900">{category.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Live</span>
                            <span className="text-[10px] text-gray-300 font-medium ml-2">ID: {category._id.slice(-8).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {category.type === 'child' ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <GitBranch size={14} className="text-gray-300"  />
                          <span className="font-bold text-sm">{getParentTitle(category.parentid) || "—"}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs font-medium italic">Top Level</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        category.type === 'child' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {category.type === 'child' ? 'Sub' : 'Main'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => startEditing(category)} className="p-2.5 text-gray-300 hover:text-black border border-transparent hover:border-gray-100 hover:bg-white rounded-xl transition-all shadow-sm">
                          <Edit3 size={18}  />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="p-2.5 text-gray-300 hover:text-red-600 border border-transparent hover:border-red-50 hover:bg-red-50/30 rounded-xl transition-all shadow-sm">
                          <Trash2 size={18}  />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-black"><X size={28}  /></button>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900">New Category</h2>
              <p className="text-gray-500 mt-2">Add a main category or link a sub-category to a parent.</p>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Footwear"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-transparent p-5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-lg"
                  required
                 />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Level</label>
                <div className="flex gap-3">
                  {["parent", "child"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-4 rounded-xl border-2 font-bold capitalize transition-all ${type === t
                        ? "border-black bg-black text-white shadow-lg shadow-gray-200"
                        : "border-gray-100 bg-gray-50 text-gray-400"
                        }`}
                    >
                      {t === 'parent' ? 'Main Category' : 'Sub Category'}
                    </button>
                  ))}
                </div>
              </div>

              {type === "child" && (
                <div className="space-y-3 animate-in slide-in-from-top-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Parent Link</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-transparent p-5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all"
                    required={type === "child"}
                  >
                    <option value="">Select Parent...</option>
                    {categories
                      .filter((cat) => cat.type === "parent")
                      .map((parent) => (
                        <option key={parent._id} value={parent._id}>{parent.title}</option>
                      ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${loading
                  ? "bg-gray-100 text-gray-400"
                  : "bg-black text-white hover:bg-gray-800 shadow-xl"
                  }`}
              >
                {loading ? "Processing..." : "Create Category"}
              </button>
            </form>

            {message && (
              <div className={`mt-8 p-5 rounded-2xl flex items-center gap-4 text-sm font-bold ${message.toLowerCase().includes("success")
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                {message.toLowerCase().includes("success") ? <CheckCircle2 size={20}  /> : <AlertCircle size={20}  />}
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}