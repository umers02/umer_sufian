"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, 
  MessageCircle, 
  Bell, 
  User, 
  Settings,
  Users,
  Heart,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Comments", href: "/comments", icon: MessageCircle },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Following", href: "/following", icon: Users },
  { name: "Liked", href: "/liked", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user || pathname?.startsWith('/auth')) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const href = item.href === "/profile" ? `/profile/${user.username}` : item.href;
            const isActive = pathname === href;
            
            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Show on large screens */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:bg-card lg:border-r lg:border-border lg:p-4 lg:block">
        <SidebarContent />
      </aside>
    </>
  );
}