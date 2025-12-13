import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { X, Plus, Trash2 } from 'lucide-react'
import { adminApi } from '../../services/admin.api'
import { productApi } from '../../services/product.api'

export default function AddProductModal({ isOpen, onClose, onSuccess, product = null }) {
  const isEdit = !!product
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    flavor: '',
    tags: '',
    variants: [{ size: '250g', weight: 250, price: '', stock: '' }]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && product) {
      // Populate form with product data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        basePrice: product.basePrice || '',
        flavor: product.flavor || '',
        tags: product.tags?.join(', ') || '',
        variants: product.variants && product.variants.length > 0
          ? product.variants.map(v => ({
              size: v.size || '',
              weight: v.weight || '',
              price: v.price || '',
              stock: v.stock || ''
            }))
          : [{ size: '250g', weight: 250, price: '', stock: '' }]
      })
    } else if (isOpen && !product) {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        category: '',
        basePrice: '',
        flavor: '',
        tags: '',
        variants: [{ size: '250g', weight: 250, price: '', stock: '' }]
      })
    }
  }, [isOpen, product])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData(prev => ({ ...prev, variants: newVariants }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '500g', weight: 500, price: '', stock: '' }]
    }))
  }

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, variants: newVariants }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        // For update, send all required fields that backend validator expects
        const productData = {
          name: formData.name,
          description: formData.description,
          basePrice: parseFloat(formData.basePrice),
          flavor: formData.flavor || product.flavor || 'Classic',
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          isActive: product.isActive !== undefined ? product.isActive : true
        }
        
        // Only include category if it's a valid MongoDB ObjectId
        // Don't include category at all if it's empty (validator will skip it)
        if (formData.category && formData.category.trim() !== '') {
          // Validate it's a valid MongoDB ObjectId format (24 hex characters)
          const mongoIdRegex = /^[0-9a-fA-F]{24}$/
          if (mongoIdRegex.test(formData.category.trim())) {
            productData.category = formData.category.trim()
          }
        }
        
        console.log('Updating product with ID:', product._id)
        console.log('Product data:', productData)
        // Use productApi instead of adminApi for update
        await productApi.updateProduct(product._id, productData)
      } else {
        // For create, send all fields including variants
        const productData = {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          variants: formData.variants.map(variant => ({
            ...variant,
            price: parseFloat(variant.price),
            stock: parseInt(variant.stock),
            weight: parseInt(variant.weight)
          }))
        }
        await adminApi.createProduct(productData)
      }
      
      onSuccess()
      onClose()
      
      // Reset form
      if (!isEdit) {
        setFormData({
          name: '',
          description: '',
          category: '',
          basePrice: '',
          flavor: '',
          tags: '',
          variants: [{ size: '250g', weight: 250, price: '', stock: '' }]
        })
      }
    } catch (error) {
      console.error('Product error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          `Failed to ${isEdit ? 'update' : 'create'} product`
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green-tea">Green Tea</SelectItem>
                    <SelectItem value="black-tea">Black Tea</SelectItem>
                    <SelectItem value="oolong-tea">Oolong Tea</SelectItem>
                    <SelectItem value="herbal-tea">Herbal Tea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="flavor">Flavor</Label>
                <Input
                  id="flavor"
                  value={formData.flavor}
                  onChange={(e) => handleInputChange('flavor', e.target.value)}
                  placeholder="Classic, Earl Grey, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="organic, premium, loose leaf"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Product Variants</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variant
                </Button>
              </div>
              
              {formData.variants.map((variant, index) => (
                <div key={index} className="border rounded p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Variant {index + 1}</span>
                    {formData.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label>Size</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        placeholder="250g"
                      />
                    </div>
                    <div>
                      <Label>Weight (g)</Label>
                      <Input
                        type="number"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}