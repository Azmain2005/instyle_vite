// app/components/TestimonialCard.js
import { Star } from "lucide-react";

export default function TestimonialCard({ name, message, rating }) {
  return (
    <div className="p-4 flex flex-col border border-gray-200 justify-between min-h-[250px] rounded-2xl bg-white shadow-sm hover:shadow-md transition">
      {/* Rating */}
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.round(rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
           />
        ))}
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

      {/* Review Message */}
     <p className="mt-3 text-gray-700 text-[16px] line-clamp-4">{`"${message}"`}</p>

    </div>
  );
}

