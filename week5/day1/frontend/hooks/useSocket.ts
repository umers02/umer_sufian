import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Comment } from '@/types';
import toast from 'react-hot-toast';

export const useSocket = (username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join', username);
      toast.success('Connected to chat!', {
        icon: '🟢',
        className: 'toast-notification'
      });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from chat', {
        icon: '🔴',
        className: 'toast-notification'
      });
    });

    socketInstance.on('existing_comments', (existingComments: Comment[]) => {
      setComments(existingComments);
    });

    socketInstance.on('new_comment', (comment: Comment) => {
      setComments(prev => {
        // Get fresh comments from server to maintain tree structure
        socketInstance.emit('get_comments');
        return prev;
      });
      toast.success(`New comment from ${comment.username}`, {
        icon: '💬',
        className: 'toast-notification'
      });
    });

    socketInstance.on('comment_added', (comment: Comment) => {
      // Get fresh comments from server to maintain tree structure
      socketInstance.emit('get_comments');
    });

    socketInstance.on('comment_deleted', () => {
      socketInstance.emit('get_comments');
      toast.success('Comment deleted', {
        icon: '🗑️',
        className: 'toast-notification'
      });
    });

    socketInstance.on('user_count', (count: number) => {
      setUserCount(count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [username]);

  const sendComment = (message: string, parentId?: string) => {
    if (socket && message.trim()) {
      socket.emit('add_comment', { username, message: message.trim(), parentId });
    }
  };

  const deleteComment = (commentId: string) => {
    if (socket) {
      socket.emit('delete_comment', { commentId, username });
    }
  };

  const likeComment = (commentId: string) => {
    if (socket) {
      socket.emit('like_comment', { commentId, username });
    }
  };

  return {
    socket,
    comments,
    userCount,
    isConnected,
    sendComment,
    deleteComment,
    likeComment
  }; 
};