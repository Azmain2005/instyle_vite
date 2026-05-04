import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialCard from "./TestiominalCard";
import { useQuery } from "@tanstack/react-query";

// fetch function
async function fetchTestimonials() {
  const res = await fetch("https://testimonialapi.vercel.app/api");
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
}

export default function Testimonials() {
  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center p-10">
        <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">Error loading testimonials</p>;
  }

  return (
    <div className=" h-900px mx-auto bg-white rounded-lg relative mb-10">
      <Carousel>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10 pt-10 px-20">
          <h2 className="text-4xl font-extrabold tracking-tight">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="flex space-x-2">
            <CarouselPrevious className="translate-y-0 translate-x-[-10px] relative border rounded-full w-10 h-10 flex items-center justify-center"  />
            <CarouselNext className="translate-y-0 relative border rounded-full w-10 h-10 flex items-center justify-center"  />
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/4 max-md:basis-1/2 max-sm:basis-3/4 max-sm:mx-10"
              >
                <TestimonialCard
                  name={item.name}
                  message={item.message}
                  rating={item.rating}
                 />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Left Blur */}
          <div className="pointer-events-none absolute top-0 left-0 h-full lg:w-[400px] bg-gradient-to-r from-white to-transparent blur-sm"  />

          {/* Right Blur */}
          <div className="pointer-events-none absolute top-0 right-0 h-full lg:w-[400px] bg-gradient-to-l from-white to-transparent blur-sm"  />
        </div>
      </Carousel>
    </div>
  );
}