import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/stores/authStore"
import { useAuctionTimer } from "@/hooks/useAuctionTimer"
import { useCheckWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist"

export interface CarCardProps {
  id: string
  name: string
  image: string
  price: string
  currentBid: string
  timeRemaining: string
  endTime?: string
  status: "trending" | "ending" | "new" | null
  rating: number
  description?: string
  endType: string
}

export interface AuctionListingProps extends CarCardProps {
  year: number
  mileage: string
  fuelType: string
  transmission: string
  location: string
}

export function CarCard({ id, name, image, price, currentBid, timeRemaining, endTime, status, rating }: CarCardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const liveTimeRemaining = useAuctionTimer(endTime || null);
  
  // Wishlist functionality
  const { data: wishlistStatus } = useCheckWishlist(id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  
  const isInWishlist = wishlistStatus?.isInWishlist || false;
  
  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Star clicked for auction:', id);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Is in wishlist:', isInWishlist);
    
    if (!isAuthenticated) {
      console.log('User not authenticated');
      alert("Please login to add items to wishlist");
      return;
    }
    
    if (isInWishlist) {
      console.log('Removing from wishlist');
      removeFromWishlist.mutate(id);
    } else {
      console.log('Adding to wishlist');
      addToWishlist.mutate(id);
    }
  };
  return (
    <Card className=" bg-white py-0 max-h-[400px] overflow-hidden">
      <div className="relative">
        <h3 className="py-5.5 border-b text-center font-semibold text-lg mt-2 z-5">{name}</h3>

        {status && (
          <Badge
            className={`absolute top-0 left-0 z-10 rounded-xs  ${
              status === "trending" ? "bg-[#EF233C]" : status === "ending" ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {status}
          </Badge>
        )}
        <div className="rounded-full absolute -top-6 -right-6 shadow-md w-16.5 h-16.5 z-10 ">
        <Star 
          className={`relative top-8 -right-3 z-10 w-5 h-5 cursor-pointer transition-colors ${
            isInWishlist ? 'text-red-500 fill-current' : 'text-[#2E3D83] hover:text-red-500'
          }`}
          onClick={handleStarClick}
        />
        </div>
<div className="h-39 w-full overflow-hidden flex items-center justify-center">
  <img
    src={image || "/placeholder.svg"}
    alt={name}
    className="w-full h-full object-cover"
  />
</div>
      </div>

      <div className="p-5.5 pt-0">
        
       

        <div className="flex items-center justify-between space-y-2 mb-4">
          <div className=" text-sm">
            <p className="font-bold">{currentBid}</p>

            <p >Current Bid</p>
          </div>
          <div className=" text-sm text-right">
            <p className="font-bold">{liveTimeRemaining}</p>

            <p >Time Remaining</p>
          </div>
        </div>

        <Link href={isAuthenticated ? `/auction/${id}` : "/login"}>
          <Button className="w-full bg-[#2E3D83] py-5 hover:bg-[#3A4FAF] cursor-pointer ">Submit A Bid</Button>
        </Link>
      </div>
    </Card>
  )
}
