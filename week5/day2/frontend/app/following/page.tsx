"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/axios";
import { Users, User, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FollowUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  followersCount: number;
}

export default function FollowingPage() {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      // Ensure token is set before making request
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get("/users/following");
      setFollowing(response.data);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await api.post(`/users/unfollow/${userId}`);
      setFollowing(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Failed to unfollow:", error);
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
      <div className="max-w-4xl mx-auto p-6 pt-8">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Following</h1>
            <p className="text-muted-foreground">
              You're following {following.length} users
            </p>
          </div>
        </div>

        {following.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Not following anyone yet</h3>
            <p className="text-muted-foreground mb-4">
              Start following users to see their activity in your feed
            </p>
            <Link href="/comments">
              <Button>Discover Users</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {following.map((followedUser) => (
              <div key={followedUser._id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    {followedUser.profilePicture ? (
                      <img 
                        src={followedUser.profilePicture} 
                        alt={followedUser.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-primary-foreground" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{followedUser.username}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{followedUser.email}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {followedUser.followersCount} followers
                  </p>
                  
                  <div className="flex space-x-2 w-full">
                    <Link href={`/profile/${followedUser.username}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleUnfollow(followedUser._id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}