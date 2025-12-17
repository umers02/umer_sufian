"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { GameCarousel } from "@/components/game-carousel"
import { FeaturedGamesSection } from "@/components/featured-games-section"
import { FeaturedGamesGrid } from "@/components/featured-games-grid"
import { FreeGamesSection } from "@/components/free-games-section"
import { ThreeColumnSection } from "@/components/three-column-section"
import { ExploreCatalog } from "@/components/explore-catalog"
import { Footer } from "@/components/footer"
import { useGameStore } from "@/lib/store"
import { SearchProvider, useSearch } from "@/contexts/search-context"

function HomeContent() {
  const { featuredGames, freeGames, topSellers, upcomingGames, initializeCategories, getFilteredGames } = useGameStore()
  const { searchQuery } = useSearch()
  
  useEffect(() => {
    initializeCategories()
  }, [])
  
  const isSearching = searchQuery.trim().length > 0
  const searchResults = isSearching ? getFilteredGames(searchQuery) : []

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto">
        <HeroBanner />

        {isSearching ? (
          <div className="container mx-auto space-y-6 md:space-y-8">
            <GameCarousel title={`Search Results (${searchResults.length})`} games={searchResults} />
          </div>
        ) : (
          <div className="container mx-auto space-y-6 md:space-y-8">
            <GameCarousel title="Games on sale >" games={featuredGames} />
            
            <FeaturedGamesGrid />
            
            <FreeGamesSection />

            <ThreeColumnSection />

            <FeaturedGamesGrid />

            <GameCarousel title="Game with achievement >" games={featuredGames} />

            <ExploreCatalog />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <SearchProvider>
      <HomeContent />
    </SearchProvider>
  )
}
