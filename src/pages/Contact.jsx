import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Facebook, 
  Instagram, 
  Smartphone,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Star
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Footer from "../components/Footer";
import PromoBanner from "../components/topBar";
import Navbar from "../components/Navbar";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const reviewData = {
            // Since your schema requires 'product', we'll send a general 
            // string or ID if this is a general site review.
            product: "General Website Review",
            rating: Number(formData.get("rating")),
            comment: formData.get("comment"),
            // If you want to include the user's name, you can add it to 
            // the comment or extend your schema later.
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData),
            });

            if (res.ok) {
                setSubmitted(true);
                // Reset form after success
                e.target.reset();
            } else {
                const errorData = await res.json();
                alert("Error: " + errorData.error);
            }
        } catch (err) {
            console.error("Connection failed:", err);
            alert("Server is currently unreachable.");
        } finally {
            setLoading(false);
        }
    };

    const showrooms = [
        {
            name: "Dhaka Showroom",
            location: "Dhanmondi Outlet",
            address: "Shop 1029 (1st floor) & Shop 0027 (Ground floor), Shimanto Shomver Shopping Complex (Previous BDR Rifles Square), Dhanmondi 2.",
            phone: "01733-507124 / 01749-500000",
        },
        {
            name: "Cumilla Showroom",
            location: "Planet SR",
            address: "Shop no F04 (1st floor), Opposite of Cumilla Zilla School, Kandirpar, Cumilla.",
            phone: "01733-507124",
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">

            <PromoBanner  />
            <Navbar  />

            {/* Header Section */}
            <section className="py-20 px-6 lg:px-10 bg-[#fafafa] border-b border-gray-100">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="px-5 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                        Get In Touch
                    </span>
                    <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tighter text-gray-900">
                        Contact the Atelier
                    </h1>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        Have questions about our collections or need assistance with an order? Our concierge team is here to help.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 lg:px-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold tracking-tight">Send us a Message</h2>
                                <p className="text-gray-400 text-sm mt-2">We typically respond within 24 hours.</p>
                            </div>

                            {submitted ? (
                                <div className="py-12 text-center animate-in fade-in zoom-in-95">
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40}  />
                                    </div>
                                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                                    <p className="text-gray-500 mt-2">Thank you for reaching out to InStylebyShifa.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Interactive Star Rating */}
                                    <div className="space-y-4 text-center pb-4 border-b border-gray-50">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Overall Experience
                                        </label>
                                        <div className="flex items-center justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                    className="transition-all duration-200 transform hover:scale-125"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={`transition-colors duration-200 ${star <= (hover || rating)
                                                                ? "fill-black text-black"
                                                                : "text-gray-200"
                                                            }`}
                                                     />
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                                            {rating === 5 && "Exquisite"}
                                            {rating === 4 && "Great Quality"}
                                            {rating === 3 && "Good"}
                                            {rating === 2 && "Fair"}
                                            {rating === 1 && "Poor"}
                                        </p>
                                        {/* Hidden input to keep your FormData logic working */}
                                        <input type="hidden" name="rating" value={rating}  />
                                    </div>

                                    {/* Elegant Textarea */}
                                    <div className="space-y-3 group">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-black">
                                            Your Thoughts
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="comment"
                                                required
                                                rows={5}
                                                placeholder="Describe your journey with InStylebyShifa..."
                                                className="w-full bg-[#f9f9f9] border-2 border-transparent p-6 rounded-[2rem] focus:bg-white focus:border-black outline-none transition-all resize-none text-gray-700 leading-relaxed placeholder:text-gray-300"
                                            ></textarea>
                                            <div className="absolute bottom-6 right-6 opacity-10">
                                                <Sparkles size={40}  />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Luxury Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full bg-black text-white py-6 rounded-[2rem] font-bold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-black/20 active:scale-[0.98]"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-4">
                                            {loading ? (
                                                <span className="animate-pulse">Archiving Review...</span>
                                            ) : (
                                                <>
                                                    <span className="tracking-tight">Submit to the Atelier</span>
                                                    <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"  />
                                                < />
                                            )}
                                        </div>
                                        {/* Subtle shine effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"  />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info & Showrooms */}
                    <div className="lg:col-span-5 space-y-10">

                        {/* Direct Contact Info */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Direct Contact</h3>
                            <div className="space-y-4">
                                <a href="mailto:instylebyshifabd@gmail.com" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <Mail size={20}  />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Email Us</p>
                                        <p className="font-bold">instylebyshifabd@gmail.com</p>
                                    </div>
                                </a>
                                <a href="tel:+8801733507124" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <Phone size={20}  />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Call/WhatsApp</p>
                                        <p className="font-bold">+880 1733-507124</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Showroom Cards */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Visit Our Showrooms</h3>
                            {showrooms.map((room, idx) => (
                                <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:border-black transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all">
                                            <MapPin size={18}  />
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-50">Active Outlet</span>
                                    </div>
                                    <h4 className="font-bold text-lg">{room.name}</h4>
                                    <p className="text-indigo-600 text-xs font-bold mb-3">{room.location}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{room.address}</p>
                                    <div className="text-xs font-bold flex items-center gap-2">
                                        <Smartphone size={14} className="text-gray-400"  />
                                        {room.phone}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Connection */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Join our community</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, url: "https://www.facebook.com/InStylebyShifa1" },
                                    { icon: Instagram, url: "https://www.instagram.com/instylebyshifa" },
                                    { icon: FaTiktok, url: "https://www.tiktok.com/@instylebyshifa" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
                                    >
                                        <social.icon size={20}  />
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Embedded Map / Hours (Optional Placeholder) */}
            <section className="py-20 px-6 lg:px-10 bg-black text-white rounded-[3rem] mx-6 mb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Standard Operating Hours</h2>
                        <p className="text-gray-400">Our physical outlets and customer service follow these timings.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                        <div className="flex gap-3">
                            <Clock className="text-gray-500"  />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Saturday - Thursday</p>
                                <p className="font-bold">10:00 AM - 9:00 PM</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Clock className="text-gray-500"  />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Friday</p>
                                <p className="font-bold">3:00 PM - 9:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer  />
        </div>
    );
}