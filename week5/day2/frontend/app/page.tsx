"use client";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { MessageCircle, Users, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Stay connected with real-time comments and notifications</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Comments</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Join conversations</p>
              </div>
            </div>
            <Link href="/comments">
              <Button className="w-full" size="sm">View Comments</Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Following</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.followingCount} users</p>
              </div>
            </div>
            <Link href="/following">
              <Button variant="outline" className="w-full" size="sm">Manage Following</Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Followers</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.followersCount} followers</p>
              </div>
            </div>
            <Link href={`/profile/${user?.username}`}>
              <Button variant="outline" className="w-full" size="sm">View Profile</Button>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Stay up to date with the latest comments and interactions from your network.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/comments" className="flex-1">
              <Button className="w-full" size="sm">Browse Comments</Button>
            </Link>
            <Link href="/notifications" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">View Notifications</Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}