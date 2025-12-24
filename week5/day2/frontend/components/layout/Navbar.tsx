"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, MessageCircle, User, LogOut, Menu, X, Home, Heart, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthPage = pathname?.startsWith('/auth');

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            SocialComments
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {!isAuthPage && (
              user ? (
                <>
                  <Link href="/notifications">
                    <Button variant="ghost" size="sm">
                      <Bell className="w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Link href="/comments">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Link href={`/profile/${user.username}`}>
                    <Button variant="ghost" size="sm">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {!isAuthPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && !isAuthPage && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Home className="w-5 h-5 mr-3" />
                      Home
                    </Button>
                  </Link>
                  
                  <Link href="/comments" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Comments
                    </Button>
                  </Link>
                  
                  <Link href="/notifications" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Bell className="w-5 h-5 mr-3" />
                      Notifications
                    </Button>
                  </Link>
                  
                  <Link href="/liked" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Heart className="w-5 h-5 mr-3" />
                      Liked
                    </Button>
                  </Link>
                  
                  <Link href="/following" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Users className="w-5 h-5 mr-3" />
                      Following
                    </Button>
                  </Link>
                  
                  <Link href={`/profile/${user.username}`} className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </Button>
                  </Link>
                  
                  <Link href="/settings" className="block">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}