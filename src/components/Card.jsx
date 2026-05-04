import { motion, AnimatePresence } from "framer-motion";

export default function Card({ image, title, price, hoverImage, category = "Collection" }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col w-full group cursor-pointer bg-white"
    >
      {/* Image Container: High-Fashion Portrait Ratio */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F5F5F3]">
        
        {/* Subtle Brand Watermark (Optional luxury touch) */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-light italic">
            {category}
          </span>
        </div>

        {/* Primary Image */}
        <img
          src={image || "/placeholder.png"}
          alt={title}
          fill
          className={`object-cover transition-transform duration-[2s] cubic-bezier(0.2, 0, 0, 1) group-hover:scale-110 ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
          priority
         />

        {/* Secondary Image: Slow Cross-Fade */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${title} detail`}
            fill
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-[1.5s] ease-in-out scale-105 group-hover:scale-100"
           />
        )}

        {/* Luxury "Shop" Indicator: Appears as a soft glow/blur */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-stone-900/5 backdrop-blur-[2px]">
          <div className="px-6 py-3 border border-white/40 bg-white/10 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white font-light">
              Discover
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="pt-8 pb-4 flex flex-col items-center text-center px-2">
        
        {/* Title: Using a serif stack for that "Vogue" feel */}
        <h3 className="text-sm md:text-base font-serif italic text-stone-800 tracking-wide mb-2 transition-colors duration-500 group-hover:text-stone-500">
          {title}
        </h3>

        {/* Price & Interaction Container */}
        <div className="relative h-5 w-full flex flex-col items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              className="flex flex-col items-center"
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Static Price State */}
              <span className="text-[12px] font-light tracking-[0.2em] text-stone-400 group-hover:-translate-y-10 transition-transform duration-700">
                — ${Number(price).toLocaleString()} —
              </span>

              {/* Hover Action State */}
              <span className="absolute text-[9px] uppercase tracking-[0.4em] text-stone-900 font-medium translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                View Selection
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}