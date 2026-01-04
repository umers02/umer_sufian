"use client";
import { useState } from "react";
import { Edit, Camera } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { useProfile, useMyCars, useMyBids } from "@/hooks/useProfile";
import { useWishlist } from "@/hooks/useWishlist";
import { CarCard } from "@/components/ProfileCarCard";
import { formatPrice } from "@/lib/auctionUtils";
import type { Car } from "@/types/api";
import { ProfileUpdateForm } from "@/components/forms/ProfileUpdateForm";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<"personal" | "cars" | "bids" | "wishlist">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: user, isLoading: userLoading } = useProfile();
  const { data: myCars, isLoading: carsLoading } = useMyCars();
  const { data: myBids, isLoading: bidsLoading } = useMyBids();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('http://localhost:4000/users/profile/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          setProfileImage(result.profilePicture);
          // Refresh user data
          window.location.reload();
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };

  const handleAction = (car: Car) => {
    console.log("action for car", car._id);
  };

  if (userLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <HeroSection
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Profile" }]}
      />

      <div className="bg-gray-50 min-h-screen py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setActiveSection("personal")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === "personal"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveSection("cars")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === "cars"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    My Cars
                  </button>
                  <button
                    onClick={() => setActiveSection("bids")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === "bids"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    My Bids
                  </button>
                  <button
                    onClick={() => setActiveSection("wishlist")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === "wishlist"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {activeSection === "personal" && (
                <>
                  {/* Personal Information Section */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#4A5FBF] text-white px-4 lg:px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Personal Information</h2>
                      <Edit 
                        className="w-5 h-5 cursor-pointer" 
                        onClick={() => setIsEditing(!isEditing)}
                      />
                    </div>
                    <div className="p-4 lg:p-6">
                      {isEditing ? (
                        <ProfileUpdateForm onSuccess={() => setIsEditing(false)} />
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative group cursor-pointer">
                            {profileImage || user?.profilePicture ? (
                              <img
                                src={profileImage || user.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                            />
                          </div>
                          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4 w-full">
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                Full Name
                              </label>
                              <p className="text-gray-700">
                                {user?.fullName || ""}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                Email
                              </label>
                              <p className="text-gray-700">
                                {user?.email || ""}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                Mobile Number
                              </label>
                              <p className="text-gray-500">
                                {user?.mobileNumber || ""}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                Nationality
                              </label>
                              <p className="text-gray-700">{user?.nationality || ""}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                ID Type
                              </label>
                              <p className="text-gray-700">{user?.idType || ""}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                                ID Number
                              </label>
                              <p className="text-gray-700">{user?.idNumber || ""}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#4A5FBF] text-white px-4 lg:px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Password</h2>
                      <Edit className="w-5 h-5 cursor-pointer" />
                    </div>
                    <div className="p-4 lg:p-6">
                      <div>
                        <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                          Password
                        </label>
                        <p className="text-gray-500">••••••••</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#4A5FBF] text-white px-4 lg:px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Address</h2>
                      <Edit className="w-5 h-5 cursor-pointer" />
                    </div>
                    <div className="p-4 lg:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Country
                          </label>
                          <p className="text-gray-700">{user?.country || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            City
                          </label>
                          <p className="text-gray-700">{user?.city || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Address 1
                          </label>
                          <p className="text-gray-700">{user?.address1 || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Address 2
                          </label>
                          <p className="text-gray-700">{user?.address2 || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Land Line Number
                          </label>
                          <p className="text-gray-700">{user?.landLineNumber || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            P.O Box
                          </label>
                          <p className="text-gray-700">{user?.poBox || ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traffic File Information Section */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#4A5FBF] text-white px-4 lg:px-6 py-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Traffic File Information</h2>
                      <Edit className="w-5 h-5 cursor-pointer" />
                    </div>
                    <div className="p-4 lg:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Traffic Information Type
                          </label>
                          <p className="text-gray-500">{user?.trafficInfoType || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Plate State
                          </label>
                          <p className="text-gray-700">{user?.plateState || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Traffic File Number
                          </label>
                          <p className="text-gray-700">{user?.trafficFileNumber || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Plate Code
                          </label>
                          <p className="text-gray-700">{user?.plateCode || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Plate Number
                          </label>
                          <p className="text-gray-700">{user?.plateNumber || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Driver License Number
                          </label>
                          <p className="text-gray-700">{user?.driverLicenseNumber || ""}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A5FBF] mb-1">
                            Issue City
                          </label>
                          <p className="text-gray-700">{user?.issueCity || ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "cars" && (
                <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                  <h2 className="text-lg font-semibold mb-4">My Cars ({myCars?.length || 0})</h2>
                  {carsLoading ? (
                    <div className="text-center py-8">Loading your cars...</div>
                  ) : myCars && myCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                      {myCars.map((car) => (
                        <CarCard
                          key={car._id}
                          car={car}
                          variant="mycars"
                          onAction={handleAction}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      You haven't listed any cars yet.
                    </div>
                  )}
                </div>
              )}

              {activeSection === "bids" && (
                <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                  <h2 className="text-lg font-semibold mb-4">My Bids ({myBids?.length || 0})</h2>
                  {bidsLoading ? (
                    <div className="text-center py-8">Loading your bids...</div>
                  ) : myBids && myBids.length > 0 ? (
                    <div className="space-y-4">
                      {myBids.map((bid) => (
                        <div key={bid._id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                          <div>
                            <h3 className="font-medium">
                              {typeof bid.auctionId === 'object' && bid.auctionId?.car ? 
                                (typeof bid.auctionId.car === 'object' ? bid.auctionId.car.title : 'Car Auction') : 
                                'Unknown Auction'
                              }
                            </h3>
                            <p className="text-sm text-gray-500">
                              Placed on: {new Date(bid.placedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-bold text-[#4A5FBF]">{formatPrice(bid.amount)}</p>
                            <p className="text-sm text-gray-500">Your Bid</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      You haven't placed any bids yet.
                    </div>
                  )}
                </div>
              )}

              {activeSection === "wishlist" && (
                <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
                  <h2 className="text-lg font-semibold mb-4">Wishlist ({wishlist?.length || 0})</h2>
                  {wishlistLoading ? (
                    <div className="text-center py-8">Loading your wishlist...</div>
                  ) : wishlist && wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                      {wishlist.map((auction, index) => (
                        <div key={auction._id || `auction-${index}`} className="border rounded-lg overflow-hidden">
                          <img
                            src={auction.car?.photos?.[0] || "/placeholder.jpg"}
                            alt={auction.car?.title || "Car"}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-medium mb-2">{auction.car?.title}</h3>
                            <p className="text-[#4A5FBF] font-bold">
                              {formatPrice(auction.currentPrice || auction.car?.startingPrice || 0)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status: {auction.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Your wishlist is empty. Add some auctions to your favorites!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}