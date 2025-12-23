'use client';

import { useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Header from '@/components/Header';
import CommentList from '@/components/CommentList';
import CommentInput from '@/components/CommentInput';
import UsernameModal from '@/components/UsernameModal';

export default function Home() {
  const [username, setUsername] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const { comments, userCount, isConnected, sendComment, deleteComment, likeComment } = useSocket(username);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleReply = (parentId: string, parentUsername: string) => {
    setReplyTo({ id: parentId, username: parentUsername });
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleSendComment = (message: string, parentId?: string) => {
    sendComment(message, parentId);
    setReplyTo(null);
  };

  const handleDelete = (id: string) => {
    deleteComment(id);
  };

  const handleLike = (id: string) => {
    likeComment(id);
  };

  if (!username) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-sm min-h-screen flex flex-col">
        <Header 
          isConnected={isConnected}
          userCount={userCount}
          username={username}
        />
        
        {/* Post Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://ui-avatars.com/api/?name=Post&background=random&size=48"
              alt="Post author"
              className="w-12 h-12 rounded-full ring-2 ring-gray-100"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Sample Post</h3>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <p className="mt-3 text-gray-800 leading-relaxed">
            This is a sample social media post. Users can comment below and interact in real-time! 🚀
          </p>
        </div>
        
        {/* Comments Section */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 text-sm">
              Comments ({comments.length})
            </h4>
          </div>
          
          <CommentList 
            comments={comments}
            currentUsername={username}
            onReply={handleReply}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        </div>
        
        <CommentInput 
          onSendComment={handleSendComment}
          disabled={!isConnected}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
        />
      </div>
    </div>
  );
}