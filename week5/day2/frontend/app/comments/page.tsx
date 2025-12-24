"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/axios";
import { CommentCard } from "@/components/comments/CommentCard";
import { ReplyBox } from "@/components/comments/ReplyBox";
import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  likes: string[];
  likesCount: number;
  replies: Comment[];
  createdAt: string;
  parentId?: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCommentBox, setShowNewCommentBox] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      console.log('Refreshing comments due to socket event');
      fetchComments();
    };

    window.addEventListener("refreshComments", handleRefresh);
    return () => window.removeEventListener("refreshComments", handleRefresh);
  }, []);

  const fetchComments = async () => {
    try {
      // Ensure token is set before making request
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get("/comments");
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewComment = async (content: string) => {
    try {
      const response = await api.post("/comments", { content });
      setComments(prev => [response.data, ...prev]);
      setShowNewCommentBox(false);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    try {
      const response = await api.post(`/comments/reply`, { 
        parentCommentId: commentId, 
        content 
      });
      fetchComments();
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      // Use PATCH instead of PUT
      await api.patch(`/comments/${commentId}`, { content });
      fetchComments();
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Comments</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Join the conversation</p>
            </div>
          </div>
          
          <Button onClick={() => setShowNewCommentBox(!showNewCommentBox)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Comment
          </Button>
        </div>

        {showNewCommentBox && (
          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border mb-6">
            <h3 className="font-semibold mb-4">Share your thoughts</h3>
            <ReplyBox 
              onSubmit={handleNewComment} 
              placeholder="What's on your mind?"
            />
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No comments yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">Be the first to start a conversation!</p>
              <Button onClick={() => setShowNewCommentBox(true)} className="w-full sm:w-auto">
                Write the first comment
              </Button>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}