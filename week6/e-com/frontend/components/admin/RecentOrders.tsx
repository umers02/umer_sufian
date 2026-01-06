interface Order {
  id: string;
  product: string;
  date: string;
  customer: string;
  status: string;
  amount: number;
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button className="text-gray-400">⋯</button>
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Orders nahi hain</h3>
          <p className="text-gray-500">Jab customers order place karenge, woh yahan show honge</p>
        </div>

        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          © 2023 - pulstron Dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="text-gray-400">⋯</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 text-sm">{order.product}</td>
                <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                      {order.customer.charAt(0)}
                    </div>
                    <span className="text-sm">{order.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${
                      order.status === 'Delivered' 
                        ? 'bg-green-500' 
                        : order.status === 'Cancelled'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}></span>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">₹{order.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
        © 2023 - pulstron Dashboard
      </div>
    </div>
  );
}