import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Search, UserCheck, UserX, Shield } from "lucide-react";
import { adminApi } from "../../services/admin.api";
import Loader from "../../components/ui/Loader";
import AdminLayout from "../../components/layout/AdminLayout";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10, search: searchTerm };
      const response = await adminApi.getUsers(params);
      setUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminApi.blockUser(userId);
      fetchUsers();
    } catch (error) {
      setError(
        "Failed to block user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminApi.unblockUser(userId);
      fetchUsers();
    } catch (error) {
      setError(
        "Failed to unblock user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isBlocked) => {
    return isBlocked
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Manage Users
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            View and manage user accounts
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg w-full"
                  >
                    {/* Avatar & Basic Info */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 lg:flex-initial">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-lg font-semibold text-gray-600">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Badges & Stats */}
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                      <Badge className={`${getRoleColor(user.role)} text-xs`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                      <Badge
                        className={`${getStatusColor(user.isBlocked)} text-xs`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                      <div className="text-center px-2">
                        <p className="text-xs sm:text-sm font-medium">
                          {user.orderCount || 0}
                        </p>
                        <p className="text-xs text-gray-600">Orders</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:ml-auto">
                      {user.isBlocked ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockUser(user._id)}
                          className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Unblock</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockUser(user._id)}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm flex-1 sm:flex-initial"
                          disabled={user.role === "superadmin"}
                        >
                          <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Block</span>
                          <span className="sm:hidden">✕</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
