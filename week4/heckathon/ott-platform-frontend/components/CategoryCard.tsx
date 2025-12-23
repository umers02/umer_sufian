import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Movie {
  id: number
  title: string
  image: string
  year: string
}

interface CategoryCardProps {
  category: {
    name: string
    genreId?: number
    movies: Movie[]
  }
  showTopBadge?: boolean
}

export default function CategoryCard({ category, showTopBadge = false }: CategoryCardProps) {
  return (
    <Link href={`/movies?genre=${category.genreId || category.name.toLowerCase()}`}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-800 rounded-lg px-3 py-2 mb-3 overflow-hidden" style={{backgroundColor: '#1A1A1A'}}>
          <div className="grid grid-cols-2 gap-1 mb-1">
            {category.movies.slice(0, 4).map((movie, movieIndex) => (
              <div key={movieIndex} className="aspect-[3/3.5] bg-gray-700 rounded-md overflow-hidden relative">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const nextSibling = target.nextElementSibling as HTMLElement;
                    target.style.display = 'none';
                    if (nextSibling) nextSibling.style.display = 'flex';
                  }}
                />
                {movieIndex >= 2 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent pointer-events-none" />
                )}
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-xs text-gray-400">{movie.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {showTopBadge ? (
              <div className="flex flex-col">
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded mb-1 w-fit">Top 10 in</span>
                <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">{category.name}</h4>
              </div>
            ) : (
              <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">{category.name}</h4>
            )}
            <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}