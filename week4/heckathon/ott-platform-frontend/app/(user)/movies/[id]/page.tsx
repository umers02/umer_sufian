'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Play, Search, Bell, Plus, Share, Volume2, Star, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getMovieDetails, getMovieCast, getMovieReviews, getMovieVideos, getImageUrl, getBackdropUrl } from '@/lib/tmdb'
import { movieAPI } from '@/lib/api'
import { auth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import FreeTrialCTA from '@/components/FreeTrialCTA'
import Footer from '@/components/Footer'

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState('description')

  const [movie, setMovie] = useState<any>(null)
  const [cast, setCast] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [showTrailer, setShowTrailer] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user should be redirected based on role
  useEffect(() => {
    const user = auth.getUser()
    const role = user?.role?.toLowerCase()
    if (user && (role === 'admin' || role === 'superadmin')) {
      router.push(auth.getRoleBasedRedirect())
    }
  }, [router])

  useEffect(() => {
    loadMovieData()
  }, [resolvedParams.id])

  const loadMovieData = async () => {
    try {
      console.log('Loading movie with ID:', resolvedParams.id) // Debug log
      
      // Validate ID
      const movieId = parseInt(resolvedParams.id)
      if (isNaN(movieId)) {
        console.error('Invalid movie ID:', resolvedParams.id)
        setLoading(false)
        return
      }
      
      // Check if movie exists in database
      const dbMovie = await movieAPI.getMovie(movieId)
      console.log('DB Movie found:', dbMovie) // Debug log
      
      if (dbMovie) {
        const [movieDetails, movieCast, movieReviews, movieVideos] = await Promise.all([
          getMovieDetails(dbMovie.tmdbId),
          getMovieCast(dbMovie.tmdbId),
          getMovieReviews(dbMovie.tmdbId),
          getMovieVideos(dbMovie.tmdbId)
        ])
        
        setMovie(movieDetails)
        setCast(movieCast.cast.slice(0, 6))
        setReviews(movieReviews.results.slice(0, 2))
        setVideos(movieVideos.results || [])
      } else {
        console.log('No movie found in DB with ID:', movieId)
      }
    } catch (error) {
      console.error('Error loading movie data:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <Link href="/movies" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg">
            Back to Movies
          </Link>
        </div>
      </div>
    )
  }

  const relatedMovies = [
    { id: 2, title: 'KGF Chapter 2', image: './img/related1.jpg' },
    { id: 3, title: 'RRR', image: './img/related2.jpg' },
    { id: 4, title: 'Pushpa', image: './img/related3.jpg' },
    { id: 5, title: 'Vikram', image: './img/related4.jpg' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {movie.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {movie.description}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <button 
              onClick={() => setShowTrailer(true)}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg font-semibold rounded-lg inline-flex items-center transition-colors"
            >
              <Play className="w-5 h-5 mr-2 fill-white" />
              {videos.length > 0 ? 'Watch Trailer' : 'Play Now'}
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg transition-colors">
              <Plus className="w-6 h-6" />
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg transition-colors">
              <Share className="w-6 h-6" />
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 p-3 rounded-lg transition-colors">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Movie Details */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Description & Cast */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Cast */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Cast</h2>
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {cast.map((actor, index) => (
                    <div key={index} className="flex-shrink-0 text-center">
                      <div className="w-20 h-20 bg-gray-800 rounded-full mb-2 overflow-hidden">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, 'w185')}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <span className="text-xs text-gray-500">{actor.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <button className="text-red-400 hover:text-red-300 font-medium">
                    + Add Your Review
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{review.author}</h4>
                          <p className="text-sm text-gray-400">TMDB User</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {review.author_details?.rating && (
                            <>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < (review.author_details.rating / 2) ? 'text-red-400 fill-red-400' : 'text-gray-600'}`} />
                              ))}
                              <span className="ml-1 text-sm">{review.author_details.rating}/10</span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-4">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Movie Info */}
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Released Year</span>
                    <span>{movie.release_date?.split('-')[0]}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 block mb-2">Available Languages</span>
                    <div className="flex flex-wrap gap-2">
                      {movie.spoken_languages?.map((lang: any) => (
                        <span key={lang.iso_639_1} className="bg-gray-800 px-3 py-1 rounded text-sm">{lang.name}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 block mb-2">Ratings</span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">TMDB</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          <span className="ml-1">{movie.vote_average}/10</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Votes</span>
                        <span className="text-sm">{movie.vote_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 block mb-2">Genres</span>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres?.map((g: any) => (
                        <span key={g.id} className="bg-red-600 px-3 py-1 rounded text-sm">{g.name}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Runtime</span>
                    <span>{movie.runtime} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span>{movie.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FreeTrialCTA />

      <Footer/>

      {/* Trailer Modal */}
      {showTrailer && videos.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 text-2xl font-bold z-10"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videos[0].key}?autoplay=1`}
              title={movie.title + ' Trailer'}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}
    </div>
  )
}