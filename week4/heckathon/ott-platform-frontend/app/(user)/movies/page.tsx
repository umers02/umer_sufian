'use client'

import React, { useState, useEffect } from 'react'
import { Play, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getImageUrl } from '@/lib/tmdb'
import { movieAPI } from '@/lib/api'
import { auth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import ContentSection from '@/components/ContentSection'
import FreeTrialCTA from '@/components/FreeTrialCTA'
import Footer from '@/components/Footer'

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [genreFilter, setGenreFilter] = useState<string | null>(null)

  useEffect(() => {
    setGenreFilter(typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('genre') : null)
  }, [])

  // Check if user should be redirected based on role
  useEffect(() => {
    const user = auth.getUser()
    const role = user?.role?.toLowerCase()
    if (user && (role === 'admin' || role === 'superadmin')) {
      router.push(auth.getRoleBasedRedirect())
    }
  }, [router])

  useEffect(() => {
    loadMovies()
  }, [genreFilter])

  const loadMovies = async () => {
    try {
      const params: any = {}
      if (genreFilter) {
        // Map genre names to IDs
        const genreMap: { [key: string]: number } = {
          'action': 28,
          'adventure': 12,
          'comedy': 35,
          'drama': 18,
          'horror': 27
        }
        params.genre = genreMap[genreFilter.toLowerCase()] || genreFilter
      }
      
      const data = await movieAPI.getAllMovies(params)
      console.log('Loaded movies from DB:', data.movies)
      console.log('Manual movies:', data.movies?.filter(m => m.source === 'manual'))
      console.log('TMDB movies:', data.movies?.filter(m => m.source !== 'manual'))
      setMovies(data.movies || [])
    } catch (error) {
      console.error('Error loading movies:', error)
    }
    setLoading(false)
  }

  // Mock data for different sections
  const categories = [
    {
      name: 'Action',
      movies: [
        { id: 1, title: 'John Wick', image: '/img/john-wick.jpg', year: '2023' },
        { id: 2, title: 'Fast X', image: '/img/fast-x.jpg', year: '2023' },
        { id: 3, title: 'Mission Impossible', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 4, title: 'The Batman', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Adventure',
      movies: [
        { id: 5, title: 'Avatar', image: '/img/john-wick.jpg', year: '2022' },
        { id: 6, title: 'Jurassic World', image: '/img/fast-x.jpg', year: '2022' },
        { id: 7, title: 'Indiana Jones', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 8, title: 'Guardians', image: '/img/batman.jpg', year: '2023' }
      ]
    },
    {
      name: 'Comedy',
      movies: [
        { id: 9, title: 'The Hangover', image: '/img/john-wick.jpg', year: '2023' },
        { id: 10, title: 'Deadpool', image: '/img/fast-x.jpg', year: '2024' },
        { id: 11, title: 'Superbad', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 12, title: 'Anchorman', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Drama',
      movies: [
        { id: 13, title: 'The Godfather', image: '/img/john-wick.jpg', year: '2023' },
        { id: 14, title: 'Shawshank', image: '/img/fast-x.jpg', year: '2022' },
        { id: 15, title: 'Forrest Gump', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 16, title: 'Titanic', image: '/img/batman.jpg', year: '2022' }
      ]
    },
    {
      name: 'Horror',
      movies: [
        { id: 17, title: 'The Conjuring', image: '/img/john-wick.jpg', year: '2023' },
        { id: 18, title: 'IT', image: '/img/fast-x.jpg', year: '2022' },
        { id: 19, title: 'Scream', image: '/img/mission-impossible.jpeg', year: '2023' },
        { id: 20, title: 'Halloween', image: '/img/batman.jpg', year: '2022' }
      ]
    }
  ]

  return (
    <React.Suspense fallback={null}>
    <div className="min-h-screen text-white" style={{backgroundColor: '#141414'}}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[70vh] overflow-hidden rounded-sm">
            <div className="w-full h-full">
              <img 
                src="./img/avengers.png" 
                alt="Avengers Endgame" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                  Avengers : Endgame
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face... Avenge the fallen.
                </p>
                <div className="flex items-center justify-center gap-4 mb-12">
                  <button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg font-semibold rounded-md inline-flex items-center transition-colors">
                    <Play className="w-5 h-5 mr-2 fill-white" />
                    Play Now
                  </button>
                  <button className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-md flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-md flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zM7 9v6l5.5-3L7 9z"/>
                    </svg>
                  </button>
                  <button className="w-12 h-12 bg-black/40 hover:bg-black/60 rounded-md flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-6 bottom-8 w-10 h-10 bg-black hover:bg-gray-800 rounded-sm flex items-center justify-center transition-colors border border-gray-700">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="absolute right-6 bottom-8 w-10 h-10 bg-black hover:bg-gray-800 rounded-sm flex items-center justify-center transition-colors border border-gray-700">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              <div className="w-8 h-1 bg-red-600 rounded-full"></div>
              <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section with Border */}
      <ContentSection 
        title={genreFilter ? `${genreFilter.charAt(0).toUpperCase() + genreFilter.slice(1)} Movies` : "Movies"}
        categories={categories}
        trendingMovies={[]}
        newReleases={[]}
        mustWatchMovies={[]}
        dbMovies={movies}
      />

      {/* Shows Section with Border */}
      <ContentSection 
        title="Shows"
        categories={categories}
        trendingMovies={[]}
        newReleases={[]}
        mustWatchMovies={[]}
        dbMovies={movies}
      />

      <FreeTrialCTA />
      <Footer />
    </div>
    </React.Suspense>
  )
}