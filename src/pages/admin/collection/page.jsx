import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Layers, 
  Search, 
  FileStack,
  AlignLeft,
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function CollectionPage() {
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Data States
  const [collections, setCollections] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState({
    title: "",
    description: "",
  });

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

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collection`);
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchCollections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Title cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collection`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setMessage("Success: Collection created!");
        setTitle("");
        setDescription("");
        fetchCollections();
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collection/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (res.ok) {
        setMessage("Success: Collection deleted");
        fetchCollections();
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const startEditing = (collection) => {
    setEditingId(collection._id);
    setEditingCollection({
      title: collection.title,
      description: collection.description || "",
    });
  };

  const saveEdit = async (id) => {
    if (!editingCollection.title.trim()) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collection/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(editingCollection),
      });
      if (res.ok) {
        setMessage("Success: Collection updated");
        setEditingId(null);
        fetchCollections();
      }
    } catch (err) {
      setMessage("Update failed");
    }
  };

  const filteredCollections = collections.filter(col => 
    col.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans p-4 md:p-8 lg:p-10 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-6 w-full">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Collections Library</h1>
          <p className="text-gray-500 mt-2">Manage thematic product groups and seasonal releases.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}  />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-[#f9f9f9] border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
             />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={20}  /> Add New Collection
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-50 text-[11px] uppercase tracking-widest text-gray-400 font-bold bg-[#fafafa]">
                <th className="px-8 py-6">Preview</th>
                <th className="px-8 py-6">Collection Details</th>
                <th className="px-8 py-6">Summary</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-gray-400 font-medium">
                    No collections found.
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col) => (
                  <tr key={col._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Layers size={20}  />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {editingId === col._id ? (
                        <input
                          type="text"
                          value={editingCollection.title}
                          onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                          className="border-2 border-black rounded-lg px-3 py-1.5 outline-none font-bold text-sm w-full max-w-xs"
                          autoFocus
                         />
                      ) : (
                        <div>
                          <div className="font-bold text-lg text-gray-900 group-hover:text-black transition-colors">{col.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Live Entry</span>
                            <span className="text-[10px] text-gray-300 font-medium ml-2">UID: {col._id.slice(-8).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === col._id ? (
                        <textarea
                          value={editingCollection.description}
                          onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                          className="border-2 border-black rounded-lg px-3 py-1.5 outline-none text-sm w-full max-w-sm h-20 resize-none"
                         />
                      ) : (
                        <p className="text-gray-400 text-sm line-clamp-2 max-w-xs">
                          {col.description || "No description provided."}
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-green-50 text-green-600 border-green-100">
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        {editingId === col._id ? (
                          <>
                            <button onClick={() => saveEdit(col._id)} className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all">
                              <Save size={18}  />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                              <X size={18}  />
                            </button>
                          < />
                        ) : (
                          <>
                            <button onClick={() => startEditing(col)} className="p-2.5 text-gray-300 hover:text-black border border-transparent hover:border-gray-100 hover:bg-white rounded-xl transition-all shadow-sm">
                              <Edit3 size={18}  />
                            </button>
                            <button onClick={() => handleDelete(col._id)} className="p-2.5 text-gray-300 hover:text-red-600 border border-transparent hover:border-red-50 hover:bg-red-50/30 rounded-xl transition-all shadow-sm">
                              <Trash2 size={18}  />
                            </button>
                          < />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#fafafa] border-t border-gray-50 text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Total Collections: <span className="text-black ml-1">{filteredCollections.length}</span>
          </p>
        </div>
      </div>

      {/* MODAL FOR ADDING COLLECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={28}  />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">New Collection</h2>
              <p className="text-gray-500 mt-2">Group products into seasonal or thematic sets.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3 group">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Collection Title</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Summer Sale 2026" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-[#f9f9f9] border border-transparent p-5 pl-14 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-lg" 
                    required 
                   />
                  <FileStack className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={24}  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Description</label>
                <div className="relative">
                  <textarea 
                    placeholder="Describe the theme..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full bg-[#f9f9f9] border border-transparent p-5 pl-14 rounded-2xl focus:bg-white focus:border-black outline-none transition-all h-32 resize-none" 
                   />
                  <AlignLeft className="absolute left-5 top-6 text-gray-300 group-focus-within:text-black transition-colors" size={24}  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${loading 
                  ? "bg-gray-100 text-gray-400" 
                  : "bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10 active:scale-95"
                }`}
              >
                {loading ? "Creating..." : "Confirm & Create"}
              </button>
            </form>

            {message && (
              <div className={`mt-8 p-5 rounded-2xl flex items-center gap-4 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${message.toLowerCase().includes("success") 
                ? "bg-green-50 text-green-700 border border-green-100" 
                : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                {message.toLowerCase().includes("success") ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}