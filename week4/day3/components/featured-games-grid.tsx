"use client"

import { FeaturedGameCard } from "./featured-game-card"
import { useGameStore } from "@/lib/store"

export function FeaturedGamesGrid() {
  const { games } = useGameStore()
  const featuredGames = games.slice(5, 8) // Get NFS, FIFA, UNCHARTED

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {featuredGames.map((game) => (
          <FeaturedGameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}