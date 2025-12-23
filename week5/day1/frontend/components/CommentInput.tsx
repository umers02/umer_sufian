import { useState } from 'react';
import { Send, Smile, Image, AtSign, X } from 'lucide-react';

interface CommentInputProps {
  onSendComment: (message: string, parentId?: string) => void;
  disabled?: boolean;
  replyTo?: { id: string; username: string } | null;
  onCancelReply?: () => void;
}

export default function CommentInput({ onSendComment, disabled = false, replyTo, onCancelReply }: CommentInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendComment(message, replyTo?.id);
      setMessage('');
      if (onCancelReply) onCancelReply();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Reply Indicator */}
      {replyTo && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Replying to <span className="font-medium text-primary-600">@{replyTo.username}</span>
          </span>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src="https://ui-avatars.com/api/?name=You&background=6366f1&color=fff&size=40"
            alt="Your avatar"
            className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Write a comment..."}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 hover:bg-white focus:bg-white"
                disabled={disabled}
                maxLength={500}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Comment Actions */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors text-sm"
                >
                  <Smile size={16} />
                  <span>Emoji</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors text-sm"
                >
                  <Image size={16} />
                  <span>Photo</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors text-sm"
                >
                  <AtSign size={16} />
                  <span>Mention</span>
                </button>
              </div>
              <span className="text-xs text-gray-400">{message.length}/500</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}