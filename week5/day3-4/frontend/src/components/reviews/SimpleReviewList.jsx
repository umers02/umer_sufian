import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Star, Heart, MessageCircle } from 'lucide-react';
import SimpleReplyForm from './SimpleReplyForm';

const SimpleReviewList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  // Reset replying state only when reviews change AND user is not actively replying
  useEffect(() => {
    // Don't auto-close if user just opened reply form
    const timer = setTimeout(() => {
      if (replyingTo && reviews.length > 0) {
        // Keep reply form open
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [reviews]);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  // Auto-refresh every 30 seconds, but not when replying
  useEffect(() => {
    if (replyingTo) return; // Don't refresh when user is replying
    
    const interval = setInterval(() => {
      fetchReviews();
    }, 30000); // Increased to 30 seconds
    return () => clearInterval(interval);
  }, [productId, replyingTo]);

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for product:', productId);
      const response = await fetch(
        `http://localhost:8000/reviews/product/${productId}?page=1&limit=10`
      );
      const data = await response.json();
      console.log('Fetched reviews data:', data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/reviews/${reviewId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchReviews(); // Refresh to show updated likes
      }
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/reviews/reply/${replyId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchReviews(); // Refresh to show updated likes
      }
    } catch (error) {
      console.error('Failed to like reply:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {review.userId?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-medium">{review.userId?.name || 'Anonymous'}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">{review.content}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleLikeReview(review._id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
                {review.likes || 0}
              </button>
              <button
                onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </button>
              {review.replies?.length > 0 && (
                <span>{review.replies.length} replies</span>
              )}
            </div>

            {/* Replies */}
            {review.replies?.length > 0 && (
              <div className="mt-4 pl-6 border-l-2 border-gray-100 space-y-3">
                {review.replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        {reply.userId?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-sm">{reply.userId?.name || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                    <button
                      onClick={() => handleLikeReply(reply._id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-3 w-3" />
                      {reply.likes || 0}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === review._id && (
              <div className="mt-4 pl-6 border-t pt-4">
                <SimpleReplyForm
                  reviewId={review._id}
                  onReplySubmitted={() => {
                    setReplyingTo(null);
                    fetchReviews();
                  }}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SimpleReviewList;