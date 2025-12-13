import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { productApi } from '../../services/product.api'
import { adminApi } from '../../services/admin.api'
import { formatPrice } from '../../utils/formatPrice'
import Loader from '../../components/ui/Loader'
import AdminLayout from '../../components/layout/AdminLayout'
import AddProductModal from '../../components/ui/AddProductModal'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      }
      const response = await productApi.getProducts(params)
      setProducts(response.products || [])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.deleteProduct(productId)
        fetchProducts()
      } catch (error) {
        setError('Failed to delete product')
      }
    }
  }

  const handleAddSuccess = () => {
    fetchProducts()
    setShowAddModal(false)
    setEditingProduct(null)
  }

  const handleEdit = async (productId) => {
    try {
      const response = await adminApi.getProductDetails(productId)
      setEditingProduct(response.product)
      setShowAddModal(true)
    } catch (error) {
      setError('Failed to load product details')
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingProduct(null)
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-gray-600">Add, edit, and manage your product catalog</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const totalStock = product.variants?.reduce((sum, variant) => sum + variant.stock, 0) || 0
                const stockStatus = getStockStatus(totalStock)
                
                return (
                  <div key={product._id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={product.images?.[0] || '/cineman-tea.jpg'} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category?.name}</p>
                      <p className="text-sm text-gray-500">
                        Base Price: {formatPrice(product.basePrice)}
                      </p>
                    </div>
                    <div className="text-center">
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {totalStock} units
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {product.variants?.length || 0} variants
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(product._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
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
      
      <AddProductModal 
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSuccess={handleAddSuccess}
        product={editingProduct}
      />
      </div>
    </AdminLayout>
  )
}