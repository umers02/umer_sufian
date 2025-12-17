"use client"

import type { Game } from "@/lib/store"
import Image from "next/image"


interface GameCardProps {
  game: Game
  variant?: "default" | "large"
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const isLarge = variant === "large"

  const discountPercent = game.originalPrice
    ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
    : null

  return (
    <div className="group relative rounded-lg overflow-hidden  transition-transform hover:scale-105 cursor-pointer">
      <div className={`relative ${isLarge ? "h-80" : "h-72"} w-full rounded-lg overflow-hidden`}>
        <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover w-full h-full" />
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm text-white">{game.title}</h3>

        <div className="flex items-center gap-2">
          {discountPercent && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">-{discountPercent}%</span>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            {game.originalPrice && (
              <span className="text-gray-400 line-through">₹{game.originalPrice}</span>
            )}
            <span className="text-white font-semibold">
              {game.price === 0 ? "FREE" : `₹${game.price}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
