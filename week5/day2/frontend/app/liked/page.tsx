"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/axios";
import { CommentCard } from "@/components/comments/CommentCard";
import { Heart } from "lucide-react";

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

export default function LikedPage() {
  const [likedComments, setLikedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLikedComments();
  }, []);

  const fetchLikedComments = async () => {
    try {
      // Ensure token is set before making request
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get("/users/liked-comments");
      setLikedComments(response.data);
    } catch (error) {
      console.error("Failed to fetch liked comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      fetchLikedComments(); // Refresh to get updated likes
    } catch (error) {
      console.error("Failed to like comment:", error);
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
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Liked Comments</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Comments you've liked ({likedComments.length})
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {likedComments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No liked comments yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Start liking comments to see them here
              </p>
            </div>
          ) : (
            likedComments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}