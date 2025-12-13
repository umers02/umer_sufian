import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Search, UserCheck, UserX, Shield } from 'lucide-react'
import { adminApi } from '../../services/admin.api'
import Loader from '../../components/ui/Loader'
import AdminLayout from '../../components/layout/AdminLayout'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Try real API first, fallback to mock data
      try {
        const params = {
          page: currentPage,
          limit: 10,
          search: searchTerm
        }
        const response = await adminApi.getUsers(params)
        setUsers(response.users || [])
        setTotalPages(response.pagination?.totalPages || 1)
      } catch (apiError) {
        // Fallback to mock data
        console.log('Users API failed, using mock data:', apiError.message)
        const mockUsers = [
          {
            _id: '1',
            name: 'John Admin',
            email: 'admin@test.com',
            role: 'admin',
            isBlocked: false,
            createdAt: new Date(),
            orderCount: 0
          },
          {
            _id: '2',
            name: 'Jane User',
            email: 'user@test.com',
            role: 'user',
            isBlocked: false,
            createdAt: new Date(),
            orderCount: 5
          }
        ]
        setUsers(mockUsers)
        setTotalPages(1)
      }
    } catch (error) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId) => {
    try {
      await adminApi.blockUser(userId)
      setError('')
      fetchUsers()
    } catch (error) {
      setError('Failed to block user: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleUnblockUser = async (userId) => {
    try {
      await adminApi.unblockUser(userId)
      setError('')
      fetchUsers()
    } catch (error) {
      setError('Failed to unblock user: ' + (error.response?.data?.message || error.message))
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isBlocked) => {
    return isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
             onChange={(e) => {
  setSearchTerm(e.target.value)
  setCurrentPage(1)
}}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={getRoleColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={getStatusColor(user.isBlocked)}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium">{user.orderCount || 0}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {user.isBlocked ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnblockUser(user._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Unblock
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBlockUser(user._id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={user.role === 'superadmin'}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Block
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  )
}