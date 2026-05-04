"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ value, defaultValue, min = 0, max = 100, step = 1, className, ...props }) {
  const [sliderValue, setSliderValue] = React.useState(
    Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]
  );

  // Update state if `value` prop changes
  React.useEffect(() => {
    if (value) setSliderValue(value);
  }, [value]);

  return (
    <div className={className}>
      {/* Labels above the thumbs */}
      <div className="flex justify-between mb-2 text-sm text-gray-700">
        <span>${sliderValue[0]}</span>
        <span>${sliderValue[1]}</span>
      </div>

      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        defaultValue={defaultValue}
        onValueChange={setSliderValue}
        {...props}
      >
        <SliderPrimitive.Track className="bg-gray-300 relative grow overflow-hidden rounded-full h-2">
          <SliderPrimitive.Range className="absolute bg-black h-full rounded-full" />
        </SliderPrimitive.Track>

        {sliderValue.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block w-5 h-5 bg-white border-2 border-black rounded-full shadow-md hover:ring-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}
