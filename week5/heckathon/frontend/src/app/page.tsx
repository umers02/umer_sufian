"use client";
import { SearchFilters } from "@/components/search-filters";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useLiveAuctions } from "@/hooks/useAuctions";
import { useSocketContext } from "@/providers/SocketProvider";
import { formatPrice, formatTimeRemaining } from "@/lib/auctionUtils";
import { Auction } from "@/types/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchFilters, setSearchFilters] = useState({});
  const { data: auctions, isLoading, error } = useLiveAuctions();
  const { currentBids, joinAuction, initializeBidData, timeUpdates } = useSocketContext();

  // Add filtered auctions based on search
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    if (Object.keys(filters).length > 0) {
      // Filter auctions based on search criteria
      const filtered = auctions?.filter((auction: Auction) => {
        const car = auction.car;
        if (!car) return false;
        
        if (filters.make && car.make.toLowerCase() !== filters.make.toLowerCase()) return false;
        if (filters.model && car.model.toLowerCase() !== filters.model.toLowerCase()) return false;
        if (filters.year && car.year.toString() !== filters.year) return false;
        if (filters.minPrice && (auction.currentPrice || car.startingPrice) < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice && (auction.currentPrice || car.startingPrice) > parseInt(filters.maxPrice)) return false;
        
        return true;
      }) || [];
      
      setFilteredAuctions(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const displayAuctions = showSearchResults ? 
    filteredAuctions.map((auction: Auction) => {
      const auctionId = auction._id;
      const realTimeBid = currentBids[auctionId];
      const realTimeRemaining = timeUpdates[auctionId];
      const currentPrice = realTimeBid?.amount || auction.currentPrice || 0;
      const timeRemaining = realTimeRemaining || (auction.endTime ? formatTimeRemaining(auction.endTime) : "Auction Ended");
      
      return {
        id: auction._id,
        name: auction.car?.title || 'Car Auction',
        image: auction.car?.photos?.[0] || "/placeholder.jpg",
        price: formatPrice(currentPrice),
        currentBid: formatPrice(currentPrice),
        timeRemaining: timeRemaining,
        endTime: auction.endTime,
        status: auction.status === 'live' ? ("trending" as const) : null,
        rating: 5,
        endType: auction.status === 'ended' ? "Auction Ended" : "Time Remaining",
        description: auction.car?.description || "No description available",
      };
    }) :
    Array.isArray(auctions) ? auctions.slice(0, 4).map((auction: Auction) => {
    const auctionId = auction._id;
    const realTimeBid = currentBids[auctionId];
    const realTimeRemaining = timeUpdates[auctionId];
    const currentPrice = realTimeBid?.amount || auction.currentPrice || 0;
    const timeRemaining = realTimeRemaining || (auction.endTime ? formatTimeRemaining(auction.endTime) : "Auction Ended");
    
    return {
      id: auction._id,
      name: auction.car?.title || 'Car Auction',
      image: auction.car?.photos?.[0] || "/placeholder.jpg",
      price: formatPrice(currentPrice),
      currentBid: formatPrice(currentPrice),
      timeRemaining: timeRemaining,
      endTime: auction.endTime,
      status: auction.status === 'live' ? ("trending" as const) : null,
      rating: 5,
      endType: auction.status === 'ended' ? "Auction Ended" : "Time Remaining",
      description: auction.car?.description || "No description available",
    };
  }) : [];

  useEffect(() => {
    if (auctions && Array.isArray(auctions)) {
      auctions.slice(0, 4).forEach((auction: Auction) => {
        joinAuction(auction._id);
        initializeBidData(auction._id, auction.currentPrice || 0, 0);
      });
    }
  }, [auctions, joinAuction, initializeBidData]);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-20 sm:py-24 lg:py-32"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero.jpg')",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="bg-blue-100 text-[#4A5FBF] px-3 sm:px-4 py-2 rounded-sm inline-block mb-4 sm:mb-6 text-xs sm:text-sm font-medium">
              WELCOME TO AUCTION
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 sm:mb-6 leading-tight">
              Find Your Dream Car
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>
          </div>

          <div className="mt-8 sm:mt-12">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>

        {/* Sign in / Register buttons */}
        {!isAuthenticated && (
          <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="cursor-pointer text-white border-white hover:bg-white hover:text-gray-900 bg-transparent text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer bg-[#4A5FBF] hover:bg-[#3A4FAF] text-sm px-3 py-2 sm:px-4 sm:py-2">
                Register now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Live Auction Section */}
      <div className="bg-white w-full py-12 lg:py-16">
        <div className="bg-[#2E3D83] w-full py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 lg:mb-12">
              <div className="text-center">
                {/* Title */}
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 lg:mb-6">
                  {showSearchResults ? 'Search Results' : 'Live Auction'}
                </h2>

                {/* Line + Diamond */}
                <div className="relative flex items-center justify-center">
                  {/* Horizontal line */}
                  <div className="w-32 sm:w-48 lg:w-64 h-[2px] bg-white/70"></div>

                  {/* Diamond */}
                  <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rotate-45"></div>
                </div>
              </div>
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="border-b border-white">
                <div className="inline-block px-4 sm:px-6 mx-4 sm:mx-12 lg:mx-24 border-b-[3px] sm:border-b-[5px] border-[#FFC300] pb-2">
                  <span className="text-white font-medium text-lg sm:text-xl">Live Auction</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {isLoading ? (
                <div className="col-span-full text-center text-white py-8">
                  Loading cars...
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-white py-8">
                  Failed to load cars. Please try again.
                </div>
              ) : displayAuctions.length === 0 ? (
                <div className="col-span-full text-center text-white py-8">
                  {showSearchResults ? 'No cars found matching your search criteria.' : 'No live auctions available.'}
                </div>
              ) : (
                displayAuctions.map((auction) => (
                  <div key={auction.id}>
                    <CarCard {...auction} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
