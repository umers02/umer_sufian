"use client"

import type { Game } from "@/lib/store"
import { GameCard } from "./game-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { useSearch } from "@/contexts/search-context"

interface GameCarouselProps {
  title: string
  games: Game[]
  variant?: "default" | "large"
}

export function GameCarousel({ title, games, variant = "default" }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { searchQuery } = useSearch()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const filteredGames = mounted ? games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : games

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="relative py-8">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4 items-start"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredGames.map((game) => (
          <div key={game.id} className="flex-none" style={{ width: '12.5rem' }}>
            <GameCard game={game} variant={variant} />
          </div>
        ))}
      </div>
    </section>
  )
}
