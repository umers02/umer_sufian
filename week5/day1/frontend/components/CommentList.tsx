import { useEffect, useRef } from 'react';
import { Comment } from '@/types';
import CommentCard from './CommentCard';

interface CommentListProps {
  comments: Comment[];
  currentUsername: string;
  onReply?: (parentId: string, parentUsername: string) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
}

export default function CommentList({ comments, currentUsername, onReply, onDelete, onLike }: CommentListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  if (comments.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <p>No comments yet. Be the first to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto scroll-smooth"
    >
      <div className="divide-y divide-gray-100">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isOwn={comment.username === currentUsername}
            currentUsername={currentUsername}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}