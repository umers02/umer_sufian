'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/common/Header';
import Navbar from '../../../components/common/Navbar';
import Newsletter from '../../../components/home/Newsletter';
import Footer from '../../../components/common/Footer';
import ProductCard from '../../../components/products/ProductCard';
import ReviewForm from '../../../components/products/ReviewForm';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { productService } from '../../../services/productService';
import { reviewService, Review, ProductRating } from '../../../services/reviewService';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('brown');
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productRating, setProductRating] = useState<ProductRating>({ averageRating: 0, totalReviews: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchProductRating();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await reviewService.getProductReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProductRating = async () => {
    try {
      const data = await reviewService.getProductRating(id);
      setProductRating(data);
    } catch (error) {
      console.error('Error fetching product rating:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      setRelatedLoading(true);
      const data = await productService.getAllProducts();
      // Filter out current product and get random 4 products
      const filtered = data.filter((p: any) => p._id !== id);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchProductRating();
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        title: product.name,
        price: product.salePrice || product.price,
        image: product.images?.[0] || '/placeholder.png',
        size: selectedSize,
        color: selectedColor
      }, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-600">Product not found</h1>
        </div>
      </div>
    );
  }

  const colors = [
    { name: 'brown', class: 'bg-amber-800' },
    { name: 'green', class: 'bg-green-800' },
    { name: 'navy', class: 'bg-blue-900' }
  ];

  const sizes = ['Small', 'Medium', 'Large', 'X-Large'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="px-4 py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-black">Shop</Link>
            <span className="mx-2">›</span>
            <Link href="#" className="hover:text-black">Men</Link>
            <span className="mx-2">›</span>
            <span className="text-black">T-shirts</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex gap-4">
            <div className="flex flex-col space-y-4">
              {product.images?.slice(0, 3).map((image: string, index: number) => (
                <div key={index} className="w-20 h-20 border rounded-lg overflow-hidden">
                  <Image src={image} alt={`Product ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
              <Image 
                src={product.images?.[0] || '/placeholder.png'} 
                alt={product.name} 
                width={500} 
                height={500} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < Math.floor(productRating.averageRating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {productRating.averageRating > 0 ? productRating.averageRating : 'No ratings'}/5
                {productRating.totalReviews > 0 && ` (${productRating.totalReviews} reviews)`}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold">${product.salePrice || product.price}</span>
              {product.salePrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">${product.price}</span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {product.description || 'This product offers superior comfort and style.'}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Select Colors</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full ${color.class} ${
                      selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Choose Size</h3>
              <div className="flex space-x-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-full border ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 rounded-l-full"
                >
                  −
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 rounded-r-full"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="border-b">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Rating & Reviews ({productRating.totalReviews})
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'faqs'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                FAQs
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      {activeTab === 'details' && (
        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">{product.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600">{product.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Brand:</span>
                    <p className="text-gray-600">{product.brand || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">SKU:</span>
                    <p className="text-gray-600">{product.sku || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stock:</span>
                    <p className="text-gray-600">{product.stock} items available</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="text-gray-600">{product.type || 'Regular'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
              
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeTab === 'reviews' && (
        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">All Reviews ({productRating.totalReviews})</h3>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-sm">
                  <span>Latest</span>
                  <span>▼</span>
                </button>
                <button 
                  onClick={() => {
                    if (!user) {
                      alert('Please login to write a review');
                      return;
                    }
                    setShowReviewForm(true);
                  }}
                  className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800"
                >
                  Write a Review
                </button>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <h4 className="font-bold">{review.userId.name}</h4>
                      <span className="ml-2 text-green-500">✓</span>
                    </div>
                    <p className="text-gray-600 mb-3">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 mt-2">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* You Might Also Like */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">YOU MIGHT ALSO LIKE</h3>
          {relatedLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
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
          )}
        </div>
      </div>

      <Newsletter />
      <Footer />
      
      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={id}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}