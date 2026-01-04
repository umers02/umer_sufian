import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';
import MentionInput from '../ui/MentionInput';

const SimpleReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const extractMentions = async (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1];
      try {
        const response = await fetch(`http://localhost:8000/users/search?q=${encodeURIComponent(mentionedName)}`);
        const users = await response.json();
        const user = users.find(u => u.name.replace(/\s+/g, '') === mentionedName);
        if (user) {
          mentions.push(user._id);
        }
      } catch (error) {
        console.error('Failed to resolve mention:', error);
      }
    }
    
    return mentions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
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
      const mentions = await extractMentions(content);
      
      const response = await fetch('http://localhost:8000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          content,
          mentions,
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
            <label className="block text-sm font-medium mb-2">
              Review <span className="text-gray-500 text-xs">(Type @username to mention someone)</span>
            </label>
            <MentionInput
              value={content}
              onChange={setContent}
              placeholder="Share your experience with this product... (Type @username to mention someone)"
              className="w-full p-3 border rounded-md min-h-[100px] resize-none"
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

export default SimpleReviewForm;