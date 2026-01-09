'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Header from '../../../components/common/Header';
import Navbar from '../../../components/common/Navbar';
import ProductCard from '../../../components/products/ProductCard';
import Newsletter from '../../../components/home/Newsletter';
import Footer from '../../../components/common/Footer';
import { productService } from '../../../services/productService';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('Most Popular');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 9;

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedTags, selectedSizes, priceRange, sortBy]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      // Filter products by category (case insensitive)
      const filteredProducts = allProducts.filter((product: any) => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
      setProducts(filteredProducts);
      
      // Set initial price range based on products
      if (filteredProducts.length > 0) {
        const prices = filteredProducts.map((p: any) => p.salePrice || p.price);
        setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product: any) => 
        product.tags?.some((tag: string) => selectedTags.includes(tag))
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product: any) => 
        product.sizes?.some((size: string) => selectedSizes.includes(size))
      );
    }

    // Filter by price range
    filtered = filtered.filter((product: any) => {
      const price = product.salePrice || product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort products
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a: any, b: any) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'Price: High to Low':
        filtered.sort((a: any, b: any) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      default:
        // Most Popular - keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const colors = [
    { name: 'green', class: 'bg-green-500' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'yellow', class: 'bg-yellow-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'navy', class: 'bg-blue-900' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'white', class: 'bg-white border' },
    { name: 'black', class: 'bg-black' }
  ];

  const availableTags = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
  const availableSizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedSizes([]);
    if (products.length > 0) {
      const prices = products.map((p: any) => p.salePrice || p.price);
      setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    }
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedSizes.length > 0;

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navbar />
      
      <div className="px-4 py-2 md:py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs md:text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-1 md:mx-2">›</span>
            <span className="text-black">{categoryName}</span>
          </nav>
        </div>
      </div>

      <div className="px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between"
            >
              <span>Filters</span>
              <span>{showFilters ? '▲' : '▼'}</span>
            </button>
          </div>

          <div className={`w-full lg:w-80 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="border rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold">Filters</h3>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs md:text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-4 md:mb-6 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-xs md:text-sm font-medium mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-black text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTag(tag)}
                          className="text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedSizes.map((size) => (
                      <span
                        key={size}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        {size}
                        <button
                          onClick={() => toggleSize(size)}
                          className="text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 md:mb-6">
                <h4 className="font-medium mb-3 md:mb-4 text-sm md:text-base">Categories</h4>
                <div className="space-y-2 md:space-y-3">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center justify-between py-1 md:py-2 border-b">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="mr-2"
                        />
                        <span className={`text-sm md:text-base ${selectedTags.includes(tag) ? 'text-black font-medium' : 'text-gray-600'}`}>
                          {tag}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="font-medium text-sm md:text-base">Price</h4>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <input 
                    type="range" 
                    min={Math.min(...products.map(p => p.salePrice || p.price))} 
                    max={Math.max(...products.map(p => p.salePrice || p.price))} 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="font-medium text-sm md:text-base">Colors</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {colors.map((color) => (
                    <button key={color.name} className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${color.class}`} />
                  ))}
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="font-medium text-sm md:text-base">Size</h4>
                </div>
                <div className="grid grid-cols-2 gap-1 md:gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm rounded-full border ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="font-medium text-sm md:text-base">Dress Style</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="space-y-1 md:space-y-2">
                  {['Casual', 'Formal', 'Party', 'Gym'].map((style) => (
                    <Link 
                      key={style} 
                      href={`/category/${style.toLowerCase()}`}
                      className="flex items-center justify-between py-1 md:py-2 border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="text-gray-600 hover:text-black text-sm md:text-base">{style}</span>
                      <span className="text-gray-400">›</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <button 
                  onClick={clearAllFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 md:py-3 rounded-full text-sm md:text-base hover:bg-gray-300"
                >
                  Clear Filters
                </button>
                <button className="w-full bg-black text-white py-2 md:py-3 rounded-full text-sm md:text-base">
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{categoryName}</h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} Products
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {currentProducts.map((product) => (
                    <ProductCard 
                      key={product._id}
                      id={product._id}
                      image={product.images?.[0] || '/placeholder.png'}
                      title={product.name}
                      rating={product.averageRating || 0}
                      price={product.salePrice || product.price}
                      originalPrice={product.salePrice ? product.price : undefined}
                      discount={product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <button 
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-2 text-sm md:text-base ${
                        currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex space-x-1 md:space-x-2 overflow-x-auto">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && goToPage(page)}
                          disabled={page === '...'}
                          className={`px-2 md:px-3 py-1 md:py-2 rounded text-sm md:text-base ${
                            page === currentPage 
                              ? 'bg-black text-white' 
                              : page === '...' 
                                ? 'text-gray-400 cursor-default'
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className={`flex items-center space-x-2 text-sm md:text-base ${
                        currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base md:text-lg">No products found in {categoryName} category</p>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Try browsing other categories</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}