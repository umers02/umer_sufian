import { Comment } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CommentCardProps {
  comment: Comment;
  isOwn?: boolean;
  currentUsername?: string;
  onReply?: (parentId: string, parentUsername: string) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  level?: number;
}

export default function CommentCard({ comment, isOwn = false, currentUsername, onReply, onDelete, onLike, level = 0 }: CommentCardProps) {
  const own = isOwn || (currentUsername ? comment.username === currentUsername : false);
  const liked = currentUsername ? (comment.likedBy || []).includes(currentUsername) : false;

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment.id, comment.username);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (confirm('Delete this comment? This will also delete all replies.')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="w-full">
      {/* Main Comment */}
      <div className={`comment-card border-b border-gray-100 last:border-b-0 ${
        level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''
      }`}>
        <div className="flex items-start space-x-3">
          <img
            src={comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=random&size=40`}
            alt={comment.username}
            className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-sm text-gray-900 hover:text-primary-600 cursor-pointer">
                {comment.username}
              </h4>
              {own && (
                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Author
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.timestamp))}
              </span>
            </div>
            
            <p className="text-gray-800 text-sm leading-relaxed break-words mb-3">
              {comment.message}
            </p>
            
            {/* Comment Actions */}
            <div className="flex items-center space-x-6 text-gray-500">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                  liked ? 'text-red-500' : ''
                }`}
              >
                <Heart size={16} className={liked ? 'fill-current' : ''} />
                <span className="text-xs font-medium">{comment.likes || 0}</span>
              </button>
              
              <button 
                onClick={handleReply}
                className="flex items-center space-x-1 hover:text-primary-500 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="text-xs font-medium">Reply</span>
              </button>

              {own && (
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                  <span className="text-xs font-medium">Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-0">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              currentUsername={currentUsername}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}