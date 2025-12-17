"use client"

import { useGameStore } from "@/lib/store"
import Image from "next/image"

export function ThreeColumnSection() {
  const { games } = useGameStore()

  const topSellers = games.slice(0, 5)
  const bestSeller = games.slice(5, 10)
  const upcomingGames = games.slice(6, 11)

  return (
    <section className="py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
        {/* Top Sellers */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Sellers</h3>
            <button suppressHydrationWarning className="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded hover:text-white">view more</button>
          </div>
          <div className="space-y-3">
            {topSellers.map((game:any) => (
              <div key={game.id} className="flex gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{game.title}</h4>
                  <p className="text-gray-400 text-xs">₹{game.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -right-4 top-0 bottom-0 w-px bg-white/10"></div>
        </div>

        {/* Best Seller */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Best Seller</h3>
            <button suppressHydrationWarning className="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded hover:text-white">view more</button>
          </div>
          <div className="space-y-3">
            {bestSeller.map((game) => (
              <div key={game.id} className="flex gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{game.title}</h4>
                  <p className="text-gray-400 text-xs">{game.price === 0 ? "Free" : `₹${game.price}`}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -right-4 top-0 bottom-0 w-px bg-white/10"></div>
        </div>

        {/* Top Upcoming game */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Upcoming game</h3>
            <button suppressHydrationWarning className="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded hover:text-white">view more</button>
          </div>
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <div key={game.id} className="flex gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{game.title}</h4>
                  <p className="text-gray-400 text-xs">{game.description ? "Coming soon" : `₹${game.price}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}