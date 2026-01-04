import { useState } from 'react';
import { Button } from '../ui/button';
import MentionInput from '../ui/MentionInput';

const SimpleReplyForm = ({ reviewId, onReplySubmitted, onCancel }) => {
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
      const mentions = await extractMentions(content);
      
      const response = await fetch('http://localhost:8000/reviews/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          content,
          mentions,
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
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-600">
          Reply <span className="text-xs">(Type @username to mention)</span>
        </label>
        <MentionInput
          value={content}
          onChange={setContent}
          placeholder="Write your reply... (Type @username to mention someone)"
          className="w-full p-3 border rounded-md min-h-[80px] text-sm resize-none"
        />
      </div>
      
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