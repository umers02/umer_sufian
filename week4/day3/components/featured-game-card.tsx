"use client"

import type { Game } from "@/lib/store"
import Image from "next/image"

interface FeaturedGameCardProps {
  game: Game
}

export function FeaturedGameCard({ game }: FeaturedGameCardProps) {
  return (
    <div className="rounded-xl overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="relative h-48 w-full rounded-xl overflow-hidden">
        <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold text-sm">{game.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
          {game.description || "Experience this amazing game with stunning graphics and immersive gameplay."}
        </p>
        <div className="text-white font-bold text-sm">₹{game.price}</div>
      </div>
    </div>
  )
}