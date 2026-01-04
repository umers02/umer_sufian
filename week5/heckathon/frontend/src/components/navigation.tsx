"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";
import { NotificationCenter } from "@/components/NotificationCenter";

export function Navigation() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/car-deposit%20Logo.png"
              alt="Car Deposit logo"
              className="object-contain h-8 sm:h-10"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                pathname === "/" ? "font-bold text-[#4A5FBF]" : "font-medium"
              }`}
            >
              Home
            </Link>
            <Link
              href="/car-auction"
              className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                pathname === "/car-auction" ? "font-bold text-[#4A5FBF]" : ""
              }`}
            >
              Car Auction
            </Link>
            <Link
              href="/sell-your-car"
              className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                pathname === "/sell-your-car" ? "font-bold text-[#4A5FBF]" : ""
              }`}
            >
              Sell Your Car
            </Link>
            <Link
              href="/about"
              className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                pathname === "/about" ? "font-bold text-[#4A5FBF]" : ""
              }`}
            >
              About us
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                pathname === "/contact" ? "font-bold text-[#4A5FBF]" : ""
              }`}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/profile"
                  className={`text-gray-700 hover:text-[#4A5FBF] transition-colors ${
                    pathname === "/profile" ? "font-bold text-[#4A5FBF]" : ""
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-[#4A5FBF] font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Desktop icons */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            <svg
              width="20"
              height="19"
              viewBox="0 0 22 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 lg:w-6 lg:h-6"
            >
              <path
                d="M20.5634 7.3L14.5134 6.775L12.1509 1.2125C11.7259 0.2 10.2759 0.2 9.85088 1.2125L7.48838 6.7875L1.45088 7.3C0.350884 7.3875 -0.0991158 8.7625 0.738384 9.4875L5.32588 13.4625L3.95088 19.3625C3.70088 20.4375 4.86338 21.2875 5.81338 20.7125L11.0009 17.5875L16.1884 20.725C17.1384 21.3 18.3009 20.45 18.0509 19.375L16.6759 13.4625L21.2634 9.4875C22.1009 8.7625 21.6634 7.3875 20.5634 7.3ZM11.0009 15.25L6.30088 18.0875L7.55088 12.7375L3.40088 9.1375L8.87588 8.6625L11.0009 3.625L13.1384 8.675L18.6134 9.15L14.4634 12.75L15.7134 18.1L11.0009 15.25Z"
                fill="#2E3D83"
              />
            </svg>
            <NotificationCenter />
            <svg
              width="30"
              height="30"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 lg:w-8 lg:h-8"
            >
              <path
                d="M27.5917 8.76454C27.3 7.90413 26.4833 7.29163 25.5208 7.29163H9.47917C8.51667 7.29163 7.71458 7.90413 7.40833 8.76454L4.53542 17.0333C4.43333 17.3395 4.375 17.6604 4.375 17.9958V28.4375C4.375 29.6479 5.35208 30.625 6.5625 30.625C7.77292 30.625 8.75 29.6479 8.75 28.4375V27.7083H26.25V28.4375C26.25 29.6333 27.2271 30.625 28.4375 30.625C29.6333 30.625 30.625 29.6479 30.625 28.4375V17.9958C30.625 17.675 30.5667 17.3395 30.4646 17.0333L27.5917 8.76454ZM9.47917 23.3333C8.26875 23.3333 7.29167 22.3562 7.29167 21.1458C7.29167 19.9354 8.26875 18.9583 9.47917 18.9583C10.6896 18.9583 11.6667 19.9354 11.6667 21.1458C11.6667 22.3562 10.6896 23.3333 9.47917 23.3333ZM25.5208 23.3333C24.3104 23.3333 23.3333 22.3562 23.3333 21.1458C23.3333 19.9354 24.3104 18.9583 25.5208 18.9583C26.7313 18.9583 27.7083 19.9354 27.7083 21.1458C27.7083 22.3562 26.7313 23.3333 25.5208 23.3333ZM7.29167 16.0416L9.14375 10.4708C9.34792 9.88746 9.90208 9.47913 10.5292 9.47913H24.4708C25.0979 9.47913 25.6521 9.88746 25.8563 10.4708L27.7083 16.0416H7.29167Z"
                fill="#2E3D83"
              />
            </svg>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-[#4A5FBF] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                  pathname === "/" ? "font-bold text-[#4A5FBF]" : "font-medium"
                }`}
              >
                Home
              </Link>
              <Link
                href="/car-auction"
                onClick={closeMobileMenu}
                className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                  pathname === "/car-auction" ? "font-bold text-[#4A5FBF]" : ""
                }`}
              >
                Car Auction
              </Link>
              <Link
                href="/sell-your-car"
                onClick={closeMobileMenu}
                className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                  pathname === "/sell-your-car" ? "font-bold text-[#4A5FBF]" : ""
                }`}
              >
                Sell Your Car
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                  pathname === "/about" ? "font-bold text-[#4A5FBF]" : ""
                }`}
              >
                About us
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                  pathname === "/contact" ? "font-bold text-[#4A5FBF]" : ""
                }`}
              >
                Contact
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`text-gray-700 hover:text-[#4A5FBF] transition-colors px-2 py-1 ${
                      pathname === "/profile" ? "font-bold text-[#4A5FBF]" : ""
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="text-gray-700 hover:text-[#4A5FBF] font-medium transition-colors text-left px-2 py-1"
                  >
                    Logout
                  </button>
                </>
              )}
              
              {/* Mobile icons */}
              <div className="flex items-center gap-4 px-2 pt-2 border-t border-gray-100 mt-4">
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5634 7.3L14.5134 6.775L12.1509 1.2125C11.7259 0.2 10.2759 0.2 9.85088 1.2125L7.48838 6.7875L1.45088 7.3C0.350884 7.3875 -0.0991158 8.7625 0.738384 9.4875L5.32588 13.4625L3.95088 19.3625C3.70088 20.4375 4.86338 21.2875 5.81338 20.7125L11.0009 17.5875L16.1884 20.725C17.1384 21.3 18.3009 20.45 18.0509 19.375L16.6759 13.4625L21.2634 9.4875C22.1009 8.7625 21.6634 7.3875 20.5634 7.3ZM11.0009 15.25L6.30088 18.0875L7.55088 12.7375L3.40088 9.1375L8.87588 8.6625L11.0009 3.625L13.1384 8.675L18.6134 9.15L14.4634 12.75L15.7134 18.1L11.0009 15.25Z"
                    fill="#2E3D83"
                  />
                </svg>
                <NotificationCenter />
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 35 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.5917 8.76454C27.3 7.90413 26.4833 7.29163 25.5208 7.29163H9.47917C8.51667 7.29163 7.71458 7.90413 7.40833 8.76454L4.53542 17.0333C4.43333 17.3395 4.375 17.6604 4.375 17.9958V28.4375C4.375 29.6479 5.35208 30.625 6.5625 30.625C7.77292 30.625 8.75 29.6479 8.75 28.4375V27.7083H26.25V28.4375C26.25 29.6333 27.2271 30.625 28.4375 30.625C29.6333 30.625 30.625 29.6479 30.625 28.4375V17.9958C30.625 17.675 30.5667 17.3395 30.4646 17.0333L27.5917 8.76454ZM9.47917 23.3333C8.26875 23.3333 7.29167 22.3562 7.29167 21.1458C7.29167 19.9354 8.26875 18.9583 9.47917 18.9583C10.6896 18.9583 11.6667 19.9354 11.6667 21.1458C11.6667 22.3562 10.6896 23.3333 9.47917 23.3333ZM25.5208 23.3333C24.3104 23.3333 23.3333 22.3562 23.3333 21.1458C23.3333 19.9354 24.3104 18.9583 25.5208 18.9583C26.7313 18.9583 27.7083 19.9354 27.7083 21.1458C27.7083 22.3562 26.7313 23.3333 25.5208 23.3333ZM7.29167 16.0416L9.14375 10.4708C9.34792 9.88746 9.90208 9.47913 10.5292 9.47913H24.4708C25.0979 9.47913 25.6521 9.88746 25.8563 10.4708L27.7083 16.0416H7.29167Z"
                    fill="#2E3D83"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
