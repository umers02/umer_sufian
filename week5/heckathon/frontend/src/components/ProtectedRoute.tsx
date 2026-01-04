"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  console.log("🟡 ProtectedRoute render");
  const [mounted, setMounted] = useState(false);
  console.log("mounted:", mounted);
console.log("isHydrated:", isHydrated);
console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // redirect ONLY when hydration + mount complete
    if (mounted && isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isHydrated, isAuthenticated, router]);

  // ⛔ wait until auth state is fully ready
  if (!mounted || !isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // ⛔ DO NOT render null before redirect completes
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
