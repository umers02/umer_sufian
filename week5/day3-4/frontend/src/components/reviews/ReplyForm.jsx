import { useState } from 'react';
import { Button } from '../ui/button';
import RichTextEditor from './RichTextEditor';
import { useAuth } from '../../hooks/useAuth';

const ReplyForm = ({ reviewId, onReplySubmitted }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    console.log('Auth not available');
  }
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/reviews/reply', {
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
        setContent('');
        onReplySubmitted?.();
      } else {
        setError('Failed to submit reply');
      }
    } catch (error) {
      setError('Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Write your reply..."
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
          onClick={() => onReplySubmitted?.()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;