"use client"

import { useGameStore } from "@/lib/store"
import { GameCarousel } from "./game-carousel"

export function FeaturedGamesSection() {
  const { topSellers } = useGameStore()

  return (
    <section className="py-8 px-4">
      <div className="container">
        <GameCarousel title="Game on sale ›" games={topSellers} />
      </div>
    </section>
  )
}
