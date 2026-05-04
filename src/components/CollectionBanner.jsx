import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * CollectionBanner — Full-width editorial split banner.
 *
 * Props:
 *   title      — e.g. "MEN'S COLLECTION"
 *   subtitle   — optional tagline
 *   imageUrl   — URL or path of tall portrait image
 *   imageAlign — "left" | "right" (which side the image sits)
 *   bgColor    — tailwind bg class e.g. "bg-[#E8E0D5]"
 *   href       — link for "Shop Now" button
 */
export default function CollectionBanner({
  title,
  subtitle,
  imageUrl,
  imageAlign = "right",
  bgColor = "bg-[#E8E0D5]",
  href = "/product",
}) {
  const isImageRight = imageAlign === "right";

  return (
    <section className={`w-full ${bgColor} overflow-hidden`}>
      <div
        className={`max-w-[1440px] mx-auto flex flex-col ${isImageRight ? "md:flex-row" : "md:flex-row-reverse"
          } items-stretch min-h-[400px] md:min-h-[520px]`}
      >
        {/* Text Side */}
        <motion.div
          className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0"
          initial={{ opacity: 0, x: isImageRight ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {subtitle && (
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-3">
              {subtitle}
            </p>
          )}
          <h2
            className="font-extrabold text-gray-900 leading-tight"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)" }}
          >
            {title}
          </h2>
          <div className="w-12 h-1 bg-gray-900 mt-4 mb-6"  />
          <Link
            to={href}
            className="inline-block bg-black text-white text-sm font-semibold px-8 py-3 rounded-full w-fit hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-md"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Image Side */}
        <motion.div
          className="flex-1 relative min-h-[300px] md:min-h-[520px]"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <img
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={title.includes("ABAYA")} // Optional: Prioritize the first banner
           />
        </motion.div>
      </div>
    </section>
  );
}
