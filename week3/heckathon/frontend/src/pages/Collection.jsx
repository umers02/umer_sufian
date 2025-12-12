import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function Collection() {
  const [filters, setFilters] = useState({
    collectiona: false,
    origin: false,
    flavour: false,
    qualities: false,
    cafeine: false,
    allergens: false,
    organic: false
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const products = [
    { id: 1, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cineman-tea.jpg' },
    { id: 2, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-2.jpg' },
    { id: 3, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-2 (1).jpg' },
    { id: 4, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-3.jpg' },
    { id: 5, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-4.jpg' },
    { id: 6, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-5.jpg' },
    { id: 7, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-6.jpg' },
    { id: 8, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cinemon-card-2.jpg' },
    { id: 9, name: 'Ceylon Ginger Cinnamon chai tea', price: '€4.85', weight: '50 g', image: '/cineman-tea.jpg' }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: 'url(/collection-hero-section.jpg)'}}>
        <div className="absolute inset-0 bg-opacity-40"></div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm text-gray-600 truncate" style={{fontFamily: 'Montserrat, sans-serif'}}>
            HOME/COLLECTIONS/CHAI
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-4">
              {/* COLLECTIONS Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('collectiona')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  COLLECTIONS
                  <span className="text-xl">{filters.collectiona ? '−' : '+'}</span>
                </button>
                {filters.collectiona && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Black teas
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Green teas
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      White teas
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Oolong
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Matcha
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Herbal teas
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Oolong
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Rooibos
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Teaware
                    </label>
                  </div>
                )}
              </div>

              {/* ORIGIN Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('origin')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  ORIGIN
                  <span className="text-xl">{filters.origin ? '−' : '+'}</span>
                </button>
                {filters.origin && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      India
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Japan
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      China
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      South Africa
                    </label>
                  </div>
                )}
              </div>

              {/* FLAVOUR Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('flavour')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  FLAVOUR
                  <span className="text-xl">{filters.flavour ? '−' : '+'}</span>
                </button>
                {filters.flavour && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Fruity
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Sweet
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Spicy
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Smooth
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Citrus
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Floral
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Earthy
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Minty
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Grassy
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Creamy
                    </label>
                  </div>
                )}
              </div>

              {/* QUALITIES Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('qualities')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  QUALITIES
                  <span className="text-xl">{filters.qualities ? '−' : '+'}</span>
                </button>
                {filters.qualities && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Detox
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Energy
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Relax
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Digestion
                    </label>
                  </div>
                )}
              </div>

              {/* CAFEINE Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('cafeine')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  CAFEINE
                  <span className="text-xl">{filters.cafeine ? '−' : '+'}</span>
                </button>
                {filters.cafeine && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      No Caffeine
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Low Caffeine
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Medium Caffeine
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      High Caffeine
                    </label>
                  </div>
                )}
              </div>

              {/* ALLERGENS Filter */}
              <div className="border-b pb-4">
                <button 
                  onClick={() => toggleFilter('allergens')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                  style={{fontFamily: 'Montserrat, sans-serif'}}
                >
                  ALLERGENS
                  <span className="text-xl">{filters.allergens ? '−' : '+'}</span>
                </button>
                {filters.allergens && (
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Nuts
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Gluten-free
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Lactose-free
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Soy-free
                    </label>
                  </div>
                )}
              </div>

              {/* ORGANIC Toggle */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>ORGANIC</span>
                <button 
                  onClick={() => toggleFilter('organic')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    filters.organic ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    filters.organic ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button & Sort Dropdown */}
            <div className="flex justify-between lg:justify-end items-center mb-6">
              <Button 
                variant="outline" 
                className="lg:hidden"
                style={{fontFamily: 'Montserrat, sans-serif'}}
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                Filters
              </Button>
              <Select>
                <SelectTrigger className="w-32 sm:w-48 border-none text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  <SelectValue placeholder="SORT BY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {/* COLLECTIONS Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('collectiona')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      COLLECTIONS
                      <span className="text-xl">{filters.collectiona ? '−' : '+'}</span>
                    </button>
                    {filters.collectiona && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Black teas
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Green teas
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          White teas
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Oolong
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Matcha
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Herbal teas
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Rooibos
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Teaware
                        </label>
                      </div>
                    )}
                  </div>

                  {/* ORIGIN Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('origin')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      ORIGIN
                      <span className="text-xl">{filters.origin ? '−' : '+'}</span>
                    </button>
                    {filters.origin && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          India
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Japan
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          China
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          South Africa
                        </label>
                      </div>
                    )}
                  </div>

                  {/* FLAVOUR Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('flavour')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      FLAVOUR
                      <span className="text-xl">{filters.flavour ? '−' : '+'}</span>
                    </button>
                    {filters.flavour && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Fruity
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Sweet
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Spicy
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Smooth
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Citrus
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Floral
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Earthy
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Minty
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Grassy
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Creamy
                        </label>
                      </div>
                    )}
                  </div>

                  {/* QUALITIES Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('qualities')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      QUALITIES
                      <span className="text-xl">{filters.qualities ? '−' : '+'}</span>
                    </button>
                    {filters.qualities && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Detox
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Energy
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Relax
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Digestion
                        </label>
                      </div>
                    )}
                  </div>

                  {/* CAFEINE Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('cafeine')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      CAFEINE
                      <span className="text-xl">{filters.cafeine ? '−' : '+'}</span>
                    </button>
                    {filters.cafeine && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          No Caffeine
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Low Caffeine
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Medium Caffeine
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          High Caffeine
                        </label>
                      </div>
                    )}
                  </div>

                  {/* ALLERGENS Filter */}
                  <div className="border-b pb-4">
                    <button 
                      onClick={() => toggleFilter('allergens')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      ALLERGENS
                      <span className="text-xl">{filters.allergens ? '−' : '+'}</span>
                    </button>
                    {filters.allergens && (
                      <div className="space-y-2 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Nuts
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Gluten-free
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Lactose-free
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Soy-free
                        </label>
                      </div>
                    )}
                  </div>

                  {/* ORGANIC Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, sans-serif'}}>ORGANIC</span>
                    <button 
                      onClick={() => toggleFilter('organic')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        filters.organic ? 'bg-gray-800' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        filters.organic ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer w-full">
                  <div className="bg-gray-100 aspect-square mb-4 w-full">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center mb-2 px-2">
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