import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Star, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ReplyForm from './ReplyForm';

const ReviewList = ({ productId, refreshTrigger }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    console.log('Auth not available');
  }
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async (pageNum = 1) => {
    try {
      const response = await fetch(
        `http://localhost:5002/reviews/product/${productId}?page=${pageNum}&limit=10`
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      
      setHasMore(data.pagination.page < data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/reviews/${reviewId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(prev => prev.map(review => 
          review._id === reviewId ? { ...review, likes: updatedReview.likes, likedBy: updatedReview.likedBy } : review
        ));
      }
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const handleLikeReply = async (replyId, reviewId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/reviews/reply/${replyId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedReply = await response.json();
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? {
                ...review,
                replies: review.replies.map(reply =>
                  reply._id === replyId ? { ...reply, likes: updatedReply.likes, likedBy: updatedReply.likedBy } : reply
                )
              }
            : review
        ));
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
                  {review.userId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium">{review.userId?.name}</h4>
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
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div 
              className="prose prose-sm max-w-none mb-4"
              dangerouslySetInnerHTML={{ __html: review.content }}
            />

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleLikeReview(review._id)}
                className={`flex items-center gap-1 hover:text-red-500 ${
                  user && review.likedBy?.includes(user.id) ? 'text-red-500' : ''
                }`}
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
            </div>

            {/* Replies */}
            {review.replies?.length > 0 && (
              <div className="mt-4 pl-6 border-l-2 border-gray-100 space-y-4">
                {review.replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        {reply.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{reply.userId?.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none mb-2"
                      dangerouslySetInnerHTML={{ __html: reply.content }}
                    />
                    <button
                      onClick={() => handleLikeReply(reply._id, review._id)}
                      className={`flex items-center gap-1 text-xs hover:text-red-500 ${
                        user && reply.likedBy?.includes(user.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
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
              <div className="mt-4 pl-6">
                <ReplyForm
                  reviewId={review._id}
                  onReplySubmitted={() => {
                    setReplyingTo(null);
                    fetchReviews(1);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fetchReviews(page + 1)}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;