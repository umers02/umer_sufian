"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  color?: string; // new prop to change slider color
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  color = "#2E3D83", // default color
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-white relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-3.75 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          style={{ backgroundColor: color }}
          className="absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative flex items-center justify-center size-6 rounded-full bg-white border border-[#F9C146] shadow-md transition hover:scale-110 focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {/* Thumb SVG */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none"
          >
            
            <g>
              
              <path
                d="M3.9375 5.15625C2.60156 5.71875 2.34375 5.78906 2.08594 5.48438C1.78125 5.10938 0 5.01562 0 5.39062C0 5.50781 0.1875 5.97656 0.398438 6.42188C0.75 7.19531 0.75 7.28906 0.398438 7.6875C-0.09375 8.22656 -0.117188 9.04688 0.375 9.23438C0.867188 9.42188 1.17188 9.21094 1.17188 8.67188C1.17188 8.13281 2.46094 7.03125 3.07031 7.03125C3.96094 7.03125 4.875 7.71094 5.15625 8.55469L5.4375 9.39844L7.45313 9.32812L9.46875 9.25781L9.65625 8.50781C9.86719 7.71094 10.8047 7.03125 11.6953 7.03125C12.3281 7.03125 13.5938 8.15625 13.5938 8.71875C13.5938 9.35156 14.2266 9.1875 14.6953 8.39062C15.0469 7.82812 15.0469 7.73438 14.6953 7.17188C14.0391 6.21094 13.2422 5.8125 11.5313 5.67188C10.3828 5.57812 9.77344 5.41406 9.23438 4.99219C8.15625 4.19531 6.02344 4.24219 3.9375 5.15625Z"
                fill="#2E3D83"
              />
              <path
                d="M2.2736 8.15625C1.42985 9.07031 2.01578 10.5469 3.18766 10.5469C3.86735 10.5469 4.68766 9.77344 4.68766 9.14062C4.68766 8.50781 3.86735 7.73438 3.2111 7.73438C2.90641 7.73438 2.48453 7.92188 2.2736 8.15625Z"
                fill="#2E3D83"
              />
              <path
                d="M10.7092 8.01581C10.0529 8.53144 9.95919 9.49238 10.5217 10.0549C11.4826 11.0158 12.8889 10.4768 12.8889 9.16425C12.8889 8.01581 11.6233 7.33613 10.7092 8.01581Z"
                fill="#2E3D83"
              />
            </g>
          </svg>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
