import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useCheckWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";

export interface AuctionListingCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  totalBids: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  endTime: string;
  rating: number;
  description: string;
  status?: "trending" | "ending" | "new" | null;
}

export function AuctionListingCard({
  id,
  name,
  image,
  price,
  totalBids,
  timeLeft,
  endTime,
  rating,
  description,
  status,
}: AuctionListingCardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: wishlistStatus } = useCheckWishlist(id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  
  const isInWishlist = wishlistStatus?.isInWishlist || false;
  
  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Auction listing star clicked for:', id);
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
    <Card className="relative bg-white border py-0 border-gray-200 rounded-md overflow-hidden">
      {/* Out of flow */}
      <Badge className="absolute top-0 left-0 rounded-xs z-10 bg-[#EF233C] text-white text-xs">
        {status}
      </Badge>

      <div className="absolute -top-3 -right-3 z-10  rounded-full w-14.5 h-14.5 bg-[#EAECF3] ">
        <Star 
          className={`relative top-5 left-4 w-5 h-5 cursor-pointer transition-colors ${
            isInWishlist ? 'text-red-500 fill-current' : 'text-[#2E3D83] hover:text-red-500'
          }`}
          onClick={handleStarClick}
        />
      </div>

      {/* MAIN ROW */}
      <div className="flex flex-col md:flex-row">
        {/* COLUMN 1 — IMAGE */}
        <div className="w-full md:w-1/4">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>

        {/* COLUMN 2 — DETAILS */}
        <div className="w-full md:w-1/4 p-4 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-[#2E3D83]">{name}</h3>

          {/* Yellow underline */}
          <div className="w-18 h-[4px] bg-[#F4C23D] my-2.5" />

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating ? "fill-[#F4C23D] text-[#F4C23D]" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-[#939393]">
            {description}
            <Link
              href={`/auction/${id}`}
              className="text-[#2E3D83] text-xs font-semibold ml-1 hover:underline"
            >
              View Details
            </Link>
          </p>
        </div>

        {/* COLUMN 3 — CURRENT BID + TIME LEFT */}
        <div className="w-full md:w-2/4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-[#2E3D83]">{price}</div>
              <div className="text-xs text-[#939393] mb-3">Current Bid</div>

              <div className="flex justify-start">
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                  <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.days}</div>
                  <div className="text-[8px] font-medium text-[#939393]">Days</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                  <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.hours}</div>
                  <div className="text-[8px] font-medium text-[#939393]">Hours</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                  <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.minutes}</div>
                  <div className="text-[8px] font-medium text-[#939393]">Mins</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                  <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.seconds}</div>
                  <div className="text-[8px] font-medium text-[#939393]">Secs</div>
                </div>
              </div>
              <div className="text-xs text-[#939393] ">Time Left</div>
            </div>

            {/* COLUMN 4 — TOTAL BIDS + END TIME */}
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-[#2E3D83]">
                {totalBids}
              </div>
              <div className="text-xs text-[#939393] mb-3">Total Bids</div>

              <div className="text-sm font-bold text-[#2E3D83]">
                {endTime
                  ? new Date(endTime)
                      .toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(",", "")
                  : "06:00pm 03 Jan 2023"}
              </div>
              <div className="text-xs text-[#939393]">End Time</div>
            </div>
          </div>

          <div className="m-4 md:m-5">
            <Link href={`/auction/${id}`}>
              <Button
                variant="outline"
                className="w-full text-sm md:text-base font-bold py-4 md:py-6 border-[#2E3D83] text-[#2E3D83]"
              >
                Submit A Bid
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
