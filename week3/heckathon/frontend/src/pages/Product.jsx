import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [productData, setProductData] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('50g')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  const variants = [
    { size: '50 g bag', value: '50g', price: '€3.90' },
    { size: '100 g bag', value: '100g', price: '€7.50' },
    { size: '170 g bag', value: '170g', price: '€12.00' },
    { size: '250 g bag', value: '250g', price: '€17.50' },
    { size: '1 kg g bag', value: '1kg', price: '€65.00' },
    { size: 'Sampler', value: 'sampler', price: '€2.50' }
  ]

  // Get product data based on ID
  useEffect(() => {
    const fetchProductData = () => {
      const products = {
        '1': {
          id: 1,
          name: 'Ceylon Ginger Cinnamon Tea',
          price: '€4.85',
          basePrice: 4.85,
          weight: '50 g',
          image: '/cineman-tea.jpg',
          description: 'A warming blend of Ceylon black tea with aromatic ginger and cinnamon spices.',
          category: 'Black teas'
        },
        '2': {
          id: 2,
          name: 'Earl Grey Black Tea',
          price: '€5.99',
          basePrice: 5.99,
          weight: '50 g',
          image: '/cinemon-card-2.jpg',
          description: 'Classic Earl Grey black tea infused with bergamot oil for a distinctive citrusy flavor.',
          category: 'Black teas'
        },
        '3': {
          id: 3,
          name: 'Green Dragon Well',
          price: '€7.50',
          basePrice: 7.50,
          weight: '50 g',
          image: '/cinemon-card-3.jpg',
          description: 'Premium Chinese green tea with a delicate, fresh flavor and beautiful flat leaves.',
          category: 'Green teas'
        },
        '4': {
          id: 4,
          name: 'Jasmine Green Tea',
          price: '€6.25',
          basePrice: 6.25,
          weight: '50 g',
          image: '/cinemon-card-4.jpg',
          description: 'Fragrant green tea scented with jasmine flowers for a floral and refreshing taste.',
          category: 'Green teas'
        },
        '5': {
          id: 5,
          name: 'White Peony Tea',
          price: '€8.99',
          basePrice: 8.99,
          weight: '50 g',
          image: '/cinemon-card-5.jpg',
          description: 'Delicate white tea with subtle sweetness and light, refreshing character.',
          category: 'White teas'
        },
        '6': {
          id: 6,
          name: 'Chamomile Herbal Tea',
          price: '€4.50',
          basePrice: 4.50,
          weight: '50 g',
          image: '/cinemon-card-6.jpg',
          description: 'Soothing caffeine-free herbal tea made from dried chamomile flowers.',
          category: 'Herbal teas'
        },
        '7': {
          id: 7,
          name: 'Premium Matcha',
          price: '€12.99',
          basePrice: 12.99,
          weight: '30 g',
          image: '/our-collection-card-1.jpg',
          description: 'Ceremonial grade matcha powder from Japan with vibrant green color and umami flavor.',
          category: 'Matcha'
        },
        '8': {
          id: 8,
          name: 'Rooibos Vanilla',
          price: '€5.75',
          basePrice: 5.75,
          weight: '50 g',
          image: '/our-collection-card-2.jpg',
          description: 'Naturally caffeine-free rooibos tea with sweet vanilla flavoring.',
          category: 'Rooibos'
        }
      }
      
      const product = products[id]
      setProductData(product || products['1'])
      setLoading(false)
    }
    
    fetchProductData()
  }, [id])

  const relatedProducts = [
    { id: 1, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/our-collection-card-1.jpg' },
    { id: 2, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/our-collection-card-2.jpg' },
    { id: 3, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/our-collection-card-3.jpg' }
  ].filter(p => p.id !== parseInt(id)).slice(0, 3)

  const getCurrentPrice = () => {
    const variant = variants.find(v => v.value === selectedVariant)
    return variant ? variant.price : '€3.90'
  }

  const handleAddToCart = () => {
    if (!productData) return
    
    const currentPriceStr = getCurrentPrice()
    const numericPrice = parseFloat(currentPriceStr.replace('€', ''))
    
    const cartItem = {
      id: productData.id,
      name: productData.name,
      price: numericPrice,
      variant: selectedVariant,
      variantId: `variant-${productData.id}-${selectedVariant}`,
      quantity: quantity,
      image: productData.image
    }
    
    addToCart(cartItem)
    alert('Product added to bag!')
  }

  if (loading || !productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-gray-600 truncate" style={{fontFamily: 'Montserrat, sans-serif'}}>
            HOME/COLLECTIONS/CHAI/CEYLON GINGER CINNAMON CHAI TEA
          </p>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="w-full">
            <div className="bg-gray-100 aspect-square w-full">
              <img 
                src={productData.image} 
                alt={productData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Prosto One, cursive'}}>
                {productData.name}
              </h1>
              <p className="text-gray-600 mb-6" style={{fontFamily: 'Montserrat, sans-serif'}}>
                {productData.description}
              </p>
            </div>

            {/* Product Info Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_211_1240" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_211_1240)">
                    <path d="M12 22C10.6333 22 9.34167 21.7375 8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3667 2 12C2 10.6167 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C13.3833 2 14.6792 2.2625 15.8875 2.7875C17.0958 3.3125 18.1542 4.02917 19.0625 4.9375C19.9708 5.84583 20.6875 6.90417 21.2125 8.1125C21.7375 9.32083 22 10.6167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3833 22 12 22ZM12 19.95C12.4333 19.35 12.8083 18.725 13.125 18.075C13.4417 17.425 13.7 16.7333 13.9 16H10.1C10.3 16.7333 10.5583 17.425 10.875 18.075C11.1917 18.725 11.5667 19.35 12 19.95ZM9.4 19.55C9.1 19 8.8375 18.4292 8.6125 17.8375C8.3875 17.2458 8.2 16.6333 8.05 16H5.1C5.58333 16.8333 6.1875 17.5583 6.9125 18.175C7.6375 18.7917 8.46667 19.25 9.4 19.55ZM14.6 19.55C15.5333 19.25 16.3625 18.7917 17.0875 18.175C17.8125 17.5583 18.4167 16.8333 18.9 16H15.95C15.8 16.6333 15.6125 17.2458 15.3875 17.8375C15.1625 18.4292 14.9 19 14.6 19.55ZM4.25 14H7.65C7.6 13.6667 7.5625 13.3375 7.5375 13.0125C7.5125 12.6875 7.5 12.35 7.5 12C7.5 11.65 7.5125 11.3125 7.5375 10.9875C7.5625 10.6625 7.6 10.3333 7.65 10H4.25C4.16667 10.3333 4.10417 10.6625 4.0625 10.9875C4.02083 11.3125 4 11.65 4 12C4 12.35 4.02083 12.6875 4.0625 13.0125C4.10417 13.3375 4.16667 13.6667 4.25 14ZM9.65 14H14.35C14.4 13.6667 14.4375 13.3375 14.4625 13.0125C14.4875 12.6875 14.5 12.35 14.5 12C14.5 11.65 14.4875 11.3125 14.4625 10.9875C14.4375 10.6625 14.4 10.3333 14.35 10H9.65C9.6 10.3333 9.5625 10.6625 9.5375 10.9875C9.5125 11.3125 9.5 11.65 9.5 12C9.5 12.35 9.5125 12.6875 9.5375 13.0125C9.5625 13.3375 9.6 13.6667 9.65 14ZM16.35 14H19.75C19.8333 13.6667 19.8958 13.3375 19.9375 13.0125C19.9792 12.6875 20 12.35 20 12C20 11.65 19.9792 11.3125 19.9375 10.9875C19.8958 10.6625 19.8333 10.3333 19.75 10H16.35C16.4 10.3333 16.4375 10.6625 16.4625 10.9875C16.4875 11.3125 16.5 11.65 16.5 12C16.5 12.35 16.4875 12.6875 16.4625 13.0125C16.4375 13.3375 16.4 13.6667 16.35 14ZM15.95 8H18.9C18.4167 7.16667 17.8125 6.44167 17.0875 5.825C16.3625 5.20833 15.5333 4.75 14.6 4.45C14.9 5 15.1625 5.57083 15.3875 6.1625C15.6125 6.75417 15.8 7.36667 15.95 8ZM10.1 8H13.9C13.7 7.26667 13.4417 6.575 13.125 5.925C12.8083 5.275 12.4333 4.65 12 4.05C11.5667 4.65 11.1917 5.275 10.875 5.925C10.5583 6.575 10.3 7.26667 10.1 8ZM5.1 8H8.05C8.2 7.36667 8.3875 6.75417 8.6125 6.1625C8.8375 5.57083 9.1 5 9.4 4.45C8.46667 4.75 7.6375 5.20833 6.9125 5.825C6.1875 6.44167 5.58333 7.16667 5.1 8Z" fill="#282828"/>
                  </g>
                </svg>
                <span className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>Origin: Iran</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_211_1247" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_211_1247)">
                    <path d="M4 17V19H20V17H4ZM4 6H6.2C6.11667 5.85 6.0625 5.69167 6.0375 5.525C6.0125 5.35833 6 5.18333 6 5C6 4.16667 6.29167 3.45833 6.875 2.875C7.45833 2.29167 8.16667 2 9 2C9.5 2 9.9625 2.12917 10.3875 2.3875C10.8125 2.64583 11.1833 2.96667 11.5 3.35L12 4L12.5 3.35C12.8 2.95 13.1667 2.625 13.6 2.375C14.0333 2.125 14.5 2 15 2C15.8333 2 16.5417 2.29167 17.125 2.875C17.7083 3.45833 18 4.16667 18 5C18 5.18333 17.9875 5.35833 17.9625 5.525C17.9375 5.69167 17.8833 5.85 17.8 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6ZM4 14H20V8H14.9L17 10.85L15.4 12L12 7.4L8.6 12L7 10.85L9.05 8H4V14ZM9 6C9.28333 6 9.52083 5.90417 9.7125 5.7125C9.90417 5.52083 10 5.28333 10 5C10 4.71667 9.90417 4.47917 9.7125 4.2875C9.52083 4.09583 9.28333 4 9 4C8.71667 4 8.47917 4.09583 8.2875 4.2875C8.09583 4.47917 8 4.71667 8 5C8 5.28333 8.09583 5.52083 8.2875 5.7125C8.47917 5.90417 8.71667 6 9 6ZM15 6C15.2833 6 15.5208 5.90417 15.7125 5.7125C15.9042 5.52083 16 5.28333 16 5C16 4.71667 15.9042 4.47917 15.7125 4.2875C15.5208 4.09583 15.2833 4 15 4C14.7167 4 14.4792 4.09583 14.2875 4.2875C14.0958 4.47917 14 4.71667 14 5C14 5.28333 14.0958 5.52083 14.2875 5.7125C14.4792 5.90417 14.7167 6 15 6Z" fill="#282828"/>
                  </g>
                </svg>
                <span className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_211_1254" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_211_1254)">
                    <path d="M5.4 19.6C4.65 18.85 4.0625 17.9833 3.6375 17C3.2125 16.0167 3 15 3 13.95C3 12.9 3.2 11.8625 3.6 10.8375C4 9.8125 4.65 8.85 5.55 7.95C6.13333 7.36666 6.85417 6.86666 7.7125 6.45C8.57083 6.03333 9.5875 5.70416 10.7625 5.4625C11.9375 5.22083 13.2792 5.075 14.7875 5.025C16.2958 4.975 17.9833 5.03333 19.85 5.2C19.9833 6.96666 20.025 8.59166 19.975 10.075C19.925 11.5583 19.7875 12.8958 19.5625 14.0875C19.3375 15.2792 19.0208 16.3208 18.6125 17.2125C18.2042 18.1042 17.7 18.85 17.1 19.45C16.2167 20.3333 15.2792 20.9792 14.2875 21.3875C13.2958 21.7958 12.2833 22 11.25 22C10.1667 22 9.10833 21.7875 8.075 21.3625C7.04167 20.9375 6.15 20.35 5.4 19.6ZM8.2 19.2C8.68333 19.4833 9.17917 19.6875 9.6875 19.8125C10.1958 19.9375 10.7167 20 11.25 20C12.0167 20 12.775 19.8458 13.525 19.5375C14.275 19.2292 14.9917 18.7333 15.675 18.05C15.975 17.75 16.2792 17.3292 16.5875 16.7875C16.8958 16.2458 17.1625 15.5375 17.3875 14.6625C17.6125 13.7875 17.7833 12.7292 17.9 11.4875C18.0167 10.2458 18.0333 8.76666 17.95 7.05C17.1333 7.01666 16.2125 7.00416 15.1875 7.0125C14.1625 7.02083 13.1417 7.1 12.125 7.25C11.1083 7.4 10.1417 7.64166 9.225 7.975C8.30833 8.30833 7.55833 8.76666 6.975 9.35C6.225 10.1 5.70833 10.8417 5.425 11.575C5.14167 12.3083 5 13.0167 5 13.7C5 14.6833 5.1875 15.5458 5.5625 16.2875C5.9375 17.0292 6.26667 17.55 6.55 17.85C7.25 16.5167 8.175 15.2375 9.325 14.0125C10.475 12.7875 11.8167 11.7833 13.35 11C12.15 12.05 11.1042 13.2375 10.2125 14.5625C9.32083 15.8875 8.65 17.4333 8.2 19.2Z" fill="#282828"/>
                  </g>
                </svg>
                <span className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>Vegan</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>
                {getCurrentPrice()}
              </span>
            </div>

            {/* Variants */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Variants
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.value}
                    onClick={() => setSelectedVariant(variant.value)}
                    className={`transition-all duration-200 ${
                      selectedVariant === variant.value 
                        ? 'scale-105' 
                        : 'hover:scale-102'
                    }`}
                  >
                    {variant.value === '50g' ? (
                      <svg width="84" height="101" viewBox="0 0 84 101" fill="none" xmlns="http://www.w3.org/2000/svg" className={selectedVariant === variant.value ? 'opacity-100' : 'opacity-70 hover:opacity-90'}>
                        <rect x="0.5" y="0.5" width="83" height="100" stroke={selectedVariant === variant.value ? "#C3B212" : "#C3B212"}/>
                        <path d="M38.0874 41.0603C37.5874 41.0603 37.1108 40.9803 36.6574 40.8203C36.2041 40.6536 35.8441 40.4336 35.5774 40.1603L35.9274 39.5903C36.1474 39.8236 36.4474 40.0169 36.8274 40.1703C37.2141 40.3236 37.6308 40.4003 38.0774 40.4003C38.6708 40.4003 39.1208 40.2703 39.4274 40.0103C39.7408 39.7436 39.8974 39.3969 39.8974 38.9703C39.8974 38.6703 39.8241 38.4136 39.6774 38.2003C39.5374 37.9803 39.2974 37.8103 38.9574 37.6903C38.6174 37.5703 38.1508 37.5103 37.5574 37.5103H36.0674L36.4274 34.0003H40.2574V34.6403H36.7174L37.0874 34.2903L36.7774 37.2303L36.4074 36.8703H37.7174C38.4241 36.8703 38.9908 36.9569 39.4174 37.1303C39.8441 37.3036 40.1508 37.5469 40.3374 37.8603C40.5308 38.1669 40.6274 38.5269 40.6274 38.9403C40.6274 39.3336 40.5341 39.6936 40.3474 40.0203C40.1608 40.3403 39.8808 40.5936 39.5074 40.7803C39.1341 40.9669 38.6608 41.0603 38.0874 41.0603ZM44.3315 41.0603C43.7915 41.0603 43.3115 40.9203 42.8915 40.6403C42.4715 40.3536 42.1415 39.9469 41.9015 39.4203C41.6615 38.8869 41.5415 38.2469 41.5415 37.5003C41.5415 36.7536 41.6615 36.1169 41.9015 35.5903C42.1415 35.0569 42.4715 34.6503 42.8915 34.3703C43.3115 34.0836 43.7915 33.9403 44.3315 33.9403C44.8715 33.9403 45.3515 34.0836 45.7715 34.3703C46.1915 34.6503 46.5215 35.0569 46.7615 35.5903C47.0082 36.1169 47.1315 36.7536 47.1315 37.5003C47.1315 38.2469 47.0082 38.8869 46.7615 39.4203C46.5215 39.9469 46.1915 40.3536 45.7715 40.6403C45.3515 40.9203 44.8715 41.0603 44.3315 41.0603ZM44.3315 40.4003C44.7448 40.4003 45.1048 40.2903 45.4115 40.0703C45.7182 39.8436 45.9582 39.5169 46.1315 39.0903C46.3048 38.6569 46.3915 38.1269 46.3915 37.5003C46.3915 36.8736 46.3048 36.3469 46.1315 35.9203C45.9582 35.4869 45.7182 35.1603 45.4115 34.9403C45.1048 34.7136 44.7448 34.6003 44.3315 34.6003C43.9315 34.6003 43.5748 34.7136 43.2615 34.9403C42.9482 35.1603 42.7048 35.4869 42.5315 35.9203C42.3582 36.3469 42.2715 36.8736 42.2715 37.5003C42.2715 38.1269 42.3582 38.6569 42.5315 39.0903C42.7048 39.5169 42.9482 39.8436 43.2615 40.0703C43.5748 40.2903 43.9315 40.4003 44.3315 40.4003Z" fill="#282828"/>
                        <path d="M30 15H54" stroke="#282828" strokeLinecap="round"/>
                        <path d="M31.3547 10.5H52.6458C53.4302 10.5001 54.0816 11.1046 54.1409 11.8867L57.8391 60.8877C57.9046 61.7579 57.2166 62.4998 56.344 62.5H27.6565C26.7839 62.4998 26.0959 61.7578 26.1614 60.8877L29.8596 11.8867C29.9189 11.1046 30.5704 10.5001 31.3547 10.5Z" stroke="#282828"/>
                        <path d="M28.5 25.4999L23.3609 39.8894C21.8327 44.1685 21.8071 48.8404 23.2883 53.136L26 61" stroke="#282828" strokeLinecap="round"/>
                        <path d="M55.5 25.4999L60.678 39.9983C62.1824 44.2108 62.2313 48.806 60.8168 53.0496L58 61.5" stroke="#282828" strokeLinecap="round"/>
                        <path d="M14.2468 86.0842C13.5468 86.0842 12.8795 85.9722 12.2448 85.7482C11.6101 85.5148 11.1061 85.2068 10.7328 84.8242L11.2228 84.0262C11.5308 84.3528 11.9508 84.6235 12.4828 84.8382C13.0241 85.0528 13.6075 85.1602 14.2328 85.1602C15.0635 85.1602 15.6935 84.9782 16.1228 84.6142C16.5615 84.2408 16.7808 83.7555 16.7808 83.1582C16.7808 82.7382 16.6781 82.3788 16.4728 82.0802C16.2768 81.7722 15.9408 81.5342 15.4648 81.3662C14.9888 81.1982 14.3355 81.1142 13.5048 81.1142H11.4188L11.9228 76.2002H17.2848V77.0962H12.3288L12.8468 76.6062L12.4128 80.7222L11.8948 80.2182H13.7288C14.7181 80.2182 15.5115 80.3395 16.1088 80.5822C16.7061 80.8248 17.1355 81.1655 17.3968 81.6042C17.6675 82.0335 17.8028 82.5375 17.8028 83.1162C17.8028 83.6668 17.6721 84.1708 17.4108 84.6282C17.1495 85.0762 16.7575 85.4308 16.2348 85.6922C15.7121 85.9535 15.0495 86.0842 14.2468 86.0842ZM23.2385 86.0842C22.4825 86.0842 21.8105 85.8882 21.2225 85.4962C20.6345 85.0948 20.1725 84.5255 19.8365 83.7882C19.5005 83.0415 19.3325 82.1455 19.3325 81.1002C19.3325 80.0548 19.5005 79.1635 19.8365 78.4262C20.1725 77.6795 20.6345 77.1102 21.2225 76.7182C21.8105 76.3168 22.4825 76.1162 23.2385 76.1162C23.9945 76.1162 24.6665 76.3168 25.2545 76.7182C25.8425 77.1102 26.3045 77.6795 26.6405 78.4262C26.9858 79.1635 27.1585 80.0548 27.1585 81.1002C27.1585 82.1455 26.9858 83.0415 26.6405 83.7882C26.3045 84.5255 25.8425 85.0948 25.2545 85.4962C24.6665 85.8882 23.9945 86.0842 23.2385 86.0842ZM23.2385 85.1602C23.8172 85.1602 24.3212 85.0062 24.7505 84.6982C25.1798 84.3808 25.5158 83.9235 25.7585 83.3262C26.0012 82.7195 26.1225 81.9775 26.1225 81.1002C26.1225 80.2228 26.0012 79.4855 25.7585 78.8882C25.5158 78.2815 25.1798 77.8242 24.7505 77.5162C24.3212 77.1988 23.8172 77.0402 23.2385 77.0402C22.6785 77.0402 22.1792 77.1988 21.7405 77.5162C21.3018 77.8242 20.9612 78.2815 20.7185 78.8882C20.4758 79.4855 20.3545 80.2228 20.3545 81.1002C20.3545 81.9775 20.4758 82.7195 20.7185 83.3262C20.9612 83.9235 21.3018 84.3808 21.7405 84.6982C22.1792 85.0062 22.6785 85.1602 23.2385 85.1602ZM36.5601 88.7862C35.8881 88.7862 35.2441 88.6882 34.6281 88.4922C34.0121 88.2962 33.5128 88.0162 33.1301 87.6522L33.6341 86.8962C33.9794 87.2042 34.4041 87.4468 34.9081 87.6242C35.4214 87.8108 35.9628 87.9042 36.5321 87.9042C37.4654 87.9042 38.1514 87.6848 38.5901 87.2462C39.0288 86.8168 39.2481 86.1448 39.2481 85.2302V83.3962L39.3881 82.1362L39.2901 80.8762V78.6502H40.2421V85.1042C40.2421 86.3735 39.9294 87.3022 39.3041 87.8902C38.6881 88.4875 37.7734 88.7862 36.5601 88.7862ZM36.3781 85.7202C35.6781 85.7202 35.0481 85.5708 34.4881 85.2722C33.9281 84.9642 33.4848 84.5395 33.1581 83.9982C32.8408 83.4568 32.6821 82.8362 32.6821 82.1362C32.6821 81.4362 32.8408 80.8202 33.1581 80.2882C33.4848 79.7468 33.9281 79.3268 34.4881 79.0282C35.0481 78.7295 35.6781 78.5802 36.3781 78.5802C37.0314 78.5802 37.6194 78.7155 38.1421 78.9862C38.6648 79.2568 39.0801 79.6582 39.3881 80.1902C39.6961 80.7222 39.8501 81.3708 39.8501 82.1362C39.8501 82.9015 39.6961 83.5502 39.3881 84.0822C39.0801 84.6142 38.6648 85.0202 38.1421 85.3002C37.6194 85.5802 37.0314 85.7202 36.3781 85.7202ZM36.4761 84.8382C37.0174 84.8382 37.4981 84.7262 37.9181 84.5022C38.3381 84.2688 38.6694 83.9515 38.9121 83.5502C39.1548 83.1395 39.2761 82.6682 39.2761 82.1362C39.2761 81.6042 39.1548 81.1375 38.9121 80.7362C38.6694 80.3348 38.3381 80.0222 37.9181 79.7982C37.4981 79.5648 37.0174 79.4482 36.4761 79.4482C35.9441 79.4482 35.4634 79.5648 35.0341 79.7982C34.6141 80.0222 34.2828 80.3348 34.0401 80.7362C33.8068 81.1375 33.6901 81.6042 33.6901 82.1362C33.6901 82.6682 33.8068 83.1395 34.0401 83.5502C34.2828 83.9515 34.6141 84.2688 35.0341 84.5022C35.4634 84.7262 35.9441 84.8382 36.4761 84.8382ZM50.9661 86.0702C50.3221 86.0702 49.7435 85.9255 49.2301 85.6362C48.7168 85.3375 48.3108 84.9082 48.0121 84.3482C47.7135 83.7882 47.5641 83.1115 47.5641 82.3182C47.5641 81.5155 47.7135 80.8388 48.0121 80.2882C48.3201 79.7282 48.7308 79.3035 49.2441 79.0142C49.7575 78.7248 50.3315 78.5802 50.9661 78.5802C51.6661 78.5802 52.2915 78.7388 52.8421 79.0562C53.4021 79.3642 53.8408 79.7982 54.1581 80.3582C54.4755 80.9182 54.6341 81.5715 54.6341 82.3182C54.6341 83.0555 54.4755 83.7088 54.1581 84.2782C53.8408 84.8382 53.4021 85.2768 52.8421 85.5942C52.2915 85.9115 51.6661 86.0702 50.9661 86.0702ZM47.1721 86.0002V75.6122H48.1661V80.8202L48.0261 82.3042L48.1241 83.7882V86.0002H47.1721ZM50.8961 85.1882C51.4188 85.1882 51.8855 85.0715 52.2961 84.8382C52.7068 84.5955 53.0335 84.2595 53.2761 83.8302C53.5188 83.3915 53.6401 82.8875 53.6401 82.3182C53.6401 81.7395 53.5188 81.2355 53.2761 80.8062C53.0335 80.3768 52.7068 80.0455 52.2961 79.8122C51.8855 79.5695 51.4188 79.4482 50.8961 79.4482C50.3735 79.4482 49.9021 79.5695 49.4821 79.8122C49.0715 80.0455 48.7448 80.3768 48.5021 80.8062C48.2688 81.2355 48.1521 81.7395 48.1521 82.3182C48.1521 82.8875 48.2688 83.3915 48.5021 83.8302C48.7448 84.2595 49.0715 84.5955 49.4821 84.8382C49.9021 85.0715 50.3735 85.1882 50.8961 85.1882ZM61.4754 86.0002V84.3762L61.4334 84.1102V81.3942C61.4334 80.7688 61.2561 80.2882 60.9014 79.9522C60.5561 79.6162 60.0381 79.4482 59.3474 79.4482C58.8714 79.4482 58.4187 79.5275 57.9894 79.6862C57.5601 79.8448 57.1961 80.0548 56.8974 80.3162L56.4494 79.5742C56.8227 79.2568 57.2707 79.0142 57.7934 78.8462C58.3161 78.6688 58.8667 78.5802 59.4454 78.5802C60.3974 78.5802 61.1301 78.8182 61.6434 79.2942C62.1661 79.7608 62.4274 80.4748 62.4274 81.4362V86.0002H61.4754ZM58.9414 86.0702C58.3907 86.0702 57.9101 85.9815 57.4994 85.8042C57.0981 85.6175 56.7901 85.3655 56.5754 85.0482C56.3607 84.7215 56.2534 84.3482 56.2534 83.9282C56.2534 83.5455 56.3421 83.2002 56.5194 82.8922C56.7061 82.5748 57.0047 82.3228 57.4154 82.1362C57.8354 81.9402 58.3954 81.8422 59.0954 81.8422H61.6294V82.5842H59.1234C58.4141 82.5842 57.9194 82.7102 57.6394 82.9622C57.3687 83.2142 57.2334 83.5268 57.2334 83.9002C57.2334 84.3202 57.3967 84.6562 57.7234 84.9082C58.0501 85.1602 58.5074 85.2862 59.0954 85.2862C59.6554 85.2862 60.1361 85.1602 60.5374 84.9082C60.9481 84.6468 61.2467 84.2735 61.4334 83.7882L61.6574 84.4742C61.4707 84.9595 61.1441 85.3468 60.6774 85.6362C60.2201 85.9255 59.6414 86.0702 58.9414 86.0702ZM68.5132 88.7862C67.8412 88.7862 67.1972 88.6882 66.5812 88.4922C65.9652 88.2962 65.4659 88.0162 65.0832 87.6522L65.5872 86.8962C65.9325 87.2042 66.3572 87.4468 66.8612 87.6242C67.3745 87.8108 67.9159 87.9042 68.4852 87.9042C69.4185 87.9042 70.1045 87.6848 70.5432 87.2462C70.9819 86.8168 71.2012 86.1448 71.2012 85.2302V83.3962L71.3412 82.1362L71.2432 80.8762V78.6502H72.1952V85.1042C72.1952 86.3735 71.8825 87.3022 71.2572 87.8902C70.6412 88.4875 69.7265 88.7862 68.5132 88.7862ZM68.3312 85.7202C67.6312 85.7202 67.0012 85.5708 66.4412 85.2722C65.8812 84.9642 65.4379 84.5395 65.1112 83.9982C64.7939 83.4568 64.6352 82.8362 64.6352 82.1362C64.6352 81.4362 64.7939 80.8202 65.1112 80.2882C65.4379 79.7468 65.8812 79.3268 66.4412 79.0282C67.0012 78.7295 67.6312 78.5802 68.3312 78.5802C68.9845 78.5802 69.5725 78.7155 70.0952 78.9862C70.6179 79.2568 71.0332 79.6582 71.3412 80.1902C71.6492 80.7222 71.8032 81.3708 71.8032 82.1362C71.8032 82.9015 71.6492 83.5502 71.3412 84.0822C71.0332 84.6142 70.6179 85.0202 70.0952 85.3002C69.5725 85.5802 68.9845 85.7202 68.3312 85.7202ZM68.4292 84.8382C68.9705 84.8382 69.4512 84.7262 69.8712 84.5022C70.2912 84.2688 70.6225 83.9515 70.8652 83.5502C71.1079 83.1395 71.2292 82.6682 71.2292 82.1362C71.2292 81.6042 71.1079 81.1375 70.8652 80.7362C70.6225 80.3348 70.2912 80.0222 69.8712 79.7982C69.4512 79.5648 68.9705 79.4482 68.4292 79.4482C67.8972 79.4482 67.4165 79.5648 66.9872 79.7982C66.5672 80.0222 66.2359 80.3348 65.9932 80.7362C65.7599 81.1375 65.6432 81.6042 65.6432 82.1362C65.6432 82.6682 65.7599 83.1395 65.9932 83.5502C66.2359 83.9515 66.5672 84.2688 66.9872 84.5022C67.4165 84.7262 67.8972 84.8382 68.4292 84.8382Z" fill="#282828"/>
                      </svg>
                    ) : (
                      <div className={`w-20 h-24 border-2 flex items-center justify-center text-center transition-colors ${
                        selectedVariant === variant.value 
                          ? 'border-gray-900 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="text-xs text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>{variant.size}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  −
                </button>
                <span className="px-4 py-2 " style={{fontFamily: 'Montserrat, sans-serif'}}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  +
                </button>
              </div>
              <Button 
                onClick={handleAddToCart}
                className="bg-black hover:bg-gray-800 text-white px-1 py-7 flex-1 max-w-xs rounded-none"
              >
                🛒 ADD TO BAG
              </Button>
            </div>
          </div>
        </div>

        {/* Product Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-16">
          {/* Steeping Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Prosto One, cursive'}}>
              Steeping instructions
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_214_272" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_214_272)">
                    <path d="M6 19V6L3 2H18V5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V12C22 12.55 21.8042 13.0208 21.4125 13.4125C21.0208 13.8042 20.55 14 20 14H18V19H6ZM8 17H16V4H7L8 5.3V17ZM18 12H20V7H18V12ZM12 16H15V5H12V16ZM3 22V20H21V22H3Z" fill="#282828"/>
                  </g>
                </svg>
                <div>
                  <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>SERVING SIZE: </span>
                  <span className="text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>2 tsp per cup, 6 tsp per pot</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_214_280" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_214_280)">
                    <path d="M4 13.8C4 12.1333 4.6625 10.3208 5.9875 8.3625C7.3125 6.40417 9.31667 4.28333 12 2C13.9667 3.66667 15.5625 5.25 16.7875 6.75C18.0125 8.25 18.8917 9.675 19.425 11.025H17.25C16.7833 10.075 16.1167 9.07083 15.25 8.0125C14.3833 6.95417 13.3 5.83333 12 4.65C10.0167 6.46667 8.52083 8.14167 7.5125 9.675C6.50417 11.2083 6 12.5833 6 13.8C6 15.5833 6.56667 17.0625 7.7 18.2375C8.83333 19.4125 10.2667 20 12 20V22C9.71667 22 7.8125 21.2167 6.2875 19.65C4.7625 18.0833 4 16.1333 4 13.8ZM14.8 22.475L14.375 21.525C14.2417 21.2417 14.1458 20.9458 14.0875 20.6375C14.0292 20.3292 14 20.0167 14 19.7C14 19.3333 14.0417 18.9708 14.125 18.6125C14.2083 18.2542 14.3333 17.9083 14.5 17.575C14.6333 17.2917 14.75 17.0042 14.85 16.7125C14.95 16.4208 15 16.1167 15 15.8C15 15.55 14.9708 15.3083 14.9125 15.075C14.8542 14.8417 14.775 14.6083 14.675 14.375L14.325 13.625L15.7 13.025L16.125 13.925C16.2583 14.2083 16.3542 14.5083 16.4125 14.825C16.4708 15.1417 16.5 15.4667 16.5 15.8C16.5 16.1667 16.4583 16.525 16.375 16.875C16.2917 17.225 16.1667 17.5667 16 17.9C15.8667 18.1833 15.75 18.475 15.65 18.775C15.55 19.075 15.5 19.3833 15.5 19.7C15.5 19.9333 15.525 20.1625 15.575 20.3875C15.625 20.6125 15.7 20.8333 15.8 21.05L16.175 21.875L14.8 22.475ZM17.8 22.475L17.375 21.525C17.2417 21.2417 17.1458 20.9458 17.0875 20.6375C17.0292 20.3292 17 20.0167 17 19.7C17 19.3333 17.0417 18.9708 17.125 18.6125C17.2083 18.2542 17.3333 17.9083 17.5 17.575C17.6333 17.2917 17.75 17.0042 17.85 16.7125C17.95 16.4208 18 16.1167 18 15.8C18 15.55 17.9708 15.3083 17.9125 15.075C17.8542 14.8417 17.775 14.6083 17.675 14.375L17.325 13.625L18.7 13.025L19.125 13.925C19.2583 14.225 19.3542 14.5292 19.4125 14.8375C19.4708 15.1458 19.5 15.4667 19.5 15.8C19.5 16.1667 19.4583 16.525 19.375 16.875C19.2917 17.225 19.1667 17.5667 19 17.9C18.8667 18.1833 18.75 18.475 18.65 18.775C18.55 19.075 18.5 19.3833 18.5 19.7C18.5 19.9333 18.525 20.1625 18.575 20.3875C18.625 20.6125 18.7 20.8333 18.8 21.05L19.175 21.875L17.8 22.475ZM20.8 22.475L20.375 21.525C20.2417 21.2417 20.1458 20.9458 20.0875 20.6375C20.0292 20.3292 20 20.0167 20 19.7C20 19.3333 20.0417 18.9708 20.125 18.6125C20.2083 18.2542 20.3333 17.9083 20.5 17.575C20.6333 17.2917 20.75 17.0042 20.85 16.7125C20.95 16.4208 21 16.1167 21 15.8C21 15.55 20.9708 15.3083 20.9125 15.075C20.8542 14.8417 20.775 14.6083 20.675 14.375L20.325 13.625L21.7 13.025L22.125 13.925C22.2583 14.2083 22.3542 14.5083 22.4125 14.825C22.4708 15.1417 22.5 15.4667 22.5 15.8C22.5 16.1667 22.4583 16.5292 22.375 16.8875C22.2917 17.2458 22.1667 17.5917 22 17.925C21.8667 18.2083 21.75 18.4958 21.65 18.7875C21.55 19.0792 21.5 19.3833 21.5 19.7C21.5 19.9333 21.525 20.1625 21.575 20.3875C21.625 20.6125 21.7 20.8333 21.8 21.05L22.175 21.875L20.8 22.475Z" fill="#282828"/>
                  </g>
                </svg>
                <div>
                  <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>WATER TEMPERATURE: </span>
                  <span className="text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>100°C</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_214_288" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_214_288)">
                    <path d="M12.0001 22C10.7501 22 9.57927 21.7625 8.4876 21.2875C7.39593 20.8125 6.44593 20.1708 5.6376 19.3625C4.82926 18.5541 4.1876 17.6041 3.7126 16.5125C3.2376 15.4208 3.0001 14.25 3.0001 13C3.0001 11.75 3.2376 10.5791 3.7126 9.48748C4.1876 8.39581 4.82926 7.44581 5.6376 6.63748C6.44593 5.82914 7.39593 5.18748 8.4876 4.71248C9.57927 4.23748 10.7501 3.99998 12.0001 3.99998C13.2501 3.99998 14.4209 4.23748 15.5126 4.71248C16.6043 5.18748 17.5543 5.82914 18.3626 6.63748C19.1709 7.44581 19.8126 8.39581 20.2876 9.48748C20.7626 10.5791 21.0001 11.75 21.0001 13C21.0001 14.25 20.7626 15.4208 20.2876 16.5125C19.8126 17.6041 19.1709 18.5541 18.3626 19.3625C17.5543 20.1708 16.6043 20.8125 15.5126 21.2875C14.4209 21.7625 13.2501 22 12.0001 22ZM14.8001 17.2L16.2001 15.8L13.0001 12.6V7.99998H11.0001V13.4L14.8001 17.2ZM5.6001 2.34998L7.0001 3.74998L2.7501 7.99998L1.3501 6.59998L5.6001 2.34998ZM18.4001 2.34998L22.6501 6.59998L21.2501 7.99998L17.0001 3.74998L18.4001 2.34998ZM12.0001 20C13.9501 20 15.6043 19.3208 16.9626 17.9625C18.3209 16.6041 19.0001 14.95 19.0001 13C19.0001 11.05 18.3209 9.39581 16.9626 8.03748C15.6043 6.67914 13.9501 5.99998 12.0001 5.99998C10.0501 5.99998 8.39593 6.67914 7.0376 8.03748C5.67926 9.39581 5.0001 11.05 5.0001 13C5.0001 14.95 5.67926 16.6041 7.0376 17.9625C8.39593 19.3208 10.0501 20 12.0001 20Z" fill="#282828"/>
                  </g>
                </svg>
                <div>
                  <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>STEEPING TIME: </span>
                  <span className="text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>3 - 5 minutes</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#BC575F"/>
                </svg>
                <div>
                  <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>COLOR AFTER 3 MINUTES</span>
                </div>
              </div>
            </div>
          </div>

          {/* About this tea */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Prosto One, cursive'}}>
              About this tea
            </h2>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>FLAVOR</div>
                <div className="text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>Spicy</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>QUALITIES</div>
                <div className="text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>Smoothing</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>CAFFEINE</div>
                <div className="text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>Medium</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>ALLERGENS</div>
                <div className="text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>Nuts-free</div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Ingredient
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, 
                Cinnamon sticks, Cardamom, Cinnamon pieces.
              </p>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8" style={{fontFamily: 'Prosto One, cursive'}}>
            You may also like
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              {relatedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
                  <div className="bg-gray-100 aspect-square mb-4 w-48 h-48 mx-auto">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mb-2">
                    <h3 className="text-gray-900 font-medium text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      Ceylon Ginger
                    </h3>
                    <h4 className="text-gray-900 font-medium text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      Cinnamon chai tea
                    </h4>
                  </div>
                  <p className="text-center text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    {product.price} / {product.weight}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}