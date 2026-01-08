'use client';

import { useState, useEffect } from 'react';
import { reviewService, Review } from '../../services/reviewService';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Use fallback static data if API fails
      setReviews([
        {
          _id: '1',
          rating: 5,
          comment: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
          userId: { _id: '1', name: 'Sarah M.', email: 'sarah@example.com' },
          productId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        {
          _id: '2',
          rating: 5,
          comment: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
          userId: { _id: '2', name: 'Alex K.', email: 'alex@example.com' },
          productId: '2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        {
          _id: '3',
          rating: 5,
          comment: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
          userId: { _id: '3', name: 'James L.', email: 'james@example.com' },
          productId: '3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        }
      ] as Review[]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= reviews.length ? 0 : prev + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, reviews.length - 3) : prev - 3
    );
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">OUR HAPPY CUSTOMERS</h3>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-4xl md:text-5xl font-black">OUR HAPPY CUSTOMERS</h3>
          {reviews.length > 3 && (
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                disabled={currentIndex === 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                disabled={currentIndex + 3 >= reviews.length}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 p-6 rounded-2xl">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex items-center mb-3">
                  <h4 className="font-bold text-lg">{review.userId.name}</h4>
                  <div className="ml-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}