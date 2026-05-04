import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Percent,
  Search,
  FileText,
  Hash,
  CheckCircle2,
  AlertCircle,
  Receipt
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function TaxPage() {
  // States for new tax rule
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("number");
  const [number, setNumber] = useState("");

  // App states
  const [taxes, setTaxes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Editing state
  const [editingTax, setEditingTax] = useState({
    title: "",
    description: "",
    type: "number",
    number: "",
  });

  const fetchTaxes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tax`);
      const data = await res.json();
      setTaxes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch taxes", err);
    }
  };

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

  useEffect(() => {
    checkJWT();
    fetchTaxes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tax`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, type, number }),
      });
      if (res.ok) {
        setMessage("Success: Tax rule added!");
        setTitle(""); setDescription(""); setType("number"); setNumber("");
        fetchTaxes();
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tax rule?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tax/${id}`, { 
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (res.ok) {
        setMessage("Success: Tax rule removed");
        fetchTaxes();
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const startEditing = (tax) => {
    setEditingId(tax._id);
    setEditingTax({
      title: tax.title,
      description: tax.description || "",
      type: tax.type,
      number: tax.number,
    });
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tax/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingTax),
      });
      if (res.ok) {
        setMessage("Success: Updated tax rule");
        setEditingId(null);
        fetchTaxes();
      }
    } catch (err) {
      setMessage("Update failed");
    }
  };

  const filteredTaxes = taxes.filter(tax =>
    tax.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans p-4 md:p-8 lg:p-10 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-6 w-full">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tax Configurations</h1>
          <p className="text-gray-500 mt-2">Manage tax rates and financial rules for your store inventory.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}  />
            <input
              type="text"
              placeholder="Search tax rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-[#f9f9f9] border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
             />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={20}  /> Add Tax Rule
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
                <th className="px-8 py-6">Rule Details</th>
                <th className="px-8 py-6">Rate Value</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTaxes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-gray-400 font-medium">
                    No tax rules found.
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((tax) => (
                  <tr key={tax._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        tax.type === 'percent' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                      } group-hover:bg-black group-hover:text-white`}>
                        {tax.type === 'percent' ? <Percent size={20}  /> : <Hash size={20}  />}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {editingId === tax._id ? (
                        <div className="space-y-2 max-w-xs">
                          <input
                            type="text"
                            value={editingTax.title}
                            onChange={(e) => setEditingTax({ ...editingTax, title: e.target.value })}
                            className="w-full border-2 border-black rounded-lg px-3 py-1.5 outline-none font-bold text-sm"
                           />
                          <textarea
                            value={editingTax.description}
                            onChange={(e) => setEditingTax({ ...editingTax, description: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-xs h-16 resize-none"
                           />
                        </div>
                      ) : (
                        <div className="max-w-md">
                          <div className="font-bold text-lg text-gray-900 group-hover:text-black transition-colors">{tax.title}</div>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-1">{tax.description || "No description provided."}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === tax._id ? (
                        <input
                          type="number"
                          value={editingTax.number}
                          onChange={(e) => setEditingTax({ ...editingTax, number: e.target.value })}
                          className="w-24 border-2 border-black rounded-lg px-3 py-1.5 outline-none font-bold"
                         />
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-black">
                            {tax.type === "percent" ? `${tax.number}%` : `$${tax.number}`}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === tax._id ? (
                        <select
                          value={editingTax.type}
                          onChange={(e) => setEditingTax({ ...editingTax, type: e.target.value })}
                          className="border-2 border-black rounded-lg px-2 py-1.5 outline-none font-bold text-xs"
                        >
                          <option value="number">Fixed</option>
                          <option value="percent">Percent</option>
                        </select>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          tax.type === 'percent' 
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                            : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {tax.type === 'percent' ? 'Percentage' : 'Fixed Rate'}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        {editingId === tax._id ? (
                          <>
                            <button onClick={() => saveEdit(tax._id)} className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all">
                              <Save size={18}  />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                              <X size={18}  />
                            </button>
                          < />
                        ) : (
                          <>
                            <button onClick={() => startEditing(tax)} className="p-2.5 text-gray-300 hover:text-black border border-transparent hover:border-gray-100 hover:bg-white rounded-xl transition-all shadow-sm">
                              <Edit3 size={18}  />
                            </button>
                            <button onClick={() => handleDelete(tax._id)} className="p-2.5 text-gray-300 hover:text-red-600 border border-transparent hover:border-red-50 hover:bg-red-50/30 rounded-xl transition-all shadow-sm">
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
            Active Rules: <span className="text-black ml-1">{filteredTaxes.length}</span>
          </p>
        </div>
      </div>

      {/* MODAL FOR ADDING TAX RULE */}
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
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Tax Rule</h2>
              <p className="text-gray-500 mt-2">Define how taxes are applied to your transactions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Rule Title</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Standard VAT"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-transparent p-5 pl-14 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-lg"
                    required
                   />
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={24}  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Description</label>
                <textarea
                  placeholder="Notes about this tax rule..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-transparent p-5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all h-24 resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-transparent p-5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all appearance-none cursor-pointer font-bold"
                  >
                    <option value="number">Fixed Amount</option>
                    <option value="percent">Percentage</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Rate Value</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-[#f9f9f9] border border-transparent p-5 pl-14 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-lg font-bold"
                      required
                     />
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={24}  />
                  </div>
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
                {loading ? "Processing..." : "Add Tax Rule"}
              </button>
            </form>

            {message && (
              <div className={`mt-8 p-5 rounded-2xl flex items-center gap-4 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${message.toLowerCase().includes("success")
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