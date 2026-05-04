import React from "react";
import {
    MapPin,
    Phone,
    Mail,
    History,
    Sparkles,
    Instagram,
    Facebook,
    Smartphone,
    ExternalLink,
    Heart
} from "lucide-react";
import Navbar from "../components/Navbar";
import PromoBanner from "../components/topBar";
import Footer from "../components/Footer";

export default function page() {
    const showrooms = [
        {
            city: "Dhaka Showroom",
            location: "Dhanmondi Outlet",
            details: "Shop 1029 (1st Floor) & Shop 0027 (Ground Floor)",
            complex: "Shimanto Shomver Shopping Complex",
            area: "Dhanmondi 2, Dhaka",
            contact: "01733507124"
        },
        {
            city: "Cumilla Showroom",
            location: "Planet SR",
            details: "Shop F04 (1st Floor)",
            complex: "Opposite of Cumilla Zilla School",
            area: "Kandirpar, Cumilla",
            contact: "01733-507124"
        }
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/InStylebyShifa1", handle: "@InStylebyShifa1" },
        { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/instylebyshifa", handle: "@instylebyshifa" },
        { name: "TikTok", icon: Smartphone, url: "https://www.tiktok.com/@instylebyshifa", handle: "@instylebyshifa" }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-sans w-full">

            <PromoBanner  />
            <Navbar  />

            {/* HERO SECTION - Storytelling Header */}
            <section className="relative w-full py-20 md:py-32 px-6 lg:px-10 bg-[#fafafa] overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <span className="px-6 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
                            Since 2011
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9]">
                            InStylebyShifa
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl italic">
                            "Where Style Meets Storytelling"
                        </p>
                    </div>
                </div>
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                    <Sparkles size={400}  />
                </div>
            </section>

            {/* CORE PHILOSOPHY - Grid Layout */}
            <section className="w-full py-20 px-6 lg:px-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Crafted with Soul</h2>
                            <p className="text-gray-500 leading-relaxed text-lg">
                                At InStylebyShifa, we believe that clothing is more than just fabric—it's a narrative. Since 2011, we have specialized in designer Borka, Abaya, Kaftan, and Hijab collections that reflect heritage, elegance, and bold individuality.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <History className="mb-4 text-black" size={28}  />
                                <h4 className="font-bold text-lg">Our Heritage</h4>
                                <p className="text-sm text-gray-500 mt-2">Over a decade of excellence in modest fashion and jewelry.</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <Heart className="mb-4 text-black" size={28}  />
                                <h4 className="font-bold text-lg">Handcrafted</h4>
                                <p className="text-sm text-gray-500 mt-2">Timeless beauty designed with attention to every soul-crafted detail.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 group">
                        {/* Main Brand Image */}
                        <img
                            src="/instylelogo.png" // Fixed path: removes "/public"
                            alt="InStylebyShifa Timeless Fashion"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority
                         />

                        {/* Elegant Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"  />

                        {/* Floating "Since 2011" Badge */}
                        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Established</p>
                            <p className="text-xl font-bold text-black flex items-center gap-2">
                                <Sparkles size={18} className="text-black"  />
                                2011
                            </p>
                        </div>

                        {/* Decorative "Heritage" Label */}
                        <div className="absolute top-8 right-[-30px] rotate-90 bg-black text-white px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">
                            Heritage Collection
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOWROOMS SECTION - Professional Table Style */}
            <section className="w-full py-20 px-6 lg:px-10 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold">Visit Our Outlets</h2>
                        <p className="text-gray-400 mt-2">Experience our collections in person at our luxury showrooms.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {showrooms.map((shop, idx) => (
                            <div key={idx} className="bg-[#1a1a1a] border border-gray-800 p-8 md:p-10 rounded-[2.5rem] hover:border-gray-600 transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <MapPin size={24}  />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{shop.city}</h3>
                                        <p className="text-gray-500 font-medium">{shop.location}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-gray-400">
                                    <p className="leading-relaxed">
                                        <span className="block text-white font-bold mb-1">Address:</span>
                                        {shop.details}<br  />
                                        {shop.complex}<br  />
                                        {shop.area}
                                    </p>
                                    <div className="flex items-center gap-3 text-white font-bold">
                                        <Phone size={18} className="text-gray-500"  />
                                        {shop.contact}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONNECT SECTION - Social Grid */}
            <section className="w-full py-20 px-6 lg:px-10 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Stay Connected</h2>
                    <p className="text-gray-500 mt-2">Follow us for exclusive drops and styling tips.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {socialLinks.map((social, idx) => {
                        const Icon = social.icon;
                        return (
                            <a
                                href={social.url}
                                key={idx}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-8 bg-[#fafafa] border border-gray-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-black shadow-sm">
                                        <Icon size={24}  />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{social.name}</p>
                                        <p className="font-bold">{social.handle}</p>
                                    </div>
                                </div>
                                <ExternalLink size={20} className="text-gray-300 group-hover:text-black transition-colors"  />
                            </a>
                        );
                    })}
                </div>

                {/* FOOTER CONTACT BAR */}
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <Mail size={16}  />
                            instylebyshifabd@gmail.com
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <Smartphone size={16}  />
                            +880 1733-507124
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                        © 2026 InStylebyShifa. All Rights Reserved.
                    </p>
                </div>
            </section>
            <Footer  />
        </div>
    );
}