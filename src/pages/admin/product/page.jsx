import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export default function Page() {
    // form state
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
        attributes: [{ title: "", values: [{ val: "", price: 0 }] }],
        showCategories: false,
    });

    // options pulled from backend
    const [brands, setBrands] = useState([]);
    const [collectionsOpt, setCollectionsOpt] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributesOpt, setAttributesOpt] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [selectedFiles, setSelectedFiles] = useState([null, null, null]);


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



    // fetch option lists
    useEffect(() => {
        checkJWT();
        const fetchOptions = async () => {
            try {
                const [b, c, t, cat, att] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/brand`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/collection`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/tax`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorie`),
                ]);
                setBrands(b.data || []);
                setCollectionsOpt(c.data || []);
                setTaxes(t.data || []);
                setCategories(cat.data || []);
            } catch (err) {
                console.error("Failed to load options:", err);
                setMessage("Failed to load dropdown data. Check backend.");
            }
        };
        fetchOptions();
    }, []);

    // generic change for simple inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // number inputs (to ensure numbers)
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        // allow empty or numeric
        if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // photos array change by index
    const handlePhotoChange = (index, value) => {
        setForm((prev) => {
            const photos = [...prev.photos];
            photos[index] = value;
            return { ...prev, photos };
        });
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
            console.error("Upload error:", error);
            return null;
        }
    };

    // Helper to handle local file selection
    const handleFileSelection = (index, file) => {
        const newFiles = [...selectedFiles];
        newFiles[index] = file;
        setSelectedFiles(newFiles);
    };



    // toggle collection checkbox (multiple)
    const toggleCollection = (value) => {
        setForm((prev) => {
            const exists = prev.collections.includes(value);
            const collections = exists
                ? prev.collections.filter((v) => v !== value)
                : [...prev.collections, value];
            return { ...prev, collections };
        });
    };

    // toggle categorie (multiple)
    const toggleCategorie = (value) => {
        setForm((prev) => {
            const exists = prev.categorie.includes(value);
            const categorie = exists ? prev.categorie.filter((v) => v !== value) : [...prev.categorie, value];
            return { ...prev, categorie };
        });
    };

    // toggle attribute (multiple)
    const toggleAttribute = (value) => {
        setForm((prev) => {
            const exists = prev.attribute.includes(value);
            const attribute = exists ? prev.attribute.filter((v) => v !== value) : [...prev.attribute, value];
            return { ...prev, attribute };
        });
    };

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");

            // --- NEW UPLOAD LOGIC START ---
            const uploadedUrls = [...form.photos]; // Start with existing manual URLs

            for (let i = 0; i < selectedFiles.length; i++) {
                if (selectedFiles[i]) {
                    const url = await uploadFileOnBunney(selectedFiles[i]);
                    if (url) {
                        uploadedUrls[i] = url; // Replace URL at index with the Bunny.net URL
                    }
                }
            }
            // --- NEW UPLOAD LOGIC END ---

            const payload = {
                ...form,
                photos: uploadedUrls.filter(url => url.trim() !== ""), // Only send non-empty URLs
                purchased: Number(form.purchased),
                selling: Number(form.selling),
                unit: Number(form.unit),
                attributes: form.attributes.map((attr) => ({
                    title: attr.title,
                    values: attr.values.map(v => ({
                        val: v.val,
                        price: Number(v.price)
                    }))
                })),
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/product`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message || "✅ Product created!");
            setSelectedFiles([null, null, null]); // Reset files
            // ... rest of your reset logic
        } catch (err) {
            toast.error("Upload or save failed");
        } finally {
            setLoading(false);
        }
    };;

    return (
        <div className="w-full min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* left: form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4">Create Product</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-5xl p-4">
                                {/* Title Field */}
                                <div className="space-y-2">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight">
                                        Product Title
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter a descriptive title..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 ease-in-out
                   placeholder:text-gray-400
                   hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>

                                {/* Tags Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="block text-[13px] font-bold text-gray-800 tracking-tight">
                                            Tags
                                        </label>
                                        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                            Comma separated
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            name="tags"
                                            value={form.tags}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g., Summer, Collection, Tech"
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 ease-in-out
                   placeholder:text-gray-400
                   hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                                {/* Purchased Price */}
                                <div className="space-y-2">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight">
                                        Purchased Price
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 text-sm font-medium">$</span>
                                        </div>
                                        <input
                                            name="purchased"
                                            value={form.purchased}
                                            onChange={handleNumberChange}
                                            type="text"
                                            placeholder="0.00"
                                            className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-3.5 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>

                                {/* Selling Price */}
                                <div className="space-y-2">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight">
                                        Selling Price
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 text-sm font-medium">$</span>
                                        </div>
                                        <input
                                            name="selling"
                                            value={form.selling}
                                            onChange={handleNumberChange}
                                            type="text"
                                            placeholder="0.00"
                                            className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-3.5 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>

                                {/* Unit Quantity */}
                                <div className="space-y-2">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight">
                                        Stock Unit
                                    </label>
                                    <div className="relative group">
                                        <input
                                            name="unit"
                                            value={form.unit}
                                            onChange={handleNumberChange}
                                            type="text"
                                            placeholder="Qty"
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">PCS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Overview */}
                            <div className="space-y-8 max-w-5xl">
                                {/* Text Content Group */}
                                <div className="space-y-6">
                                    {/* Overview */}
                                    <div className="space-y-2">
                                        <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                            Brief Overview
                                        </label>
                                        <textarea
                                            name="overview"
                                            value={form.overview}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="A short, catchy summary of the product..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none resize-none"
                                         />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                            Full Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Describe the features, materials, and benefits in detail..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm leading-relaxed text-gray-900 
                   shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                   transition-all duration-300 hover:border-gray-300
                   focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>

                                {/* Selectable Settings Group */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    {/* Brand Select */}
                                    <div className="space-y-2">
                                        <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                            Brand Identity
                                        </label>
                                        <div className="relative group">
                                            <select
                                                name="brand"
                                                value={form.brand}
                                                onChange={handleChange}
                                                className="appearance-none w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-700
                     shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                     transition-all duration-300 cursor-pointer hover:border-gray-300
                     focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                            >
                                                <option value="" className="text-gray-400">Select brand</option>
                                                {brands.map((b) => (
                                                    <option key={b._id} value={b._id}>{b.title}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"  />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tax Rule Select */}
                                    <div className="space-y-2">
                                        <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                            Tax Configuration
                                        </label>
                                        <div className="relative group">
                                            <select
                                                name="tax"
                                                value={form.tax}
                                                onChange={handleChange}
                                                className="appearance-none w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-700
                     shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)]
                     transition-all duration-300 cursor-pointer hover:border-gray-300
                     focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                            >
                                                <option value="" className="text-gray-400">Select tax rule</option>
                                                {taxes.map((tx) => (
                                                    <option key={tx._id} value={tx._id}>
                                                        {tx.title} ({tx.type === "percent" ? `${tx.number}%` : `$${tx.number}`})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"  />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-8 max-w-5xl">
                                {/* Collections - Interactive Chips */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                            Collections
                                        </label>
                                        <span className="text-[11px] font-medium text-gray-400 italic">Select all that apply</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {collectionsOpt.map((col) => {
                                            const isSelected = form.collections.includes(col._id);
                                            return (
                                                <label
                                                    key={col._id}
                                                    className={`
              group flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none
              ${isSelected
                                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}
            `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleCollection(col._id)}
                                                        className="hidden" // Hide native checkbox for a cleaner chip look
                                                     />
                                                    {isSelected && (
                                                        <svg className="w-3.5 h-3.5 animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"  />
                                                        </svg>
                                                    )}
                                                    <span className="text-sm font-semibold">{col.title}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Categories - Custom Popover Select */}
                                <div className="relative space-y-2">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                        Product Categories
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, showCategories: !prev.showCategories }))}
                                        className={`
        w-full flex justify-between items-center bg-white border rounded-2xl px-5 py-3.5 text-sm transition-all duration-300
        ${form.showCategories ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm" : "border-gray-200 hover:border-gray-300 shadow-sm"}
      `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={form.categorie.length ? "text-gray-900 font-semibold" : "text-gray-400"}>
                                                {form.categorie.length ? `${form.categorie.length} Categories Selected` : "Choose categories..."}
                                            </span>
                                        </div>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${form.showCategories ? "rotate-180 text-indigo-500" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"  />
                                        </svg>
                                    </button>

                                    {/* Dropdown menu */}
                                    {form.showCategories && (
                                        <div className="absolute z-30 mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                                {categories.map((c) => {
                                                    const isSelected = form.categorie.includes(c._id);
                                                    return (
                                                        <label
                                                            key={c._id}
                                                            className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer
                  ${isSelected
                                                                    ? "bg-indigo-50 border-indigo-200"
                                                                    : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"}
                `}
                                                        >
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleCategorie(c._id)}
                                                                    className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                                                 />
                                                            </div>
                                                            <span className={`text-sm ${isSelected ? "text-indigo-900 font-bold" : "text-gray-600 font-medium"}`}>
                                                                {c.title}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                                                <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                                                    {form.categorie.length} ITEMS SELECTED
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, showCategories: false }))}
                                                    className="text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl transition-colors shadow-md shadow-indigo-100 uppercase tracking-wider"
                                                >
                                                    Apply Selection
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Attributes */}
                            {/* Attributes Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-800 tracking-tight uppercase">
                                        Product Attributes & Stock
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                attributes: [...form.attributes, { title: "", values: [{ val: "", price: 0 }] }],
                                            })
                                        }
                                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        + Add New Attribute
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {form.attributes.map((attr, attrIndex) => (
                                        <div key={attrIndex} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Attribute Name (e.g. Size)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Color, Size, Material..."
                                                        value={attr.title}
                                                        onChange={(e) => {
                                                            const newAttrs = [...form.attributes];
                                                            newAttrs[attrIndex].title = e.target.value;
                                                            setForm({ ...form, attributes: newAttrs });
                                                        }}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                                     />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm({
                                                            ...form,
                                                            attributes: form.attributes.filter((_, i) => i !== attrIndex),
                                                        });
                                                    }}
                                                    className="mt-5 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"  />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-indigo-100">
                                                {attr.values.map((vObj, valIndex) => (
                                                    <div key={valIndex} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                        <input
                                                            placeholder="Value (XL)"
                                                            value={vObj.val}
                                                            onChange={(e) => {
                                                                const newAttrs = [...form.attributes];
                                                                newAttrs[attrIndex].values[valIndex].val = e.target.value;
                                                                setForm({ ...form, attributes: newAttrs });
                                                            }}
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                                                         />
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            value={vObj.quantity}
                                                            onChange={(e) => {
                                                                const newAttrs = [...form.attributes];
                                                                newAttrs[attrIndex].values[valIndex].quantity = Number(e.target.value);
                                                                setForm({ ...form, attributes: newAttrs });
                                                            }}
                                                            className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                                                         />
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newAttrs = [...form.attributes];
                                                        newAttrs[attrIndex].values.push({ val: "", price: 0 });
                                                        setForm({ ...form, attributes: newAttrs });
                                                    }}
                                                    className="text-[11px] font-bold text-indigo-500 hover:underline py-2 text-left"
                                                >
                                                    + Add another value
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>



                            <div className="space-y-10 max-w-5xl">
                                {/* Refundable & Warranty - Segmented Toggles */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { label: "Refundable Policy", name: "refundable", state: form.refundable },
                                        { label: "Warranty Service", name: "warrenty", state: form.warrenty }
                                    ].map((group) => (
                                        <div key={group.name} className="space-y-3">
                                            <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                                {group.label}
                                            </label>
                                            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl w-full sm:w-auto">
                                                {["yes", "no"].map((option) => (
                                                    <label
                                                        key={option}
                                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-[14px] text-sm font-bold transition-all cursor-pointer select-none
                                ${group.state === option
                                                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                                                                : "text-gray-500 hover:text-gray-700"}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={group.name}
                                                            value={option}
                                                            checked={group.state === option}
                                                            onChange={handleChange}
                                                            className="hidden"
                                                         />
                                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Photos Section */}
                                <div className="space-y-3">
                                    <label className="ml-1 block text-[13px] font-bold text-gray-800 tracking-tight uppercase">
                                        Product Gallery <span className="text-gray-400 lowercase font-normal ml-1">(Upload or Enter URL)</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {form.photos.map((p, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelection(i, e.target.files[0])}
                                                        className="hidden"
                                                        id={`file-upload-${i}`}
                                                     />
                                                    <label
                                                        htmlFor={`file-upload-${i}`}
                                                        className="flex items-center justify-center w-full h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all"
                                                    >
                                                        <span className="text-xs font-bold text-gray-500">
                                                            {selectedFiles[i] ? selectedFiles[i].name.slice(0, 15) : "Click to Upload"}
                                                        </span>
                                                    </label>
                                                </div>
                                                {/* Keep the text input as a fallback or for direct URLs */}
                                                <input
                                                    type="text"
                                                    placeholder="Or paste URL..."
                                                    value={p}
                                                    onChange={(e) => handlePhotoChange(i, e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                                                 />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SEO / Meta Section */}
                                <div className="pt-6 border-t border-gray-100 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-4 w-1 bg-indigo-500 rounded-full"></div>
                                        <h3 className="text-sm font-bold text-gray-900 tracking-tight uppercase">SEO Metadata</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="ml-1 block text-[12px] font-bold text-gray-500 uppercase">Meta Title</label>
                                            <input
                                                name="meta_title"
                                                value={form.meta_title}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Search engine title..."
                                                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                             />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="ml-1 block text-[12px] font-bold text-gray-500 uppercase">Meta Tags</label>
                                            <input
                                                name="meta_tags"
                                                value={form.meta_tags}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="keyword1, keyword2..."
                                                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                             />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-1 block text-[12px] font-bold text-gray-500 uppercase">Meta Description</label>
                                        <textarea
                                            name="meta_description"
                                            value={form.meta_description}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Brief summary for search results..."
                                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                                         />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition disabled:opacity-60"
                                >
                                    {loading ? "Saving..." : "Save Product"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({
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
                                            attributes: [{ title: "", values: [], raw: "" }],

                                        })
                                    }
                                    className="px-4 py-3 rounded-2xl border"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>

                        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
                    </div>

                    {/* right: preview / quick actions */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                            <h3 className="text-md font-semibold mb-2">Quick Preview</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-700"><strong>Title:</strong> {form.title || "—"}</p>
                                <p className="text-sm text-gray-700"><strong>Price:</strong> {form.selling ? `$${form.selling}` : "—"}</p>
                                <p className="text-sm text-gray-700"><strong>Brand:</strong> {brands.find(b => b._id === form.brand)?.title || "—"}</p>
                                <p className="text-sm text-gray-700"><strong>Collections:</strong> {form.collections.length ? form.collections.length : "—"}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                            <h3 className="text-md font-semibold mb-2">Image Previews</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {form.photos.filter(p => p.trim()).length === 0 && <div className="text-sm text-gray-400">No images yet</div>}
                                {form.photos.map((p, i) => p.trim() ? (
                                    <img key={i} src={p} alt={`preview-${i}`} width={48}
                                        height={48} className="w-full h-28 object-cover rounded-xl"  />
                                ) : null)}
                            </div>
                        </div>

                        {/* <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                            <h3 className="text-md font-semibold mb-2">Actions</h3>
                            <button
                                onClick={() => {
                                    // quick fill example
                                    setForm((prev) => ({ ...prev, title: "Sample Product", selling: "19.99", purchased: "10.00", unit: "1" }));
                                }}
                                className="w-full bg-indigo-600 text-white py-2 rounded-2xl"
                            >
                                Fill sample
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
