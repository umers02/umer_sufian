"use client"

import { HeroSection } from "@/components/hero-section"
import { ImageGallery } from "@/components/image-gallery"
import { BiddingInterface } from "@/components/bidding-interface"
import { BidderList } from "@/components/bidder-list"
import { PaymentSteps } from "@/components/payment-steps"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { useAuction } from "@/hooks/useAuctions"
import { useBids } from "@/hooks/useBids"
import { useAuthStore } from "@/stores/authStore"
import { formatPrice, formatTimeRemaining } from "@/lib/auctionUtils"
import { useState, useEffect, useCallback } from "react"
import { useSocketContext } from "@/providers/SocketProvider"
import { Car } from "@/types/api"
import { toast } from "sonner"
import Link from "next/link"

export default function AuctionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  
  // Debug auth state
  useEffect(() => {
    console.log('🔐 Auth Debug:', {
      user: user,
      userKeys: user ? Object.keys(user) : null,
      isAuthenticated: isAuthenticated,
      isHydrated: isHydrated,
      userId: user?._id,
      userIdAlt: user?.id,
      userUserId: user?.userId
    });
  }, [user, isAuthenticated, isHydrated]);
  
  const { data: auction, isLoading: auctionLoading, refetch: refetchAuction } = useAuction(id)
  const { data: bids, isLoading: bidsLoading, refetch: refetchBids, error: bidsError } = useBids()
  
  // Debug bids fetch
  useEffect(() => {
    console.log('📊 Bids Debug:', {
      bids: bids,
      bidsLoading: bidsLoading,
      bidsError: bidsError,
      bidsCount: bids?.length || 0
    });
  }, [bids, bidsLoading, bidsError]);
  
  const car = auction?.car
  
  // Real-time state for bid updates
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const { joinAuction: socketJoinAuction, currentBids, isConnected, initializeBidData } = useSocketContext();
  
  const joinAuction = useCallback((auctionId: string) => {
    socketJoinAuction(auctionId);
  }, [socketJoinAuction]);
  
  // Initialize socket data when both auction and bids are loaded
  useEffect(() => {
    if (bids && auction && !auctionLoading && !bidsLoading) {
      const carBids = bids.filter(bid => bid.auctionId === auction._id);
      const bidCount = carBids.length;
      const currentPrice = carBids.length > 0 ? 
        Math.max(...carBids.map(b => b.amount)) : 
        (auction.currentPrice || auction.car?.startingPrice || 0);
      
      initializeBidData(id, currentPrice, bidCount);
      console.log(`📊 AuctionDetail: Initialized bid data for ${id}:`, { price: currentPrice, count: bidCount, carBids: carBids.length });
    }
  }, [bids, auction, id, initializeBidData, auctionLoading, bidsLoading]);
  
  // Join auction room (only once)
  useEffect(() => {
    if (id && isConnected) {
      console.log(`🏠 AuctionDetail: Joining auction room ${id}`);
      joinAuction(id);
    }
  }, [id, isConnected, joinAuction]);
  
  // Update time countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      if (auction) {
        if (auction.endTime) {
          const now = new Date().getTime();
          const endTime = new Date(auction.endTime).getTime();
          const difference = endTime - now;
          
          if (difference > 0) {
            setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
          } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          }
        }
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auction]);
  // Handle socket updates
  useEffect(() => {
    if (currentBids[id]) {
      const socketData = currentBids[id];
      console.log(`📨 AuctionDetail: Socket update for ${id}:`, socketData);
      
      // Show notification for other users
      if (socketData.bidderId && socketData.bidderId !== user?._id) {
        toast.success(`New bid placed: ${formatPrice(socketData.amount)}`);
      }
      
      // Refresh database data for consistency
      refetchBids();
      refetchAuction();
    }
  }, [currentBids, id, refetchBids, refetchAuction, user]);
  
  if (auctionLoading || bidsLoading || !isHydrated) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }
  
  if (!auction || !car) {
    return <div className="flex justify-center items-center min-h-screen">Auction not found</div>
  }

  // Filter bids for this auction
  const carBids = bids?.filter(bid => {
    // Try multiple ways to get auction ID from bid
    const auctionId = bid.auctionId || bid.auction || bid.carId;
    const auctionIdStr = typeof auctionId === 'string' ? auctionId : auctionId?._id;
    const targetAuctionId = auction._id;
    const matches = auctionIdStr === targetAuctionId;
    
    console.log('🔍 Bid filter:', { 
      bidId: bid._id, 
      bidAuctionId: auctionIdStr, 
      targetAuctionId: targetAuctionId, 
      matches: matches,
      rawBid: bid 
    });
    return matches;
  }) || []
  
  // Check if auction should be ended based on time
  const now = new Date();
  const auctionEndTime = new Date(auction.endTime);
  const isTimeExpired = now > auctionEndTime;
  const effectiveStatus = isTimeExpired ? 'ended' : auction.status;
  
  console.log('🕰️ Time check:', {
    now: now.toISOString(),
    endTime: auction.endTime,
    isTimeExpired,
    originalStatus: auction.status,
    effectiveStatus
  });
  
  // Calculate current values from database + socket updates
  const socketData = currentBids[id];
  const dbBidCount = carBids.length;
  const dbCurrentPrice = carBids.length > 0 ? 
    Math.max(...carBids.map(b => b.amount)) : 
    (auction.currentPrice || car.startingPrice || 0);
  
  // Use socket data if available, otherwise use database data
  const displayBidCount = socketData?.count ?? carBids.length;
  const displayCurrentPrice = formatPrice(socketData?.amount ?? dbCurrentPrice);
  const topBidder = carBids.length > 0 ? carBids.reduce((prev, current) => 
    (prev.amount > current.amount) ? prev : current
  ) : null
  
  // Check if current user is the winner
  const isWinner = topBidder && user && (() => {
    const bidderId = typeof topBidder.bidderId === 'string' ? topBidder.bidderId : (topBidder.bidderId as any)?._id;
    // Try different user ID fields
    const userId = user._id || user.id || user.userId;
    console.log('🏆 Winner check:', { 
      topBidderId: bidderId, 
      currentUserId: userId,
      userIdField: user._id ? '_id' : user.id ? 'id' : user.userId ? 'userId' : 'none',
      isMatch: bidderId === userId,
      auctionStatus: auction.status,
      topBidder: topBidder
    });
    return bidderId === userId;
  })();
  const winningAmount = topBidder ? topBidder.amount : (auction.currentPrice || car.startingPrice || 0)
  
  console.log('🎯 Payment section check:', {
    auctionStatus: auction.status,
    effectiveStatus: effectiveStatus,
    isWinner,
    topBidder: !!topBidder,
    user: !!user,
    shouldShowPayment: effectiveStatus === 'ended' && isWinner,
    currentUserId: user?._id || user?.id || user?.userId,
    topBidderId: topBidder ? (typeof topBidder.bidderId === 'string' ? topBidder.bidderId : (topBidder.bidderId as any)?._id) : null
  });
  
  // Merge database bidders (no realtime state needed)
  const bidderMap = new Map();
  carBids.forEach(bid => {
    const bidderId = typeof bid.bidderId === 'string' ? bid.bidderId : (bid.bidderId as any)?._id;
    const bidderKey = bidderId?.slice(-4) || 'Unknown';
    
    if (!bidderMap.has(bidderKey) || bidderMap.get(bidderKey).amount < bid.amount) {
      bidderMap.set(bidderKey, {
        id: bid._id,
        name: bidderKey,
        amount: formatPrice(bid.amount),
        time: new Date(bid.placedAt).toLocaleTimeString(),
        avatar: "/placeholder-user.jpg"
      });
    }
  });
  
  const realBidders = Array.from(bidderMap.values())
    .sort((a, b) => parseFloat(b.amount.replace(/[^0-9.-]+/g, "")) - parseFloat(a.amount.replace(/[^0-9.-]+/g, "")));

  // Payment steps for winner
  const paymentSteps = [
    {
      date: new Date().toLocaleDateString(),
      time: "Immediate",
      amount: formatPrice(winningAmount),
      id: `${id}-payment`,
      status: "current" as const,
      label: "Payment Due",
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "2-3 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-processing`,
      status: "pending" as const,
      label: "Payment Processing",
    },
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "5-7 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-shipping`,
      status: "pending" as const,
      label: "Ready For Shipping",
    },
    {
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "10-14 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-delivery`,
      status: "pending" as const,
      label: "Delivered",
    },
  ];

  const handleBidUpdate = () => {
    // Socket will handle the real-time updates
    // Just refresh data to ensure consistency
    setTimeout(() => {
      refetchBids();
      refetchAuction();
    }, 500);
  };

  return (
    <>
      <HeroSection
        title={car.title}
        description={car.description || "Car auction details"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
      />

      <div className=" min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
           <ImageGallery
                  mainImage={car.photos?.[0] || "/placeholder.jpg"}
                  thumbnails={car.photos || ["/placeholder.jpg"]}
                  title={car.title}
                  status={auction.status === 'ended' ? undefined : "trending"}
                />


          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            {/* Left Column - Image Gallery */}
            <div className=" space-y-6 w-full lg:w-3/4">

              {/* Auction Info Section */}
              <div className="bg-[#F1F2FF] px-5 py-2.5 rounded-sm">
                <div className="flex flex-col md:flex-row justify-center gap-2  md:justify-between items-start md:items-center">
                  {/* Time Left Section */}
                  <div >
                  <div className="flex ">
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.days}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Days</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.hours}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Hours</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.minutes}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Mins</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.seconds}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Secs</div>
                    </div>
                   
                  </div>
                   <div >
                      <div className="text-[10px] text-[#939393]">Time Left</div>
                    </div>
                  </div>
                  
                  {/* Current Bid */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{displayCurrentPrice}</div>
                    <div className="text-[10px] text-[#939393]">Current Bid</div>
                  </div>
                  
                  {/* End Time */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">
                      {auction.endTime ? 
                        new Date(auction.endTime).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }).replace(',', '') : 
                        '06:00pm 03 Jan 2023'
                      }
                    </div>
                    <div className="text-[10px] text-[#939393]">End Time</div>
                  </div>
                  
                  {/* Min Increment */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">100</div>
                    <div className="text-[10px] text-[#939393]">Min. Increment</div>
                  </div>
                  
                  {/* Total Bids */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{displayBidCount}</div>
                    <div className="text-[10px] text-[#939393]">Total Bids</div>
                  </div>
                  
                  {/* Lot No */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{auction._id?.slice(-6) || '379831'}</div>
                    <div className="text-[10px] text-[#939393]">Lot No.</div>
                  </div>
                  
                  {/* Odometer */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">10,878 KM</div>
                    <div className="text-[10px] text-[#939393]">Odometer</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#2E3D83] pb-2 border-b-4 border-yellow-400 inline-block">Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 mt-4">
                    {car.description || "No description available for this vehicle."}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Make:</span>
                        <span className="font-semibold">{car.make}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="font-semibold">{car.model}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Year:</span>
                        <span className="font-semibold">{car.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Body Type:</span>
                        <span className="font-semibold">{car.bodyType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section for Winner */}
              {effectiveStatus === 'ended' && isWinner && (
                <>
                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="bg-green-500 text-white mb-2">🎉 Congratulations! You Won!</Badge>
                        <p className="text-orange-800 font-medium">
                          Please make your payment within 6 days
                        </p>
                      </div>
                      <Link href={`/payment/${id}`}>
                        <button className="bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white px-6 py-2 rounded-lg font-medium">
                          Make Payment
                        </button>
                      </Link>
                    </div>
                  </div>

                  <Card className="shadow-sm">
                    <div className="bg-[#4A5FBF] text-white p-4">
                      <h3 className="text-lg font-semibold">Winner Details</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src="/professional-headshot.png"
                          alt={user?.fullName || "Winner"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Full Name:</span>
                            <span className="ml-2 font-medium">{user?.fullName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2">{user?.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Winning Bid:</span>
                            <span className="ml-2 font-bold text-[#4A5FBF]">{formatPrice(winningAmount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Bids:</span>
                            <span className="ml-2">{displayBidCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <PaymentSteps steps={paymentSteps} />
                </>
              )}

              {/* Top Bidder for non-winners or ongoing auctions */}
              {(effectiveStatus !== 'ended' || !isWinner) && topBidder && (
                <Card className="shadow-sm overflow-hidden py-0 rounded-sm bg-[#F1F2FF]">
                  <div className="bg-[#2E3D83] text-white p-4">
                    <h3 className="text-lg font-semibold">Top Bidder</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src="/professional-headshot.png"
                        alt="Top Bidder"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bidder ID:</span>
                            <span className="font-semibold">{(() => {
                              const bidderId = typeof topBidder.bidderId === 'string' ? topBidder.bidderId : (topBidder.bidderId as any)?._id;
                              return bidderId?.slice(-8) || 'Unknown';
                            })()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bid Amount:</span>
                            <span className="font-bold text-[#4A5FBF] text-lg">{displayCurrentPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Bidder List */}
            <div className=" w-full lg:w-1/4">
            <div className="mb-5 shadow-sm">
                <BiddingInterface
                  currentBid={displayCurrentPrice}
                  timeRemaining={auction.endTime || new Date().toISOString()}
                  totalBids={displayBidCount}
                  isEnded={effectiveStatus === 'ended'}
                />
              </div>

              <div>
              <BidderList 
                bidders={realBidders}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
