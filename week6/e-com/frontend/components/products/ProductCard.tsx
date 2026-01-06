import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  image: string;
  title: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  id?: string;
}

export default function ProductCard({ 
  image, 
  title, 
  rating, 
  price, 
  originalPrice, 
  discount,
  id = '1'
}: ProductCardProps) {
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
    </Link>
  );
}