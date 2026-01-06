'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../products/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  pointsPrice?: number;
  type?: 'regular' | 'loyalty_only' | 'hybrid';
  images: string[];
  isOnSale?: boolean;
  createdAt: string;
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products');
      if (response.ok) {
        const result = await response.json();
        const productsData = result.data || result;
        // Sort by creation date (newest first) and take latest products
        const sortedProducts = Array.isArray(productsData) 
          ? productsData.sort((a: Product, b: Product) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = showAll ? products : products.slice(0, 4);

  const handleViewAll = () => {
    if (products.length <= 4) {
      router.push('/products');
    } else {
      setShowAll(!showAll);
    }
  };

  if (loading) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">NEW ARRIVALS</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">NEW ARRIVALS</h3>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  id={product._id}
                  image={product.images?.[0] || '/placeholder.png'}
                  title={product.name}
                  rating={4.5}
                  price={product.isOnSale && product.salePrice ? product.salePrice : product.price}
                  originalPrice={product.isOnSale && product.salePrice ? product.price : undefined}
                  discount={product.isOnSale && product.salePrice ? 
                    Math.round(((product.price - product.salePrice) / product.price) * 100) : undefined
                  }
                  pointsPrice={product.pointsPrice}
                  type={product.type || 'regular'}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <button 
                onClick={handleViewAll}
                className="border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-50"
              >
                {showAll ? 'View Less' : products.length <= 4 ? 'View All' : `View More (${products.length - 4} more)`}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}