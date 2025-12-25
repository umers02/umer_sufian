import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { adminApi } from "../../services/admin.api";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/ui/Loader";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.getAnalytics();
      const stats = response.stats;

      setAnalytics({
        totalRevenue: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        totalUsers: stats.totalUsers,
        totalProducts: stats.totalProducts,
        lowStockProducts: stats.lowStockVariants?.length || 0,
        pendingOrders:
          stats.recentOrders?.filter((o) => o.status === "pending").length || 0,
      });

      setRecentOrders(stats.recentOrders || []);
    } catch {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 bg-red-100 p-4 rounded">{error}</div>;
  }

  return (
    <AdminLayout>
      {/* 🔥 Responsive padding */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isSuperAdmin ? "Superadmin Dashboard" : "Admin Dashboard"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {isSuperAdmin
              ? "Complete overview of your store"
              : "Manage products and orders"}
          </p>
        </div>

        {/* 🔥 Analytics Cards */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Revenue"
              value={formatPrice(analytics.totalRevenue)}
              icon={<DollarSign />}
            />
            <StatCard
              title="Orders"
              value={analytics.totalOrders}
              icon={<ShoppingCart />}
            />
            <StatCard
              title="Users"
              value={analytics.totalUsers}
              icon={<Users />}
            />
            <StatCard
              title="Products"
              value={analytics.totalProducts}
              icon={<Package />}
            />
          </div>
        )}

        {/* 🔥 Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            title="Products"
            count={analytics.totalProducts}
            subtitle="Total Products"
            onClick={() => navigate("/admin/products")}
            icon={<Package className="h-7 w-7" />}
          />

          <ActionCard
            title="Orders"
            count={analytics.totalOrders}
            subtitle="Total Orders"
            badge={analytics.pendingOrders}
            badgeText="pending"
            onClick={() => navigate("/admin/orders")}
            icon={<ShoppingCart className="h-7 w-7" />}
          />
        </div>

        {/* 🔥 Recent Orders */}
        {recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle>Recent Orders</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/admin/orders")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.user?.name} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="font-semibold text-sm">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-xl sm:text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  title,
  count,
  subtitle,
  icon,
  onClick,
  badge,
  badgeText,
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>

        {badge > 0 && (
          <p className="text-xs text-orange-600 mt-1">
            {badge} {badgeText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
