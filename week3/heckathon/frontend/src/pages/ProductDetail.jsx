import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { productApi } from '../services/product.api'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import Loader from '../components/ui/Loader'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await productApi.getProduct(id)
      setProduct(response.product)
      if (response.product?.variants?.length > 0) {
        setSelectedVariant(response.product.variants[0]._id)
      }
    } catch (error) {
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setError('Please select a variant')
      return
    }
    
    const variant = product.variants.find(v => v._id === selectedVariant)
    if (variant.stock < quantity) {
      setError('Not enough stock available')
      return
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: variant.price,
      variant: variant.name,
      variantId: variant._id,
      quantity,
      image: product.images?.[0]
    })
    
    setError('')
    // Show success message or redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/collection')}>Back to Collection</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const selectedVariantData = product?.variants?.find(v => v._id === selectedVariant)
  const currentPrice = selectedVariantData?.price || product?.basePrice || 0

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/collection')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product?.images?.[0] || '/cineman-tea.jpg'} 
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product?.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                    <img src={image} alt={`${product.name} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < (product?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product?.reviewCount || 0} reviews)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(currentPrice)}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product?.description}</p>
            </div>

            {/* Variants */}
            {product?.variants?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Size/Weight</h3>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant._id} value={variant._id}>
                        {variant.name} - {formatPrice(variant.price)} 
                        {variant.stock === 0 && ' (Out of Stock)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariantData && quantity >= selectedVariantData.stock}
                >
                  +
                </Button>
              </div>
              {selectedVariantData && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedVariantData.stock} items available
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button 
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={!selectedVariantData || selectedVariantData.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{product?.category?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin:</span>
                    <span>{product?.origin || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Caffeine Level:</span>
                    <span>{product?.caffeineLevel || 'N/A'}</span>
                  </div>
                  {product?.tags?.length > 0 && (
                    <div>
                      <span className="block mb-1">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}