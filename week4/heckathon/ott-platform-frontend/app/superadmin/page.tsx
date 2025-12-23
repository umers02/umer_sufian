'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Settings, BarChart3, Film, TrendingUp, DollarSign, Activity, LogOut, Trash2, Ban, CheckCircle } from 'lucide-react'
import { auth } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  interface Admin { _id: string; name: string; email: string; isBlocked?: boolean; createdAt?: string }
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/super-admin/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (response.ok) {
        setAdmins(data.admins)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockAdmin = async (adminId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/super-admin/admins/${adminId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error('Error blocking admin:', error)
    }
  }

  const handleUnblockAdmin = async (adminId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/super-admin/admins/${adminId}/unblock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error('Error unblocking admin:', error)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/super-admin/admins/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          fetchAdmins()
        }
      } catch (error) {
        console.error('Error deleting admin:', error)
      }
    }
  }

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins()
    }
  }, [activeTab])

  const stats = [
    { title: 'Total Revenue', value: '$125,430', icon: DollarSign, color: 'bg-green-600', change: '+12.5%' },
    { title: 'Active Users', value: '45,678', icon: Users, color: 'bg-blue-600', change: '+8.2%' },
    { title: 'Total Movies', value: '2,456', icon: Film, color: 'bg-purple-600', change: '+15.3%' },
    { title: 'Server Uptime', value: '99.9%', icon: Activity, color: 'bg-orange-600', change: '+0.1%' }
  ]

  const recentActivity = [
    { action: 'New movie added', user: 'Admin John', time: '2 hours ago', type: 'success' },
    { action: 'User reported content', user: 'User Mike', time: '4 hours ago', type: 'warning' },
    { action: 'Server maintenance completed', user: 'System', time: '6 hours ago', type: 'info' },
    { action: 'Payment failed', user: 'User Sarah', time: '8 hours ago', type: 'error' }
  ]

  return (
    <ProtectedRoute requiredRole="superadmin">
      <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">StreamVibe SuperAdmin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, SuperAdmin</span>
              <button
                onClick={auth.logout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-colors"
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
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'admins' ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Manage Admins
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'analytics' ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  System Settings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">System Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.user}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{activity.time}</p>
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-400">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Server</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CDN</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-yellow-400">Warning</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Gateway</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Manage Administrators</h2>
              
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Admin Users</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">
                            Loading admins...
                          </td>
                        </tr>
                      ) : admins.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">
                            No admins found
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin) => (
                          <tr key={admin._id} className="border-b border-gray-800">
                            <td className="py-3 px-4">{admin.name}</td>
                            <td className="py-3 px-4 text-gray-400">{admin.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                admin.isBlocked ? 'bg-red-600' : 'bg-green-600'
                              }`}>
                                {admin.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {admin.isBlocked ? (
                                  <button 
                                    onClick={() => handleUnblockAdmin(admin._id)}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Unblock
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleBlockAdmin(admin._id)}
                                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                                  >
                                    <Ban className="w-3 h-3" />
                                    Block
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteAdmin(admin._id)}
                                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
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

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Platform Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">User Growth</h3>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Chart Placeholder</p>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Revenue Trends</h3>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Chart Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">System Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform Name</label>
                      <input type="text" value="StreamVibe" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                        <option>Disabled</option>
                        <option>Enabled</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                        <option>Required</option>
                        <option>Optional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                      <input type="number" value="30" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2" />
                    </div>
                  </div>
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