import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Save,
  ArrowLeft,
  Package,
  Image as ImageIcon,
  Tag,
  LayoutGrid,
  Globe,
  Percent,
  Layers,
  Search,
  Settings,
  ShieldCheck,
  Undo2,
  Trash2,
  Plus
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { Toaster, toast } from "react-hot-toast";


export default function EditProductPage() {
  const { id } = useParams();
  const pathname = useLocation().pathname;

  const [form, setForm] = useState({
    title: "",
    purchased: "",
    selling: "",
    unit: "",
    overview: "",
    description: "",
    tags: "",
    refundable: "no",
    warrenty: "no",
    photos: ["", "", ""],
    meta_title: "",
    meta_tags: "",
    meta_description: "",
    brand: "",
    tax: "",
    collections: [],
    categorie: [],
    attributes: [],
  });

  const [brands, setBrands] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [collectionsOpt, setCollectionsOpt] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [prevForm, setPrevForm] = useState(null);



  const navigate = useNavigate();




  const fetchOptions = useCallback(async () => {
    try {
      const [b, t, col, c] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/brand`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/tax`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/collection`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorie`),
      ]);
      setBrands(b.data);
      setTaxes(t.data);
      setCollectionsOpt(col.data);
      setCategories(c.data);
    } catch {
      toast.error("Failed to load dropdown data");
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/${id}`);
      const data = res.data;

      setForm({
        ...data,
        collections: data.collections?.map(c => c._id) || [],
        categorie: data.categorie?.map(c => c._id) || [],
        attributes: data.attributes && data.attributes.length > 0
          ? data.attributes.map(attr => ({
            title: attr.title || "",
            values: Array.isArray(attr.values) ? attr.values.map(v => ({
              val: v.val || "",
              price: v.price || 0 // Use price here
            })) : [],
          }))
          : [],
      });

      setPrevForm({
        collections: data.collections?.map(c => c._id) || [],
        categorie: data.categorie?.map(c => c._id) || [],
      });
    } catch (err) {
      toast.error("Failed to fetch product");
    }
  }, [id]);


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
    checkJWT();
    fetchOptions();
    fetchProduct();
  }, [fetchOptions, fetchProduct]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleArrayToggle = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((v) => v !== value) : [...prev[key], value],
      };
    });
  };

  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...form.photos];
    updatedPhotos[index] = value;
    setForm({ ...form, photos: updatedPhotos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("auth_token");

    const payload = {
      ...form,
      collections: form.collections.length ? form.collections : prevForm.collections,
      categorie: form.categorie.length ? form.categorie : prevForm.categorie,
      attributes: form.attributes.map(attr => ({
        title: attr.title,
        values: attr.values.map(v => ({
          val: v.val,
          price: Number(v.price) // Use price here
        }))
      })),
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Product updated successfully!");
      setMessage("✅ Product updated successfully!");
    } catch {
      toast.error("Update failed");
      setMessage("❌ Failed to update product.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-gray-900 font-sans pb-20">
      {/* 1. STICKY HEADER */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/allproduct" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20}  />
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Editing Product</span>
              <h1 className="text-lg font-black truncate max-w-[200px]">{form.title || "Untitled Product"}</h1>
            </div>
          </div>


        </div>
      </header>

      {/* 2. MAIN FORM AREA */}
      <main className="max-w-[1400px] mx-auto p-6 lg:p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="xl:col-span-8 space-y-8">

            {/* General Info */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Package size={20}  />
                </div>
                <h2 className="text-xl font-bold">General Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Product Title</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter a descriptive title" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-lg font-bold" required  />
                </div>

                <div className="grid grid-cols-1 gap-6"> {/* Removed md:grid-cols-2 */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Short Overview</label>
                    <textarea
                      name="overview"
                      value={form.overview}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl h-32 resize-none focus:ring-2 focus:ring-stone-200 transition-all"
                      placeholder="Catchy summary..."
                     />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Full Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none p-4 rounded-2xl h-72 resize-none focus:ring-2 focus:ring-stone-200 transition-all"
                      placeholder="Technical details..."
                     />
                  </div>
                </div>
              </div>
            </section>

            {/* Attributes Section */}
            {/* Product Variations Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Settings size={20}  />
                  </div>
                  <h2 className="text-xl font-bold">Product Variations & Stock</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, attributes: [...form.attributes, { title: "", values: [{ val: "", price: 0 }] }] })}
                  className="flex items-center gap-2 text-sm font-bold bg-gray-100 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all"
                >
                  <Plus size={16}  /> Add Attribute
                </button>
              </div>

              <div className="space-y-6">
                {form.attributes.map((attr, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-[2rem] relative group border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attribute Name (e.g. Size)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Size"
                            value={attr.title}
                            onChange={(e) => {
                              const updated = [...form.attributes];
                              updated[index].title = e.target.value;
                              setForm({ ...form, attributes: updated });
                            }}
                            className="flex-1 bg-white border-none p-3 rounded-xl focus:ring-2 focus:ring-black outline-none font-bold shadow-sm"
                           />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...form.attributes];
                              updated[index].values.push({ val: "", price: 0 });
                              setForm({ ...form, attributes: updated });
                            }}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100"
                          >
                            + Add Value
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {attr.values.map((vObj, vIdx) => (
                          <div key={vIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                            <input
                              placeholder="XL"
                              value={vObj.val}
                              onChange={(e) => {
                                const updated = [...form.attributes];
                                updated[index].values[vIdx].val = e.target.value;
                                setForm({ ...form, attributes: updated });
                              }}
                              className="w-full text-xs border-none focus:ring-0 font-medium"
                             />
                            <div className="h-4 w-[1px] bg-gray-200"  />
                            <input
                              type="number"
                              placeholder="Price"
                              value={vObj.price ?? 0} // Fixes the "uncontrolled" error
                              onChange={(e) => {
                                const updated = [...form.attributes];
                                updated[index].values[vIdx].price = e.target.value;
                                setForm({ ...form, attributes: updated });
                              }}
                              className="w-16 text-xs border-none focus:ring-0 text-indigo-600 font-bold"
                             />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...form.attributes];
                                updated[index].values = updated[index].values.filter((_, i) => i !== vIdx);
                                setForm({ ...form, attributes: updated });
                              }}
                              className="text-red-300 hover:text-red-500"
                            >
                              <Trash2 size={12}  />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, attributes: form.attributes.filter((_, i) => i !== index) })}
                      className="absolute -top-2 -right-2 bg-white text-red-500 p-2 rounded-full shadow-md border border-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14}  />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Image Gallery */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <ImageIcon size={20}  />
                </div>
                <h2 className="text-xl font-bold">Image Gallery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {form.photos.map((p, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-full aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border border-dashed border-gray-200 flex items-center justify-center">
                      {p ? <img src={p} className="w-full h-full object-cover" alt="Preview"  /> : <ImageIcon className="text-gray-200" size={40}  />}
                    </div>
                    <input type="text" value={p} onChange={(e) => handlePhotoChange(i, e.target.value)} placeholder={`Image URL #${i + 1}`} className="w-full bg-gray-50 border-none p-3 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 transition-all"  />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SIDEBAR CONTROLS */}
          <div className="xl:col-span-4 space-y-8">

            {/* Price & Stock Card */}
            <section className="bg-black text-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Tag size={16}  />
                </div>
                <h2 className="font-bold">Logistics & Pricing</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Selling Price</label>
                    <input type="number" name="selling" value={form.selling} onChange={handleChange} className="w-full bg-white/10 border-none p-3 rounded-xl focus:bg-white focus:text-black transition-all font-black text-xl"  />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Cost Price</label>
                    <input type="number" name="purchased" value={form.purchased} onChange={handleChange} className="w-full bg-white/10 border-none p-3 rounded-xl focus:bg-white focus:text-black transition-all"  />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Unit Type (e.g., Pcs)</label>
                  <input type="text" name="unit" value={form.unit} onChange={handleChange} className="w-full bg-white/10 border-none p-3 rounded-xl focus:bg-white focus:text-black transition-all"  />
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="text-gray-400">Profit Margin</span>
                  <span className="font-bold text-green-400">+ ${form.selling - form.purchased}</span>
                </div>
              </div>
            </section>

            {/* Categorization Card */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Categorization</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Primary Brand</label>
                  <select name="brand" value={form.brand} onChange={handleChange} className="w-full bg-gray-50 border-none p-3 rounded-xl">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Tax Profile</label>
                  <select name="tax" value={form.tax} onChange={handleChange} className="w-full bg-gray-50 border-none p-3 rounded-xl">
                    <option value="">Default Tax</option>
                    {taxes.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-700">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat._id} type="button" onClick={() => handleArrayToggle("categorie", cat._id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${form.categorie.includes(cat._id) ? "bg-black text-white border-black" : "bg-white border-gray-100 text-gray-400"}`}>
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <label className="text-xs font-bold text-gray-700">Policies</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase">Refund</span>
                      <input type="checkbox" checked={form.refundable === "yes"} onChange={(e) => setForm({ ...form, refundable: e.target.checked ? "yes" : "no" })} className="w-4 h-4 rounded text-black border-none focus:ring-0"  />
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase">Warranty</span>
                      <input type="checkbox" checked={form.warrenty === "yes"} onChange={(e) => setForm({ ...form, warrenty: e.target.checked ? "yes" : "no" })} className="w-4 h-4 rounded text-black border-none focus:ring-0"  />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SEO Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-gray-400">
                <ShieldCheck size={16}  />
                <h3 className="text-[10px] font-black uppercase tracking-widest">SEO Meta-Data</h3>
              </div>
              <div className="space-y-4">
                <input type="text" name="meta_title" value={form.meta_title} onChange={handleChange} placeholder="SEO Page Title" className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm"  />
                <textarea name="meta_description" value={form.meta_description} onChange={handleChange} placeholder="SEO Description" className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm h-20 resize-none"  />
              </div>
            </section>

            {/* SAVE ACTION */}
            <div className="sticky bottom-6 flex flex-col gap-3">
              <button type="submit" disabled={loading} className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95"}`}>
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"  /> : <Save size={24}  />}
                Update Product
              </button>
              <Link to="/admin/allproduct" className="w-full py-4 text-center text-gray-400 font-bold hover:text-black transition-colors text-sm">Discard Changes</Link>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
}