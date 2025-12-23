'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Users, Film, TrendingUp, Star, LogOut, Ban, CheckCircle, Upload } from 'lucide-react'
import { searchMovies, getPopularMovies, getImageUrl, Movie } from '@/lib/tmdb'
import { movieAPI } from '@/lib/api'
import { auth } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [selectedMovies, setSelectedMovies] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Manual movie form state
  type Genre = { id: number; name: string }
  interface ManualMovie {
    title: string
    overview: string
    release_date: string
    vote_average: number
    runtime: number
    status: string
    genres: Genre[]
    spoken_languages: { iso_639_1?: string; name?: string }[]
    cast: { id?: number; name?: string }[]
  }

  const initialManualMovie: ManualMovie = {
    title: '',
    overview: '',
    release_date: '',
    vote_average: 0,
    runtime: 0,
    status: 'Released',
    genres: [],
    spoken_languages: [],
    cast: []
  }

  const [manualMovie, setManualMovie] = useState<ManualMovie>(initialManualMovie) 
  const [files, setFiles] = useState<{ poster: File | null; backdrop: File | null; trailer: File | null }>({
    poster: null,
    backdrop: null,
    trailer: null
  })

  // Genre options
  const genreOptions = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ]

  useEffect(() => {
    loadPopularMovies()
    loadSelectedMovies()
    loadDashboardStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error blocking user:', error)
    }
  }

  const handleUnblockUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
    }
  }

  const loadPopularMovies = async () => {
    try {
      const data = await getPopularMovies()
      setPopularMovies(data.results.slice(0, 12))
    } catch (error) {
      console.error('Error loading popular movies:', error)
    }
  }

  const loadSelectedMovies = async () => {
    try {
      const data = await movieAPI.getAllMoviesAdmin()
      setSelectedMovies(data.movies || [])
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const stats = await movieAPI.getDashboardStats()
      setDashboardStats(stats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const data = await searchMovies(searchQuery)
      setSearchResults(data.results)
    } catch (error) {
      console.error('Error searching movies:', error)
    }
    setLoading(false)
  }

  const addMovie = async (movie: Movie) => {
    try {
      console.log('Adding movie:', movie); // Debug log
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing'); // Debug log
      
      await movieAPI.addMovie(movie);
      loadSelectedMovies();
      loadDashboardStats();
      alert('Movie added successfully!');
    } catch (error: any) {
      console.error('Error adding movie:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        auth.logout();
      } else {
        alert('Error adding movie. Please try again.');
      }
    }
  }

  const removeMovie = async (movie: any) => {
    try {
      if (movie.source === 'manual') {
        await movieAPI.deleteManualMovie(movie._id)
      } else {
        await movieAPI.deleteMovie(movie.tmdbId)
      }
      loadSelectedMovies()
      loadDashboardStats()
      alert('Movie deleted successfully!')
    } catch (error) {
      console.error('Error removing movie:', error)
      alert('Error removing movie. Please try again.')
    }
  }

  const addManualMovie = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    Object.keys(manualMovie).forEach(key => {
      const typedKey = key as keyof typeof manualMovie
      if (key === 'genres' || key === 'spoken_languages' || key === 'cast') {
        formData.append(key, JSON.stringify(manualMovie[typedKey]))
      } else {
        formData.append(key, String(manualMovie[typedKey]))
      }
    })

    if (files.poster) formData.append('poster', files.poster)
    if (files.backdrop) formData.append('backdrop', files.backdrop)
    if (files.trailer) formData.append('trailer', files.trailer)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/movies/manual', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (response.ok) {
        alert('Manual movie added successfully!')
        resetManualForm()
        loadSelectedMovies()
        loadDashboardStats()
      } else {
        const error = await response.json()
        alert(error.message || 'Error adding manual movie')
      }
    } catch (error) {
      console.error('Error adding manual movie:', error)
      alert('Error adding manual movie')
    }
  }

  const resetManualForm = () => {
    setManualMovie(initialManualMovie)
    setFiles({ poster: null, backdrop: null, trailer: null })
  }

  const stats = [
    { title: 'Total Movies', value: dashboardStats?.totalMovies || 0, icon: Film, color: 'bg-blue-600' },
    { title: 'Total Users', value: '1,234', icon: Users, color: 'bg-green-600' },
    { title: 'Views Today', value: '45,678', icon: TrendingUp, color: 'bg-purple-600' },
    { title: 'Avg Rating', value: '4.8', icon: Star, color: 'bg-yellow-600' }
  ]

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">StreamVibe Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, Admin</span>
              <button
                onClick={auth.logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('movies')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'movies' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Manage Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('add-movie')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'add-movie' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Add Movies (TMDB)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('manual-add')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'manual-add' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Manual Add Movie
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Manage Users
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-900 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Movies */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Recently Added Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {(dashboardStats?.recentMovies || []).map((movie: any) => (
                    <div key={movie.tmdbId} className="text-center">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium truncate">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movies' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Manage Movies</h2>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedMovies.map((movie) => (
                    <div key={movie._id || movie.tmdbId} className="bg-gray-800 p-4 rounded-lg">
                      <img
                        src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = '/img/placeholder-movie.jpg'
                        }}
                      />
                      <h3 className="font-semibold mb-2 truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">Rating: {movie.vote_average}/10</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Source: <span className={`px-2 py-1 rounded ${
                          movie.source === 'manual' ? 'bg-green-600' : 'bg-blue-600'
                        }`}>
                          {movie.source === 'manual' ? 'Manual' : 'TMDB'}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                          <Eye className="w-4 h-4 mx-auto" />
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors">
                          <Edit className="w-4 h-4 mx-auto" />
                        </button>
                        <button 
                          onClick={() => removeMovie(movie)}
                          className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-movie' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Add Movies from TMDB</h2>
              
              {/* Search Section */}
              <div className="bg-gray-900 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Search Movies from TMDB</h3>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for movies..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((movie) => (
                      <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img
                          src={getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold mb-2 truncate">{movie.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          {movie.release_date} • {movie.vote_average}/10
                        </p>
                        <button
                          onClick={() => addMovie(movie)}
                          disabled={selectedMovies.some(m => m.tmdbId === movie.id)}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          {selectedMovies.some(m => m.tmdbId === movie.id) ? 'Added' : 'Add Movie'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Movies */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Popular Movies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularMovies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-2 truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {movie.release_date} • {movie.vote_average}/10
                      </p>
                      <button
                        onClick={() => addMovie(movie)}
                        disabled={selectedMovies.some(m => m.tmdbId === movie.id)}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {selectedMovies.some(m => m.tmdbId === movie.id) ? 'Added' : 'Add Movie'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manual-add' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Manual Add Movie</h2>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <form onSubmit={addManualMovie} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        required
                        value={manualMovie.title}
                        onChange={(e) => setManualMovie({...manualMovie, title: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Release Date</label>
                      <input
                        type="date"
                        value={manualMovie.release_date}
                        onChange={(e) => setManualMovie({...manualMovie, release_date: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Overview *</label>
                    <textarea
                      required
                      rows={4}
                      value={manualMovie.overview}
                      onChange={(e) => setManualMovie({...manualMovie, overview: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating (0-10)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={manualMovie.vote_average}
                        onChange={(e) => setManualMovie({...manualMovie, vote_average: parseFloat(e.target.value)})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Runtime (minutes)</label>
                      <input
                        type="number"
                        value={manualMovie.runtime}
                        onChange={(e) => setManualMovie({...manualMovie, runtime: parseInt(e.target.value)})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={manualMovie.status}
                        onChange={(e) => setManualMovie({...manualMovie, status: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      >
                        <option value="Released">Released</option>
                        <option value="In Production">In Production</option>
                        <option value="Post Production">Post Production</option>
                      </select>
                    </div>
                  </div>

                  {/* Genres Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Genres</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-4">
                      {genreOptions.map((genre) => (
                        <label key={genre.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={manualMovie.genres.some(g => g.id === genre.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setManualMovie({
                                  ...manualMovie,
                                  genres: [...manualMovie.genres, genre]
                                })
                              } else {
                                setManualMovie({
                                  ...manualMovie,
                                  genres: manualMovie.genres.filter(g => g.id !== genre.id)
                                })
                              }
                            }}
                            className="rounded border-gray-600 text-red-600 focus:ring-red-600"
                          />
                          <span className="text-sm text-white">{genre.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Poster Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFiles({...files, poster: e.target.files?.[0] || null})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Backdrop Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFiles({...files, backdrop: e.target.files?.[0] || null})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Trailer Video</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFiles({...files, trailer: e.target.files?.[0] || null})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={resetManualForm}
                      className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Add Movie
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Manage Users</h2>
              
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Platform Users</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Joined</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">
                            Loading users...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="border-b border-gray-800">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4 text-gray-400">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                user.isBlocked ? 'bg-red-600' : 'bg-green-600'
                              }`}>
                                {user.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {user.isBlocked ? (
                                  <button 
                                    onClick={() => handleUnblockUser(user._id)}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Unblock
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleBlockUser(user._id)}
                                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                                  >
                                    <Ban className="w-3 h-3" />
                                    Block
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}