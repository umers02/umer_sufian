'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Users, Film, TrendingUp, Star, LogOut, Ban, CheckCircle } from 'lucide-react'
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
      const data = await movieAPI.getAllMovies()
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
      await movieAPI.addMovie({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        original_language: movie.original_language,
        popularity: movie.popularity,
        adult: movie.adult
      })
      loadSelectedMovies()
      loadDashboardStats()
    } catch (error) {
      console.error('Error adding movie:', error)
      alert('Error adding movie. Please try again.')
    }
  }

  const removeMovie = async (tmdbId: number) => {
    try {
      await movieAPI.deleteMovie(tmdbId)
      loadSelectedMovies()
      loadDashboardStats()
    } catch (error) {
      console.error('Error removing movie:', error)
      alert('Error removing movie. Please try again.')
    }
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
                  Add Movies
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
                    <div key={movie.tmdbId} className="bg-gray-800 p-4 rounded-lg">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-2 truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">Rating: {movie.vote_average}/10</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors">
                          <Eye className="w-4 h-4 mx-auto" />
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors">
                          <Edit className="w-4 h-4 mx-auto" />
                        </button>
                        <button 
                          onClick={() => removeMovie(movie.tmdbId)}
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
              <h2 className="text-3xl font-bold mb-8">Add New Movies</h2>
              
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