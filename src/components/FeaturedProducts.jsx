import React from "react";
import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

async function fetchProducts() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default function FeaturedProducts() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"  />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-center text-red-400 text-sm">
        Unable to load products
      </p>
    );
  }

  const displayProducts = products.slice(0, 5);

  return (
    <section className="py-12 px-4 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl font-bold tracking-widest uppercase text-gray-900"
        >
          Feature Product
        </motion.h2>
        <Link
          to="/product"
          className="text-sm font-semibold text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
        >
          More
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {displayProducts.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link to={`/ProductDetails/${product._id}`}>
              <Card
                image={product.photos[0]}
                title={product.title}
                rating={4}
                price={product.selling}
               />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
