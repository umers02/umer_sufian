'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import SalesChart from '@/components/admin/SalesChart';
import BestSellers from '@/components/admin/BestSellers';
import RecentOrders from '@/components/admin/RecentOrders';

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue?: number;
  activeOrders?: number;
  completedOrders?: number;
  cancelledOrders?: number;
  activeSales: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: { value: 0, change: 0 },
    activeOrders: { value: 0, change: 0 },
    completedOrders: { value: 0, change: 0 },
    returnOrders: { value: 0, change: 0 }
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await fetch('http://localhost:4000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data: DashboardData = result.data || result;
        
        // Use stats from backend or calculate from orders
        const totalRevenue = data.totalRevenue || 0;
        const activeOrders = data.activeOrders || 0;
        const completedOrders = data.completedOrders || 0;
        const cancelledOrders = data.cancelledOrders || 0;

        setStats({
          totalOrders: { value: totalRevenue, change: 0 },
          activeOrders: { value: activeOrders, change: 0 },
          completedOrders: { value: completedOrders, change: 0 },
          returnOrders: { value: cancelledOrders, change: 0 }
        });

        // Transform recent orders for display
        const transformedOrders = (data.recentOrders || []).slice(0, 10).map((order: any) => ({
          id: `#${order._id?.slice(-5).toUpperCase() || 'N/A'}`,
          product: order.items && order.items.length > 0 
            ? order.items[0].product?.name || 'Product'
            : 'N/A',
          date: formatDate(order.createdAt),
          customer: order.user?.name || 'Unknown',
          status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending',
          amount: order.totalAmount || 0
        }));

        setOrders(transformedOrders);

        // Calculate best sellers from all orders (need to fetch all orders for this)
        // For now, use recent orders
        const allOrdersForBestSellers = data.recentOrders || [];
        const productSales: { [key: string]: { name: string; sales: number; price: number; originalPrice: number } } = {};
        
        allOrdersForBestSellers.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const productId = item.product?._id || item.product;
              const productName = item.product?.name || 'Unknown Product';
              const productPrice = item.price || item.product?.price || 0;
              
              if (productSales[productId]) {
                productSales[productId].sales += item.quantity || 1;
              } else {
                productSales[productId] = {
                  name: productName,
                  sales: item.quantity || 1,
                  price: productPrice,
                  originalPrice: productPrice
                };
              }
            });
          }
        });

        // Sort by sales and get top 3
        const topSellers = Object.values(productSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 3);

        setBestSellers(topSellers);
        
        // Store all orders for SalesChart (need to fetch all orders)
        // For now, we'll fetch all orders separately for the chart
        try {
          const allOrdersResponse = await fetch('http://localhost:4000/api/orders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (allOrdersResponse.ok) {
            const allOrdersResult = await allOrdersResponse.json();
            const allOrdersData = allOrdersResult.data || allOrdersResult;
            setAllOrders(Array.isArray(allOrdersData) ? allOrdersData : []);
          }
        } catch (ordersError) {
          console.error('Error fetching all orders:', ordersError);
          setAllOrders([]);
        }
      } else {
        const errorText = await response.text();
        console.error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`, errorText);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    return `${month} ${day}${suffix}, ${year}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg border p-12 text-center">
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <nav className="text-sm text-gray-500">
              Home &gt; Dashboard
            </nav>
          </div>

          <div className="mb-6 flex justify-end">
            <div className="bg-white px-4 py-2 rounded-lg border text-sm">
              📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <SalesChart orders={allOrders} />
            </div>
            <div className="lg:col-span-1">
              <BestSellers products={bestSellers} />
            </div>
          </div>

          <RecentOrders orders={orders} />
        </main>
      </div>
    </div>
  );
}