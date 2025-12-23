'use client'

import { useState } from 'react'
import SectionHeader from './SectionHeader'
import CategoryCard from './CategoryCard'
import MovieCard from './MovieCard'
import Link from 'next/link'
import { getImageUrl } from '@/lib/tmdb'

interface Movie {
  id: number
  title: string
  image: string
  year: string
  rating?: string
}

interface Category {
  name: string
  movies: Movie[]
}

interface ContentSectionProps {
  title: string
  categories: Category[]
  trendingMovies: Movie[]
  newReleases: Movie[]
  mustWatchMovies: Movie[]
  dbMovies?: any[]  // DB movies array
}

export default function ContentSection({ 
  title, 
  categories, 
  trendingMovies, 
  newReleases, 
  mustWatchMovies,
  dbMovies = []
}: ContentSectionProps) {
  const [trendingPage, setTrendingPage] = useState(0)
  const [newReleasePage, setNewReleasePage] = useState(0)
  const [mustWatchPage, setMustWatchPage] = useState(0)
  const [genrePage, setGenrePage] = useState(0)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [filteredMovies, setFilteredMovies] = useState<any[]>([])
  
  const moviesPerPage = 5
  const genresPerPage = 5
  
  // Calculate filtered movie arrays
  const filteredTrendingMovies = dbMovies.filter(movie => 
    (movie.vote_average >= 7 || movie.popularity > 100) && (movie.tmdbId || movie.source === 'manual')
  )
  const filteredNewReleases = dbMovies.filter(movie => {
    const currentYear = new Date().getFullYear()
    const releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0
    return releaseYear >= currentYear - 2 && (movie.tmdbId || movie.source === 'manual')
  })
  const filteredMustWatchMovies = dbMovies.filter(movie => 
    !movie.tmdbId || movie.source === 'manual' || movie.source === 'Manual' || movie.vote_average >= 8
  )
  
  console.log('ContentSection - dbMovies:', dbMovies.length)
  console.log('ContentSection - manual movies:', dbMovies.filter(m => m.source === 'manual').length)
  console.log('ContentSection - all movie sources:', dbMovies.map(m => ({ title: m.title, source: m.source })))
  console.log('ContentSection - filteredMustWatchMovies:', filteredMustWatchMovies.length)
  
  const totalPages = Math.ceil(dbMovies.length / moviesPerPage)
  const totalTrendingPages = Math.ceil(filteredTrendingMovies.length / moviesPerPage)
  const totalNewReleasePages = Math.ceil(filteredNewReleases.length / moviesPerPage)
  const totalMustWatchPages = Math.ceil(filteredMustWatchMovies.length / moviesPerPage)
  const totalGenrePages = Math.ceil(categories.length / genresPerPage)
  
  // Create genre categories from DB movies
  const createGenreCategories = () => {
    const genreMap = new Map()
    
    dbMovies.forEach(movie => {
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach((genre: any) => {
          if (!genreMap.has(genre.name)) {
            genreMap.set(genre.name, [])
          }
          genreMap.get(genre.name).push(movie)
        })
      } else if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        // Handle TMDB genre_ids
        const genreNames: Record<number, string> = {
          28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
          99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
          27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
          10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
        }
        movie.genre_ids.forEach((genreId: number) => {
          const genreName = genreNames[genreId]
          if (genreName) {
            if (!genreMap.has(genreName)) {
              genreMap.set(genreName, [])
            }
            genreMap.get(genreName).push(movie)
          }
        })
      }
    })
    
    return Array.from(genreMap.entries()).map(([name, movies]) => ({
      name,
      movies: movies.slice(0, 4).map((movie: any) => ({
        id: movie._id || movie.tmdbId,
        title: movie.title,
        image: movie.poster_path?.startsWith('http') ? movie.poster_path : getImageUrl(movie.poster_path),
        year: movie.release_date?.split('-')[0] || 'N/A'
      }))
    }))
  }
  
  const genreCategories = createGenreCategories()
  
  const getGenreSlice = () => {
    const start = genrePage * genresPerPage
    return genreCategories.slice(start, start + genresPerPage)
  }
  
  const getTrendingMovies = () => {
    const start = trendingPage * moviesPerPage
    return filteredTrendingMovies.slice(start, start + moviesPerPage)
  }
  
  const getNewReleaseMovies = () => {
    const start = newReleasePage * moviesPerPage
    return filteredNewReleases.slice(start, start + moviesPerPage)
  }
  
  const getMustWatchMovies = () => {
    const start = mustWatchPage * moviesPerPage
    return filteredMustWatchMovies.slice(start, start + moviesPerPage)
  }
  
  const handleGenreNext = () => {
    setGenrePage((prev) => (prev + 1) % totalGenrePages)
  }
  
  const handleGenrePrev = () => {
    setGenrePage((prev) => (prev - 1 + totalGenrePages) % totalGenrePages)
  }
  
  const handleTrendingNext = () => {
    if (totalTrendingPages > 0) {
      setTrendingPage((prev) => (prev + 1) % totalTrendingPages)
    }
  }
  
  const handleTrendingPrev = () => {
    if (totalTrendingPages > 0) {
      setTrendingPage((prev) => (prev - 1 + totalTrendingPages) % totalTrendingPages)
    }
  }
  
  const handleNewReleaseNext = () => {
    if (totalNewReleasePages > 0) {
      setNewReleasePage((prev) => (prev + 1) % totalNewReleasePages)
    }
  }
  
  const handleNewReleasePrev = () => {
    if (totalNewReleasePages > 0) {
      setNewReleasePage((prev) => (prev - 1 + totalNewReleasePages) % totalNewReleasePages)
    }
  }
  
  const handleMustWatchNext = () => {
    if (totalMustWatchPages > 0) {
      setMustWatchPage((prev) => (prev + 1) % totalMustWatchPages)
    }
  }
  
  const handleMustWatchPrev = () => {
    if (totalMustWatchPages > 0) {
      setMustWatchPage((prev) => (prev - 1 + totalMustWatchPages) % totalMustWatchPages)
    }
  }
  
  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName)
    const filtered = dbMovies.filter(movie => {
      if (movie.genres && Array.isArray(movie.genres)) {
        return movie.genres.some((genre: any) => genre.name === genreName)
      } else if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        const genreNames: Record<number, string> = {
          28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
          99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
          27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
          10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
        }
        return movie.genre_ids.some((genreId: number) => genreNames[genreId] === genreName)
      }
      return false
    })
    setFilteredMovies(filtered)
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <fieldset className="border border-gray-600 rounded-lg p-8">
          <legend className="px-4 text-2xl font-bold text-white bg-[#141414]">{title}</legend>
          
          {/* Our Genres */}
          <div className="mb-16">
            <SectionHeader 
              title="Our Genres" 
              onNext={handleGenreNext}
              onPrevious={handleGenrePrev}
              currentPage={genrePage}
              totalPages={totalGenrePages}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getGenreSlice().map((category, index) => (
                <div key={index} onClick={() => handleGenreClick(category.name)}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

          {/* Filtered Movies by Genre */}
          {selectedGenre && filteredMovies.length > 0 && (
            <div className="mb-16">
              <SectionHeader title={`${selectedGenre} Movies`} showNavigation={false} />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMovies.slice(0, 10).map((movie) => (
                  <Link key={movie._id || movie.tmdbId} href={`/movies/${movie.source === 'manual' ? movie._id : movie.tmdbId}`}>
                    <div className="group cursor-pointer bg-[#1A1A1A] rounded-lg p-2 hover:bg-[#2A2A2A] transition-colors">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img
                          src={movie.poster_path?.startsWith('http') 
                            ? movie.poster_path 
                            : getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/img/placeholder-movie.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-white truncate mb-1">{movie.title}</h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                          {movie.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setSelectedGenre(null)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors"
                >
                  Show All Movies
                </button>
              </div>
            </div>
          )}

          {/* Popular Top 10 in Genres */}
          <div className="mb-16">
            <SectionHeader title="Popular Top 10 in Genres" showNavigation={false} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getGenreSlice().map((category, index) => (
                <CategoryCard key={index} category={category} showTopBadge={true} />
              ))}
            </div>
          </div>

          {/* Trending Now */}
          {filteredTrendingMovies.length > 0 && (
            <div className="mb-16">
              <SectionHeader 
                title="Trending Now" 
                onNext={handleTrendingNext}
                onPrevious={handleTrendingPrev}
                currentPage={trendingPage}
                totalPages={totalTrendingPages}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getTrendingMovies().map((movie) => (
                  <Link key={movie._id || movie.tmdbId} href={`/movies/${movie.source === 'manual' ? movie._id : movie.tmdbId}`}>
                    <div className="group cursor-pointer bg-[#1A1A1A] rounded-lg p-2 hover:bg-[#2A2A2A] transition-colors">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img
                          src={movie.poster_path?.startsWith('http') 
                            ? movie.poster_path 
                            : getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/img/placeholder-movie.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        
                        {/* Source Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            movie.source === 'manual' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {movie.source === 'manual' ? 'Manual' : 'TMDB'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-white truncate mb-1">{movie.title}</h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                          {movie.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* New Releases */}
          {filteredNewReleases.length > 0 && (
            <div className="mb-16">
              <SectionHeader 
                title="New Releases" 
                onNext={handleNewReleaseNext}
                onPrevious={handleNewReleasePrev}
                currentPage={newReleasePage}
                totalPages={totalNewReleasePages}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getNewReleaseMovies().map((movie) => (
                  <Link key={movie._id || movie.tmdbId} href={`/movies/${movie.source === 'manual' ? movie._id : movie.tmdbId}`}>
                    <div className="group cursor-pointer bg-[#1A1A1A] rounded-lg p-2 hover:bg-[#2A2A2A] transition-colors">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img
                          src={movie.poster_path?.startsWith('http') 
                            ? movie.poster_path 
                            : getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/img/placeholder-movie.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        
                        {/* Source Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            movie.source === 'manual' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {movie.source === 'manual' ? 'Manual' : 'TMDB'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-white truncate mb-1">{movie.title}</h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                          {movie.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Must - Watch */}
          {filteredMustWatchMovies.length > 0 && (
            <div>
              <SectionHeader 
                title={`Must - Watch ${title}`} 
                onNext={handleMustWatchNext}
                onPrevious={handleMustWatchPrev}
                currentPage={mustWatchPage}
                totalPages={totalMustWatchPages}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getMustWatchMovies().map((movie) => (
                  <Link key={movie._id || movie.tmdbId} href={`/movies/${movie.source === 'manual' ? movie._id : movie.tmdbId}`}>
                    <div className="group cursor-pointer bg-[#1A1A1A] rounded-lg p-2 hover:bg-[#2A2A2A] transition-colors">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img
                          src={movie.poster_path?.startsWith('http') 
                            ? movie.poster_path 
                            : getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/img/placeholder-movie.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        
                        {/* Source Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            movie.source === 'manual' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {movie.source === 'manual' ? 'Manual' : 'TMDB'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-white truncate mb-1">{movie.title}</h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                          {movie.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </fieldset>
      </div>
    </section>
  )
}