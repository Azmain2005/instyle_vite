import { motion } from "framer-motion";
import posterOne from "../../public/posterOne.svg";
import posterTwo from "../../public/posterTwo.svg";
import posterThree from "../../public/posterThree.svg";
import posterFour from "../../public/posterFour.svg";

export default function Category() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.2 }}
      className="bg-[#F0F0F0] my-10 mx-3 lg:mx-20 sm:my-20 rounded-4xl px-4 sm:px-8 py-10 shadow-lg"
    >
      {/* Title */}
      <motion.div
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-center"
      >
        <p className="font-extrabold text-2xl sm:text-4xl lg:text-5xl text-center tracking-tight">
          BROWSE BY DRESS STYLE
        </p>
      </motion.div>

      {/* Grid */}
      <div className="mt-8 sm:mt-12 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Item 1 */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative col-span-2 group overflow-hidden rounded-2xl"
        >
          <img
            src={posterOne}
            alt="Casual"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
           />
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent opacity-80"  />
          <p className="absolute top-4 left-4 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
            Casual
          </p>
        </motion.div>

        {/* Item 2 */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative col-span-2 sm:col-span-2 lg:col-span-4 group overflow-hidden rounded-2xl"
        >
          <img
            src={posterTwo}
            alt="Formal"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
           />
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent opacity-80"  />
          <p className="absolute top-4 left-4 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
            Formal
          </p>
        </motion.div>

        {/* Item 3 */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative col-span-2 sm:col-span-2 lg:col-span-4 group overflow-hidden rounded-2xl"
        >
          <img
            src={posterThree}
            alt="Party"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
           />
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent opacity-80"  />
          <p className="absolute top-4 left-4 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
            Party
          </p>
        </motion.div>

        {/* Item 4 */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative col-span-2 sm:col-span-2 lg:col-span-2 group overflow-hidden rounded-2xl"
        >
          <img
            src={posterFour}
            alt="Gym"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
           />
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent opacity-80"  />
          <p className="absolute top-4 left-4 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl drop-shadow-md">
            Gym
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
