import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/lib/tmdb'

interface Movie {
  id: number
  title: string
  image: string
  year: string
  rating?: string
}

interface MovieCardProps {
  movie: Movie
  variant?: 'trending' | 'release' | 'mustwatch'
  dbMovies?: any[]  // DB movies array
}

export default function MovieCard({ movie, variant = 'trending', dbMovies = [] }: MovieCardProps) {
  // Get random DB movie for linking
  const getRandomDbMovie = () => {
    if (dbMovies && dbMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * dbMovies.length)
      const selectedMovie = dbMovies[randomIndex]
      console.log('Selected DB Movie:', selectedMovie) // Debug log
      
      // Return the appropriate ID based on movie source
      if (selectedMovie.source === 'manual') {
        return selectedMovie._id // Use MongoDB ObjectId for manual movies
      } else {
        return selectedMovie.tmdbId || selectedMovie.id // Use tmdbId for TMDB movies
      }
    }
    console.log('No DB movies available, using fallback tmdbId: 155') // Debug log
    return 155 // Default to Dark Knight tmdbId
  }
  
  const renderContent = () => {
    switch (variant) {
      case 'trending':
        return (
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>1h 30min</span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span>2K</span>
            </div>
          </div>
        )
      
      case 'release':
        return (
          <div className="flex items-center justify-center text-xs text-white">
            <div className="bg-black/60 px-2 py-1 rounded">
              <span>Released at {movie.year}</span>
            </div>
          </div>
        )
      
      case 'mustwatch':
        return (
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Must Watch</span>
            </div>
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span>{movie.year}</span>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Link href={`/movies/${getRandomDbMovie()}`}>
      <div className="group cursor-pointer bg-[#1A1A1A] rounded-lg p-2 hover:bg-[#2A2A2A] transition-colors">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
        {renderContent()}
      </div>
    </Link>
  )
}