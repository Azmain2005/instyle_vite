import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from 'react-router-dom';
import FeaturedProduct from '@/components/TopSellings';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/topBar';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Page() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentPrice, setCurrentPrice] = useState(0);
  const [mainImage, setMainImage] = useState(null);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    },
  });

  useEffect(() => {
    if (product) {
      const img = (product.photos?.length > 0 && product.photos[0] !== "")
        ? product.photos[0]
        : product.image;
      setMainImage(img);
      setCurrentPrice(product.selling || product.purchased);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (product.attributes?.length > 0) {
      const selectedCount = Object.keys(selectedAttributes).length;
      if (selectedCount < product.attributes.length) {
        return toast.error("Please select all bespoke options.");
      }
    }

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return toast.error("Cart not initialized.");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,
          count: quantity,
          attributes: selectedAttributes,
          price: currentPrice,
        }),
      });

      if (res.ok) {
        toast.success("Added to your collection 🛒");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      toast.error("Network error.");
    }
  };

  if (productLoading) return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-10 h-10 border-[1px] border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-stone-400">Opening Atelier</p>
    </div>
  );

  if (productError || !product) return <p className="p-20 text-center font-serif italic text-stone-500">Creation not found.</p>;

  const hasPhotos = product.photos && product.photos.length > 0 && product.photos[0] !== "";

  return (
    <div className="bg-white min-h-screen font-sans text-stone-900">
      <PromoBanner  />
      <Navbar  />

      <div className="max-w-[1440px] mx-auto p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* --- LEFT: Boutique Gallery --- */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {hasPhotos && (
              <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:min-w-[110px]">
                {product.photos.filter(img => img !== "").map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setMainImage(img)}
                    className={`relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0 rounded-sm overflow-hidden transition-all duration-300 ${mainImage === img ? "ring-1 ring-stone-900 ring-offset-2" : "opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="Gallery" fill className="object-cover" unoptimized  />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative aspect-[3/4] rounded-sm overflow-hidden bg-stone-50 group border border-stone-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <img
                    src={mainImage || product.image || "/placeholder.png"}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                   />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* --- RIGHT: Artisanal Details --- */}
          <div className="lg:col-span-5 flex flex-col">
            <nav className="mb-6 text-[10px] uppercase tracking-[0.2em] text-stone-400">
              <Link to="/" className="hover:text-stone-900">Home</Link> / 
              <span className="text-stone-900 ml-2 italic">Creation Details</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl font-light text-stone-900">${currentPrice}</span>
              {product.selling && currentPrice === (product.selling) && (
                <span className="text-lg text-stone-300 line-through font-light tracking-wider ml-4">
                  ${Math.round(product.selling * 1.15)}
                </span>
              )}
            </div>

            <div className="space-y-6 border-t border-stone-100 pt-8 mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">The Essence</span>
                <p className="text-stone-500 text-sm leading-relaxed font-light italic">
                  {product.overview || "A masterfully crafted piece designed for the modern woman who values tradition and elegance."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                <p>Policy: <span className="text-stone-800 ml-1">{product.refundable || "Bespoke"}</span></p>
                <p>Warranty: <span className="text-stone-800 ml-1">{product.warrenty || "Atelier Standard"}</span></p>
              </div>
            </div>

            {/* Attributes Selection */}
            {product.attributes?.length > 0 && product.attributes.map((attr) => (
              <div key={attr._id || attr.title} className="mb-8">
                <p className="text-[11px] font-bold text-stone-900 uppercase tracking-[0.2em] mb-4">
                  Select {attr.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.values?.map((vObj, idx) => {
                    const isSelected = selectedAttributes[attr.title] === vObj.val;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedAttributes(prev => ({ ...prev, [attr.title]: vObj.val }));
                          setCurrentPrice(vObj.price);
                        }}
                        className={`px-5 py-3 text-[11px] tracking-widest font-bold transition-all border
                        ${isSelected ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200 hover:border-stone-900"}`}
                      >
                        {/* SAFE RENDER: Checks if val exists before running toUpperCase */}
                        {vObj?.val ? String(vObj.val).toUpperCase() : "N/A"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CTA Section */}
            <div className="flex gap-4 mt-4 pt-8 border-t border-stone-100">
              <div className="flex items-center border border-stone-200 rounded-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-5 py-4 hover:bg-stone-50 transition-colors">-</button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-5 py-4 hover:bg-stone-50 transition-colors">+</button>
              </div>
              <button 
                onClick={handleAddToCart} 
                className="flex-1 bg-stone-900 text-white text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-all rounded-sm"
              >
                Acquire Piece
              </button>
            </div>
          </div>
        </div>

        {/* --- ATELIER DETAILS --- */}
        <div className="mt-32 max-w-4xl border-t border-stone-100 pt-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-4 block">Atelier Details</span>
          <h2 className="text-3xl font-serif mb-8 italic">Craftsmanship & Composition</h2>
          <div className="text-stone-600 leading-loose font-light text-base whitespace-pre-line">
            {product.description || "Every stitch is placed with intention, ensuring a silhouette that honors both modesty and modern luxury."}
          </div>
        </div>
      </div>
      
      <div className="bg-stone-50 py-20 mt-20">
        <FeaturedProduct  />
      </div>
      <Footer  />
    </div>
  );
}