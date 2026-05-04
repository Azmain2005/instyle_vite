import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import axios from "axios";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [bannerText, setBannerText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/promobanner`);
        // If a banner exists, use its text. Otherwise, hide the component.
        if (res.data && res.data.length > 0) {
          setBannerText(res.data[0].text);
        } else {
          setVisible(false);
        }
      } catch (err) {
        console.error("Error loading promo banner:", err);
        setVisible(false); // Hide on error
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // Don't render if closed, if loading, or if no text exists
  if (!visible || loading || !bannerText) return null;

  return (
    <div className="w-full bg-black text-white text-sm px-4 py-[14px] animate-in fade-in slide-in-from-top duration-500">
      <div className="container mx-auto flex items-center justify-center relative">
        {/* Centered Text - Now Dynamic */}
        <p className="text-center w-full text-[13px] tracking-wide pr-8">
          ✨ {bannerText}{" "}
          <Link to="/product" className="underline font-semibold hover:text-gray-300 transition-colors ml-1">
            Shop Now
          </Link>
        </p>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 hover:text-gray-400 transition-colors p-1"
          aria-label="Close banner"
        >
          <FiX className="text-lg"  />
        </button>
      </div>
    </div>
  );
}