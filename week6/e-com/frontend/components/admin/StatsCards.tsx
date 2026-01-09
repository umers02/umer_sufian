interface StatsCardsProps {
  stats: {
    totalOrders: { value: number; change: number };
    activeOrders: { value: number; change: number };
    completedOrders: { value: number; change: number };
    returnOrders: { value: number; change: number };
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { 
      title: 'Total Revenue', 
      value: stats.totalOrders.value, 
      change: stats.totalOrders.change, 
      icon: '🛍️',
      showCurrency: true 
    },
    { 
      title: 'Active Orders', 
      value: stats.activeOrders.value, 
      change: stats.activeOrders.change, 
      icon: '📦',
      showCurrency: false 
    },
    { 
      title: 'Completed Orders', 
      value: stats.completedOrders.value, 
      change: stats.completedOrders.change, 
      icon: '✅',
      showCurrency: false 
    },
    { 
      title: 'Cancelled Orders', 
      value: stats.returnOrders.value, 
      change: stats.returnOrders.change, 
      icon: '↩️',
      showCurrency: false 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-4 lg:p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</h3>
            <button className="text-gray-400">⋯</button>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl lg:text-2xl">{card.icon}</span>
            <span className="text-lg lg:text-2xl font-bold">
              {card.showCurrency ? `PKR ${card.value.toLocaleString()}` : card.value.toLocaleString()}
            </span>
          </div>
          
          {card.change > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-xs lg:text-sm">↗ {card.change}%</span>
              <span className="text-gray-500 text-xs lg:text-sm">vs last month</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}