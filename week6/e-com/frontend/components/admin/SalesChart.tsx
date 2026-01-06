'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesChartProps {
  orders: any[];
}

export default function SalesChart({ orders }: SalesChartProps) {
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');

  // Calculate sales data based on selected period
  const salesData = useMemo(() => {
    if (!orders || orders.length === 0) return null;

    const now = new Date();
    let periodData: { [key: string]: number } = {};
    let labels: string[] = [];

    if (activeTab === 'WEEKLY') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        periodData[key] = 0;
        labels.push(key);
      }
    } else if (activeTab === 'MONTHLY') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        periodData[key] = 0;
        labels.push(key);
      }
    } else if (activeTab === 'YEARLY') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        periodData[key] = 0;
        labels.push(key);
      }
    }

    // Aggregate orders by period
    orders.forEach((order: any) => {
      if (!order.createdAt || !order.totalAmount) return;
      
      const orderDate = new Date(order.createdAt);
      let key = '';

      if (activeTab === 'WEEKLY') {
        key = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        key = orderDate.toLocaleDateString('en-US', { month: 'short' });
      }

      if (periodData.hasOwnProperty(key)) {
        periodData[key] += order.totalAmount || 0;
      }
    });

    return {
      labels,
      values: labels.map(label => periodData[label] || 0),
    };
  }, [orders, activeTab]);

  // Chart.js configuration
  const chartData = {
    labels: salesData?.labels || [],
    datasets: [
      {
        label: 'Sales Revenue',
        data: salesData?.values || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          callback: function(context: any) {
            return `Revenue: PKR ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
          borderDash: [5, 5],
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return 'PKR ' + value.toLocaleString();
          },
        },
      },
    },
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Sale Graph</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('WEEKLY')}
              className={`px-4 py-2 text-sm rounded ${
                activeTab === 'WEEKLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              WEEKLY
            </button>
            <button
              onClick={() => setActiveTab('MONTHLY')}
              className={`px-4 py-2 text-sm rounded ${
                activeTab === 'MONTHLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setActiveTab('YEARLY')}
              className={`px-4 py-2 text-sm rounded ${
                activeTab === 'YEARLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              YEARLY
            </button>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">No any sell yet</p>
            <p className="text-gray-400 text-sm mt-2">Sales will appear here when orders are placed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Sale Graph</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('WEEKLY')}
            className={`px-4 py-2 text-sm rounded ${
              activeTab === 'WEEKLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            WEEKLY
          </button>
          <button
            onClick={() => setActiveTab('MONTHLY')}
            className={`px-4 py-2 text-sm rounded ${
              activeTab === 'MONTHLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setActiveTab('YEARLY')}
            className={`px-4 py-2 text-sm rounded ${
              activeTab === 'YEARLY' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            YEARLY
          </button>
        </div>
      </div>

      <div className="h-64">
        {salesData && salesData.values.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No sales data for this period</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different time period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}