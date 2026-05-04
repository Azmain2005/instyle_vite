import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Consider naming this 'hero-banner' or 'modest-collection' for clarity
import festiveImg from "../../public/woman-religious-pilgrimage-church.jpg";

export default function LuxuryHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a]">
      {/* Container with dynamic heights for Mobile vs Desktop */}
      <div className="relative w-full h-[60vh] min-h-[500px] lg:h-[85vh] max-h-[900px]">
        
        {/* Background Image with a professional Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={festiveImg}
            alt="Modesta Luxury Collection"
            fill
            priority
            className="object-cover object-top lg:object-center brightness-[0.85]"
           />
          {/* Elegant Gradient Overlay: Darker on bottom and left for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent"  />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 container mx-auto h-full px-6 flex flex-col items-center lg:items-start justify-end lg:justify-center pb-12 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-center lg:text-left"
          >
            {/* Minimalist Subheading */}
            <span className="block mb-4 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-[#D4AF37]">
              The Art of Modesty
            </span>

            {/* Main Luxury Title */}
            <h1 className="font-serif italic leading-[1.1] text-white text-5xl md:text-7xl lg:text-8xl mb-6">
              Elegance <br  /> 
              <span className="not-italic font-light">Redefined.</span>
            </h1>
            
            <p className="max-w-md mx-auto lg:mx-0 mb-10 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed font-light tracking-wide">
              Discover our curated collection of artisanal Abayas and Kaftans, 
              designed for the modern woman who values tradition and sophistication.
            </p>

            {/* Premium Button Set */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center">
              <Link
                to="/product"
                className="group relative overflow-hidden bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:text-white"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 z-0 bg-[#D4AF37] translate-y-full transition-transform duration-500 group-hover:translate-y-0"  />
              </Link>

              <Link
                to="/about"
                className="text-white text-xs font-bold uppercase tracking-[0.2em] border-b border-white/30 pb-1 hover:border-[#D4AF37] transition-colors duration-300"
              >
                The Atelier
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Subtle Bottom Accent (Scroll Indicator Style) */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
           <p className="text-white/30 text-[10px] rotate-90 origin-right tracking-[0.3em] uppercase">
             Est. 2024 — Modesta
           </p>
        </div>
      </div>
    </section>
  );
}