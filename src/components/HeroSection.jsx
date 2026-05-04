import React from 'react';
import heroImg from '../../public/HeroImg.jpg';

export default function HeroSection() {
  return (
    <div className=' bg-[#F2F0F1]'>
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[900px] max-sm:h-[1250px] overflow-hidden ">
        
        {/* LEFT SIDE: Text */}
        <div className=" p-6 lg:p-10">
          <p className="text-[70px] font-extrabold p-4 lg:p-10 max-sm:text-[40px] max-sm:pt-5 max-sm:pl-2">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </p>
          <p className="px-4 lg:px-10 max-sm:pl-2 max-sm:text-[13px] text-neutral-500 text-[24px]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button className="bg-black text-white text-[16px] lg:px-20 lg:ml-10 p-4 rounded-4xl mt-10 max-md:w-full">
            shop now
          </button>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 lg:px-10 mt-10">
            <div className="p-6 text-center border-r border-gray-300">
              <p className="font-bold text-[40px] ">200+</p>
              <p className="text-base text-neutral-500">International Brands</p>
            </div>

            <div className="p-6 text-center md:border-r border-gray-300">
              <p className="font-bold text-[40px] ">2,000+</p>
              <p className="text-base text-neutral-500">High-Quality Products</p>
            </div>

            <div className="p-6 text-center col-span-2 md:col-span-1">
              <p className="font-bold text-[40px] ">30,000+</p>
              <p className="text-base text-neutral-500">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Hero Image */}
        <div className="w-full h-full ">
          <img
            src={heroImg}
            alt="Hero image"
            className="lg:w-full max-sm:w-full h-full object-contain lg:object-cover"
            priority
           />
        </div>
      </div>
    </div>
  );
}
