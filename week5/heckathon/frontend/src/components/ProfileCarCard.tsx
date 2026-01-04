'use client'
import React from "react"
import { Star, Clock } from "lucide-react"
import type { Car } from "@/types/api"

type Variant = "mycars" | "bids" | "wishlist"

type Props = {
  car: Car
  variant?: Variant
  onAction?: (car: Car) => void
}

export function CarCard({ car, variant = "mycars", onAction }: Props) {
  const renderImage = () => (
    <div className={`${variant === "wishlist" ? "h-44" : variant === "bids" ? "h-40" : "h-28"} bg-gray-100 rounded overflow-hidden border`}>
      <img 
        src={car.photos?.[0] || "/placeholder.jpg"} 
        alt={car.title} 
        className="w-full h-full object-cover" 
      />
    </div>
  )

  const actionLabel =
    variant === "mycars" ? (car.isCompleted ? "Sold" : "Active") : "Submit A Bid"

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4">
        <div className="relative">
          {renderImage()}
          <div className="absolute top-3 right-3">
            <div className="bg-white rounded-full p-1 border">
              <Star size={14} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <h3 className="mt-3 text-sm font-medium text-[#15306B]">{car.title}</h3>

        {/* Pricing badges */}
        <div className="mt-3 flex gap-3 items-center">
          <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded text-sm">
            ${car.startingPrice}
            <div className="text-xs text-gray-400">Starting Price</div>
          </div>
          {car.currentPrice > 0 && (
            <div className="bg-pink-50 text-pink-700 px-3 py-2 rounded text-sm">
              ${car.currentPrice}
              <div className="text-xs text-gray-400">Current Price</div>
            </div>
          )}
        </div>

        {/* meta row */}
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <div>Status: {car.isCompleted ? 'Completed' : 'Active'}</div>
          </div>
          <div>{car.bids?.length || 0} Total Bids</div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => onAction?.(car)}
            className={`w-full rounded py-2 text-white ${variant === "wishlist" ? "bg-white text-[#27346A] border border-[#27346A]" : "bg-[#27346A]"}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}