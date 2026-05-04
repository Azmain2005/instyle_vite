"use client";
import { RefreshCw, Tag, CircleDollarSign, ArrowUpDown, Check, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function AppSidebar({ storedProducts = [], onFilterApply }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 99000]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/brand`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  const maxProductPrice = useMemo(() => {
    if (!storedProducts || storedProducts.length === 0) return 99000;
    return Math.max(...storedProducts.map((p) => p.selling || 0)) + 100;
  }, [storedProducts]);

  useEffect(() => {
    if (maxProductPrice > 0) {
      setPriceRange([0, maxProductPrice]);
    }
  }, [maxProductPrice]);

  const handleApply = () => {
    onFilterApply({
      brand: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortOrder
    });
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSortOrder("");
    setPriceRange([0, maxProductPrice]);
    onFilterApply({ brand: "", minPrice: 0, maxPrice: 99000, sort: "" });
  };

  return (
    <Sidebar className="border-r border-stone-100">
      <SidebarContent className="bg-white">
        {/* Added top padding to ensure content starts below your Navbar/TopBar */}
        <div className="pt-16 md:pt-2"> 
          <SidebarGroup>
            {/* Minimalist Header */}
            <div className="flex justify-between items-center px-6 mb-10">
              <div>
                <h2 className="text-2xl font-serif italic text-stone-900 tracking-tight">Filters</h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mt-1">Refine your selection</p>
              </div>
              <button
                onClick={handleReset}
                className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
              >
                Reset <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* Sort Section */}
            <div className="px-6 mb-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-5 flex items-center gap-2">
                <ArrowUpDown size={14} className="text-stone-400" /> Sort Order
              </p>
              <div className="space-y-2">
                {[
                  { id: "low-high", label: "Price: Low to High" },
                  { id: "high-low", label: "Price: High to Low" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortOrder(sortOrder === opt.id ? "" : opt.id)}
                    className={`w-full text-left text-xs px-4 py-3 rounded-lg border transition-all duration-300 flex justify-between items-center ${
                      sortOrder === opt.id 
                        ? "bg-stone-900 text-white border-stone-900" 
                        : "bg-white text-stone-600 border-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {opt.label}
                    {sortOrder === opt.id && <Check size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Section */}
            <div className="px-6 mb-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-5 flex items-center gap-2">
                <Tag size={14} className="text-stone-400" /> Brand
              </p>
              <div className="space-y-1 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md transition-all ${
                    selectedBrand === "" ? "bg-stone-50 font-bold text-black border-l-2 border-stone-900" : "text-stone-400 hover:text-stone-900"
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setSelectedBrand(b._id)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-md transition-all flex justify-between items-center ${
                      selectedBrand === b._id ? "bg-stone-50 font-bold text-black border-l-2 border-stone-900" : "text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    {b.title}
                    {selectedBrand === b._id && <span className="w-1 h-1 bg-stone-900 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="px-6 mb-20">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-5 flex items-center gap-2">
                <CircleDollarSign size={14} className="text-stone-400" /> Price Range
              </p>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  max={maxProductPrice}
                  step={10}
                  onValueChange={setPriceRange}
                  className="my-8"
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center py-2 border border-stone-100 rounded-lg">
                    <span className="text-[9px] uppercase text-stone-400 block mb-0.5">Min</span>
                    <span className="text-xs font-bold text-stone-900">{priceRange[0]} TK</span>
                  </div>
                  <div className="w-2 h-[1px] bg-stone-200" />
                  <div className="flex-1 text-center py-2 border border-stone-100 rounded-lg">
                    <span className="text-[9px] uppercase text-stone-400 block mb-0.5">Max</span>
                    <span className="text-xs font-bold text-stone-900">{priceRange[1]} TK</span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroup>
        </div>

        {/* Floating Action Footer */}
        <div className="px-6 py-8 mt-auto border-t border-stone-50 bg-white/80 backdrop-blur-md sticky bottom-0">
          <button
            onClick={handleApply}
            className="w-full bg-stone-900 text-white py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-stone-800 transition-all active:scale-[0.98] shadow-2xl shadow-stone-200"
          >
            Apply Changes
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}