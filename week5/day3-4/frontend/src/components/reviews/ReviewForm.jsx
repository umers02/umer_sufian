import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { useAuth } from '../../hooks/useAuth';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    console.log('Auth not available');
  }
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!content.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          content,
        }),
      });

      if (response.ok) {
        setRating(0);
        setContent('');
        onReviewSubmitted?.();
      } else {
        setError('Failed to submit review');
      }
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please login to write a review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Review</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Share your experience with this product..."
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !content.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;