import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
  image: string;
  title: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  id?: string;
  pointsPrice?: number;
  type?: 'regular' | 'loyalty_only' | 'hybrid';
}

export default function ProductCard({ 
  image, 
  title, 
  rating, 
  price, 
  originalPrice, 
  discount,
  id = '1',
  pointsPrice,
  type = 'regular'
}: ProductCardProps) {
  const { user } = useAuth();
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const renderPrice = () => {
    if (type === 'loyalty_only' && pointsPrice) {
      return (
        <div className="text-center">
          <span className="text-xl font-bold text-purple-600">{pointsPrice} Points</span>
          <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-1 inline-block">
            Points Only
          </div>
        </div>
      );
    }
    
    if (type === 'hybrid' && pointsPrice) {
      return (
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <span className="text-xl font-bold">${price}</span>
            {originalPrice && (
              <>
                <span className="text-gray-500 line-through">${originalPrice}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  -{discount}%
                </span>
              </>
            )}
          </div>
          <div className="text-sm text-purple-600 font-medium">OR {pointsPrice} Points</div>
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
            Cash or Points
          </div>
        </div>
      );
    }
    
    // Regular product
    return (
      <div className="flex justify-center items-center space-x-2">
        <span className="text-xl font-bold">${price}</span>
        {originalPrice && (
          <>
            <span className="text-gray-500 line-through">${originalPrice}</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
              -{discount}%
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <Link href={`/products/${id}`} className="text-center block hover:shadow-lg transition-shadow rounded-lg p-2">
      <Image 
        src={image} 
        alt={title} 
        width={250} 
        height={250} 
        className="w-full mb-4 hover:scale-105 transition-transform" 
      />
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="flex justify-center mb-2">
        <span>{renderStars(Math.floor(rating))}</span>
        <span className="text-gray-500 ml-2">{rating}/5</span>
      </div>
      {renderPrice()}
    </Link>
  );
}