import { useState } from 'react';
import { Button } from '../ui/button';

const SimpleReplyForm = ({ reviewId, onReplySubmitted, onCancel }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to reply');
      return;
    }

    if (!content.trim()) {
      setError('Please write a reply');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/reviews/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          content,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Reply submitted successfully:', result);
        setContent('');
        setError('');
        // Force immediate refresh
        setTimeout(() => {
          onReplySubmitted?.();
        }, 100);
      } else {
        const errorData = await response.text();
        console.error('Reply submission failed:', response.status, errorData);
        setError('Failed to submit reply');
      }
    } catch (error) {
      console.error('Reply submission error:', error);
      setError('Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        className="w-full p-3 border rounded-md min-h-[80px] text-sm"
        rows={3}
      />
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          size="sm"
        >
          {isSubmitting ? 'Submitting...' : 'Reply'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setContent('');
            setError('');
            onCancel?.();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SimpleReplyForm;