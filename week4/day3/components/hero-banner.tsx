"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useSearch } from "@/contexts/search-context"

const games = [
  { id: 1, name: "God Of War 4", image: "./img/god-of-war.jpg", description: "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive." },
  { id: 2, name: "Farcry 6 Golden Edition", image: "./img/far-cry-6.jpg", description: "Experience the thrill of guerrilla warfare in a tropical paradise." },
  { id: 3, name: "GTA V", image: "./img/gta-v.jpg", description: "The biggest, most dynamic and most diverse open world ever created." },
  { id: 4, name: "Outlast 2", image: "./img/outlast-2.png", description: "Survive the horror in this terrifying survival horror experience." }
]

export function HeroBanner() {
  const [selectedGame, setSelectedGame] = useState(games[0])
  const { searchQuery, setSearchQuery } = useSearch()

  return (
   <section className="w-full">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Top controls: search + quick links */}
        <div className="max-w-7xl mx-auto mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] w-4 h-4" />
            <Input 
              placeholder="Search Store" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 bg-[#141414] border-none rounded-full w-full md:w-[340px] text-sm" 
            />
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <a className="text-white font-medium">Discover</a>
            <a className="text-[#9a9a9a] hover:text-white">Browse</a>
            <a className="text-[#9a9a9a] hover:text-white">News</a>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto">
          {/* Main hero card */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#071018] min-h-[300px] md:min-h-[420px]">
            <Image src={selectedGame.image} alt={selectedGame.name} fill className="object-cover opacity-70" priority />

            {/* Left text block */}
            <div className="absolute left-4 md:left-8 bottom-6 md:bottom-12 max-w-2xl">
              <div className="inline-block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2 md:mb-3">
                PRE-PURCHASE AVAILABLE
              </div>

              <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-lg leading-relaxed mb-4 md:mb-6">
                {selectedGame.description}
              </p>
              <Button className="bg-white text-black font-semibold rounded-sm px-4 md:px-5 py-2 shadow-md text-sm">
                PRE-PURCHASE NOW
              </Button>
            </div>
          </div>

          {/* Right panel: highlighted item + list */}
          <aside className="hidden lg:flex flex-col justify-between w-80 h-[420px]">
            {games.map((game, index) => (
              <div 
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-colors ${
                  selectedGame.id === game.id ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={game.image} 
                    alt={game.name} 
                    width={64} 
                    height={64} 
                    className="object-cover w-full h-full" 
                  />
                </div>
                <div>
                  <div className="text-white font-medium text-base">{game.name}</div>
                </div>
              </div>
            ))}
          </aside>
        </div>

        {/* Mobile game selector */}
        <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
          {games.map((game) => (
            <div 
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors ${
                selectedGame.id === game.id ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={game.image} 
                  alt={game.name} 
                  width={48} 
                  height={48} 
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="text-white font-medium text-sm truncate">{game.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
