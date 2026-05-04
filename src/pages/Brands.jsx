import React, { useEffect, useState } from 'react';
import PromoBanner from '../components/topBar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function Page() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/brand`)
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Sections */}
      <PromoBanner  />
      <Navbar  />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our <span className="text-blue-600">Brands</span>
        </h1>

        {/* Brand Grid */}
        {brands.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Loading brands...
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((brand, index) => (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={brand.photoUrl}
                    alt={brand.title}
                    width={48}
                        height={48}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                   />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 capitalize group-hover:text-blue-600 transition-colors duration-300">
                    {brand.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(brand.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
