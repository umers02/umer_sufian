'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../products/ProductCard';
import { productService } from '../../services/productService';

export default function TopSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  const fetchTopSellingProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getTopSellingProducts(8);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching top selling products:', error);     
    } finally {
      setLoading(false);
    }
  };

  // If no products sold yet, don't show the section
  if (!loading && products.length === 0) {
    return null;
  }

  const displayProducts = showAll ? products : products.slice(0, 4);

  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">TOP SELLING</h3>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {displayProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={product.images?.[0] || '/placeholder.png'}
                  title={product.name}
                  rating={product.rating || 4.0}
                  price={product.salePrice || product.price}
                  originalPrice={product.salePrice ? product.price : undefined}
                  discount={product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : undefined}
                  pointsPrice={product.pointsPrice}
                  type={product.type || 'regular'}
                />
              ))}
            </div>

            {products.length > 4 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-50"
                >
                  {showAll ? 'Show Less' : 'View All'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}