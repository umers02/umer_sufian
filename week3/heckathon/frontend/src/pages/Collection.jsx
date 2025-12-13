import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { productApi } from '../services/product.api'
import { formatPrice } from '../utils/formatPrice'
import Loader from '../components/ui/Loader'

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
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState('')

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedFilters, selectedCategories, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 9,
        ...selectedFilters,
        sortBy
      }
      
      if (selectedCategories.length > 0) {
        params.category = selectedCategories.join(',')
      }
      
      const response = await productApi.getProducts(params)
      setProducts(response.products || [])
      setTotalPages(response.pagination?.totalPages || response.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Set empty array if API fails - no fallback to mock data
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setCurrentPage(1)
  }

  const handleCategoryChange = (category, isChecked) => {
    if (isChecked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== category))
    }
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedFilters({})
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

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
                    {['Black teas', 'Green teas', 'White teas', 'Oolong', 'Matcha', 'Herbal teas', 'Rooibos', 'Teaware'].map(category => (
                      <label key={category} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        />
                        {category}
                      </label>
                    ))}
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
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32 sm:w-48 border-none text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>
                  <SelectValue placeholder="SORT BY" />
                </SelectTrigger>
                <SelectContent> 
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="rating_desc">Highest Rated</SelectItem>
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
                        {['Black teas', 'Green teas', 'White teas', 'Oolong', 'Matcha', 'Herbal teas', 'Rooibos', 'Teaware'].map(category => (
                          <label key={category} className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="mr-2" 
                              checked={selectedCategories.includes(category)}
                              onChange={(e) => handleCategoryChange(category, e.target.checked)}
                            />
                            {category}
                          </label>
                        ))}
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

            {/* Selected Filters Display */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Selected:</span>
                  {selectedCategories.map(category => (
                    <span key={category} className="px-2 py-1 bg-gray-200 text-xs rounded flex items-center gap-1">
                      {category}
                      <button 
                        onClick={() => handleCategoryChange(category, false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">Not Available</div>
                <p className="text-gray-400 text-sm">No products found for selected categories</p>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
                  {products.map((product) => (
                    <Link 
                      key={product._id} 
                      to={`/product/${product._id}`} 
                      className="group cursor-pointer w-full"
                      onClick={() => {
                        console.log('Navigating to product:', product._id, product.name)
                      }}
                    >
                      <div className="bg-gray-100 aspect-square mb-4 w-full">
                        <img 
                          src={product.images?.[0] || '/cineman-tea.jpg'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center mb-2 px-2">
                        <h3 className="text-gray-900 font-medium text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-xs" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          {product.category?.name}
                        </p>
                      </div>
                      <p className="text-center text-gray-600 text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {formatPrice(product.basePrice)}
                      </p>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
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
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}