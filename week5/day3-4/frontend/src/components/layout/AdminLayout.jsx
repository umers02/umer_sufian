import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ...(user?.role === "superadmin"
      ? [{ name: "Users", href: "/admin/users", icon: Users }]
      : []),
  ];

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Admin Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-8 sm:h-8"
              >
                <mask
                  id="mask0_166_115"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="48"
                  height="48"
                >
                  <rect width="48" height="48" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_166_115)">
                  <path
                    d="M22 42V26.05C19.8667 26.05 17.8167 25.6413 15.85 24.824C13.8833 24.008 12.15 22.85 10.65 21.35C9.15 19.85 8 18.1167 7.2 16.15C6.4 14.1833 6 12.1333 6 10V6H10C12.1 6 14.1333 6.408 16.1 7.224C18.0667 8.04133 19.8 9.2 21.3 10.7C22.3333 11.7333 23.192 12.8667 23.876 14.1C24.5587 15.3333 25.0833 16.65 25.45 18.05C25.6167 17.8167 25.8 17.592 26 17.376C26.2 17.1587 26.4167 16.9333 26.65 16.7C28.15 15.2 29.8833 14.0413 31.85 13.224C33.8167 12.408 35.8667 12 38 12H42V16C42 18.1333 41.592 20.1833 40.776 22.15C39.9587 24.1167 38.8 25.85 37.3 27.35C35.8 28.85 34.0747 30 32.124 30.8C30.1747 31.6 28.1333 32 26 32V42H22Z"
                    fill="#1C1B1F"
                  />
                </g>
              </svg>
              <span
                className="text-gray-900 text-sm sm:text-base lg:text-lg"
                style={{
                  fontFamily: "Prosto One",
                  fontWeight: 400,
                  letterSpacing: "0.1px",
                }}
              >
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </span>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0
        `}
        >
          <nav className="px-3 sm:px-4 pb-4 pt-4">
            <div className="space-y-1 sm:space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-3 sm:p-4 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
