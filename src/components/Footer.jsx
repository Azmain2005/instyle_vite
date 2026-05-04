
import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa"; // Using FaTiktok as Fi doesn't have it

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-24 pb-12 px-6 md:px-12 lg:px-20 border-t border-stone-100">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Identity & Story */}
        <div className="lg:col-span-1">
          <Link to="/" className="group">
            <h1 className="text-2xl font-serif tracking-tighter text-stone-900 uppercase mb-6">
              InStyle<span className="font-light italic text-stone-400">by</span>Shifa
            </h1>
          </Link>
          <p className="text-stone-500 text-[13px] leading-relaxed font-light mb-8 italic">
            "Where Style Meets Storytelling." Since 2011, crafting Designer Clothing & Jewelry with soul. 
            Each piece reflects heritage, elegance, and bold individuality.
          </p>
          <div className="flex gap-5 text-stone-400">
            <a href="https://www.facebook.com/InStylebyShifa1" target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><FiFacebook size={20} /></a>
            <a href="https://www.instagram.com/instylebyshifa" target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><FiInstagram size={20} /></a>
            <a href="https://www.tiktok.com/@instylebyshifa" target="_blank" rel="noreferrer" className="hover:text-black transition-colors"><FaTiktok size={18} /></a>
          </div>
        </div>

        {/* Quick Links - Derived from your Navbar */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">The House</h4>
          <ul className="flex flex-col gap-4 text-[13px] text-stone-500 font-light">
            <li><Link to="/about" className="hover:text-black transition-colors">Our Story</Link></li>
            <li><Link to="/product" className="hover:text-black transition-colors">Collections</Link></li>
            <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
            <li><Link to="/product" className="hover:text-black transition-colors">Exclusive Drops</Link></li>
          </ul>
        </div>

        {/* Showroom Locations */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">Our Showrooms</h4>
          <ul className="flex flex-col gap-6 text-[12px] text-stone-500 font-light">
            <li className="flex gap-3">
              <FiMapPin className="mt-1 text-stone-400 shrink-0" size={16} />
              <div>
                <span className="font-bold text-stone-900 block mb-1">Dhaka (Dhanmondi)</span>
                Shop 1029 (1st Floor) & 0027 (GF), <br />
                Shimanto Shomver Shopping Complex
              </div>
            </li>
            <li className="flex gap-3">
              <FiMapPin className="mt-1 text-stone-400 shrink-0" size={16} />
              <div>
                <span className="font-bold text-stone-900 block mb-1">Cumilla (Kandirpar)</span>
                Shop F04 (1st Floor), Planet SR <br />
                Opposite of Cumilla Zilla School
              </div>
            </li>
          </ul>
        </div>

        {/* Direct Contact */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">Concierge</h4>
          <ul className="flex flex-col gap-5 text-[13px] text-stone-500 font-light">
            <li className="flex items-center gap-3">
              <FiMail className="text-stone-400" size={16} />
              <a href="mailto:instylebyshifabd@gmail.com" className="hover:text-black transition-colors">instylebyshifabd@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="text-stone-400" size={16} />
              <div className="flex flex-col">
                <a href="tel:+8801733507124" className="hover:text-black transition-colors">+880 1733-507124</a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
          © {currentYear} InStylebyShifa. Crafted with soul.
        </p>
        
        {/* Payment Methods / Extras */}
        <div className="flex gap-8 text-[10px] tracking-[0.2em] text-stone-400 uppercase">
           <Link to="#" className="hover:text-black transition-colors">Shipping</Link>
           <Link to="#" className="hover:text-black transition-colors">Privacy</Link>
           <Link to="#" className="hover:text-black transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}