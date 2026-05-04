
import { motion } from "framer-motion";

const Logos = [
  { id: '1', src: "/versace.svg", alt: "Versace" },
  { id: '2', src: "/zara.svg", alt: "Zara" },
  { id: '3', src: "/gucci.svg", alt: "Gucci" },
  { id: '4', src: "/prada.svg", alt: "Prada" },
  { id: '5', src: "/Calvin.svg", alt: "Calvin Klein" },
];

const combinedLogos = [...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos,...Logos];

export default function Brands() {
  const animationDuration = 1000; 

  return (
    <section className="bg-black py-10 md:py-1 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-26 max-sm:h-10 flex items-center ">
          <motion.div
            className="flex flex-none gap-16"
            // Define the animation properties
            animate={{
              x: ["0%", "-100%"], // Scroll from 0% (start) to -100% (end of original list)
            }}
            // Define the transition properties for the infinite loop
            transition={{
              x: {
                repeat: Infinity, // Loop infinitely
                repeatType: "loop", // Ensure it restarts smoothly
                duration: animationDuration, // Time taken for one loop
                ease: "linear", // Constant speed
              },
            }}
          >
            {/* Map over the combined list of logos */}
            {combinedLogos.map((logo, index) => (
              <img
                // Use a combination of id and index for a unique key in the duplicated list
                key={`${logo.id}-${index}`} 
                src={logo.src}
                alt={logo.alt}
                width={144}
                height={80}
                className="w-20 h-10 sm:w-28 sm:h-14 md:w-36 md:h-20 object-contain flex-shrink-0"
               />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}