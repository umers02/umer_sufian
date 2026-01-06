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
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['Large']);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      // Filter products by category (case insensitive)
      const filteredProducts = allProducts.filter((product: any) => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
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

  const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

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
      
      <div className="px-4 py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-black">{categoryName}</span>
          </nav>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="w-80 flex-shrink-0">
            <div className="border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button className="text-gray-400">☰</button>
              </div>

              <div className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">T-shirts</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Shorts</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Shirts</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Hoodie</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Jeans</span>
                    <span className="text-gray-400">›</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Price</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="space-y-4">
                  <input type="range" min="50" max="200" className="w-full" />
                  <div className="flex justify-between text-sm">
                    <span>$50</span>
                    <span>$200</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Colors</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <button key={color.name} className={`w-8 h-8 rounded-full ${color.class}`} />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Size</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 text-sm rounded-full border ${
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

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Dress Style</h4>
                  <span className="text-gray-400">▲</span>
                </div>
                <div className="space-y-2">
                  {['Casual', 'Formal', 'Party', 'Gym'].map((style) => (
                    <div key={style} className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-600">{style}</span>
                      <span className="text-gray-400">›</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-full">
                Apply Filter
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
                <p className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} Products
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
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
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-2 ${
                        currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && goToPage(page)}
                          disabled={page === '...'}
                          className={`px-3 py-2 rounded ${
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
                      className={`flex items-center space-x-2 ${
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
                <p className="text-gray-500 text-lg">No products found in {categoryName} category</p>
                <p className="text-gray-400 mt-2">Try browsing other categories</p>
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