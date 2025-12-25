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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search } from "lucide-react";
import { adminApi } from "../../services/admin.api";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/ui/Loader";
import AdminLayout from "../../components/layout/AdminLayout";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page: currentPage, limit: 10 };
      if (debouncedSearchTerm.trim() !== "")
        params.search = debouncedSearchTerm.trim();
      if (statusFilter.trim() !== "") params.status = statusFilter.trim();
      const response = await adminApi.getAllOrders(params);
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order number, ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer:{" "}
                        <span className="font-medium">
                          {order.user?.name || "Unknown"}
                        </span>{" "}
                        ({order.user?.email || "N/A"})
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b last:border-b-0 gap-2"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={
                              item.product?.images?.[0] || "/cineman-tea.jpg"
                            }
                            alt={item.product?.name || "Product"}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "/cineman-tea.jpg";
                            }}
                          />
                          <div>
                            <p className="font-medium">
                              {item.product?.name || "Unknown Product"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.variant?.name ||
                                item.variant?.size ||
                                "Standard"}{" "}
                              × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {formatPrice(
                            (item.price || 0) * (item.quantity || 0)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-2">
                    <div className="flex justify-between w-full sm:w-auto">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between w-full sm:w-auto">
                      <span>Shipping:</span>
                      <span>{formatPrice(order.shippingCost || 0)}</span>
                    </div>
                    <div className="flex justify-between w-full sm:w-auto font-bold text-lg border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span>Total:</span>
                      <span>
                        {formatPrice(order.total || order.totalAmount || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {order.shippingAddress.fullName && (
                          <p>{order.shippingAddress.fullName}</p>
                        )}
                        {(order.shippingAddress.address ||
                          order.shippingAddress.street) && (
                          <p>
                            {order.shippingAddress.address ||
                              order.shippingAddress.street}
                          </p>
                        )}
                        {order.shippingAddress.city && (
                          <p>
                            {order.shippingAddress.city}
                            {order.shippingAddress.postalCode &&
                              `, ${order.shippingAddress.postalCode}`}
                            {order.shippingAddress.zipCode &&
                              `, ${order.shippingAddress.zipCode}`}
                            {order.shippingAddress.state &&
                              `, ${order.shippingAddress.state}`}
                          </p>
                        )}
                        {order.shippingAddress.country && (
                          <p>{order.shippingAddress.country}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  {order.paymentMethod && (
                    <div>
                      <h4 className="font-semibold mb-2">
                        Payment Information
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Method: {order.paymentMethod}</p>
                        {order.paymentStatus && (
                          <p>
                            Status:{" "}
                            <span className="font-medium">
                              {order.paymentStatus}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
