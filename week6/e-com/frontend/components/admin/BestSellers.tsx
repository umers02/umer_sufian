interface BestSellersProps {
  products: Array<{
    name: string;
    price: number;
    originalPrice: number;
    sales: number;
  }>;
}

export default function BestSellers({ products }: BestSellersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Best Sellers</h3>
        <button className="text-gray-400">⋯</button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-500">₹{product.originalPrice}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{product.price}</p>
              <p className="text-sm text-gray-500">{product.sales} sales</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-medium">
        REPORT
      </button>
    </div>
  );
}