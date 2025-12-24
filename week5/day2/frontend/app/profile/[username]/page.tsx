"use client";

import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/axios";
import { useState, useEffect, use } from "react";
import { User, Users, MessageCircle, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  commentsCount: number;
  likesReceived: number;
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, [resolvedParams.username]);

  const { socket } = useSocket();
  
  useEffect(() => {
    // Listen for socket events to update comment count
    const handleNewComment = (comment: any) => {
      console.log('New comment received:', comment);
      if (profile && user && comment.author._id === user.id) {
        console.log('Updating comment count for own comment');
        setProfile(prev => prev ? {...prev, commentsCount: (prev.commentsCount || 0) + 1} : null);
      }
    };
    
    if (socket) {
      socket.on('new_comment', handleNewComment);
      return () => {
        socket.off('new_comment', handleNewComment);
      };
    }
  }, [socket, profile?._id, user?.id]);

  const fetchProfile = async () => {
    try {
      // Ensure token is set before making request
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get(`/users/profile/${resolvedParams.username}`);
      setProfile(response.data);
      
      if (user && response.data._id !== user.id) {
        try {
          const followResponse = await api.get(`/followers/is-following/${response.data._id}`);
          setIsFollowing(followResponse.data.isFollowing);
        } catch (followError) {
          console.log("Follow status check failed, defaulting to false");
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      if (isFollowing) {
        await api.delete(`/followers/unfollow/${profile._id}`);
        setProfile(prev => prev ? {...prev, followersCount: prev.followersCount - 1} : null);
      } else {
        await api.post(`/followers/follow/${profile._id}`);
        setProfile(prev => prev ? {...prev, followersCount: prev.followersCount + 1} : null);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
      fetchProfile(); // Fallback to refresh
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isOwnProfile = user && profile && (user.id === profile._id || user.username === profile.username);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 pt-8">
        <div className="bg-card rounded-lg border border-border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              {profile.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt={profile.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-primary-foreground" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h1 className="text-3xl font-bold mb-2 md:mb-0">{profile.username}</h1>
                {isOwnProfile ? (
                  <Link href="/settings">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
              
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <div className="font-bold text-xl">{profile.commentsCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{profile.followersCount}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{profile.followingCount}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Recent Comments</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.commentsCount > 0 
                ? `${profile.username} has shared ${profile.commentsCount} comments`
                : "No comments yet"
              }
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Network</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Following {profile.followingCount} users with {profile.followersCount} followers
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}