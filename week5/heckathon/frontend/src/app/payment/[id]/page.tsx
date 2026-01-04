"use client";

import { useParams } from "next/navigation";
import { HeroSection } from "@/components/hero-section";
import { useAuction } from "@/hooks/useAuctions";
import { useCreatePayment, usePayment } from "@/hooks/usePayments";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/auctionUtils";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";
import { useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const auctionId = params.id as string;
  const user = useAuthStore((state) => state.user);
  
  const { data: auction, isLoading: auctionLoading } = useAuction(auctionId);
  const createPayment = useCreatePayment();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { data: payment, isLoading: paymentLoading } = usePayment(paymentId || '');

  const handleMakePayment = async () => {
    try {
      const newPayment = await createPayment.mutateAsync(auctionId);
      setPaymentId(newPayment._id);
    } catch (error) {
      console.error('Payment creation failed:', error);
    }
  };

  if (auctionLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!auction) {
    return <div className="flex justify-center items-center min-h-screen">Auction not found</div>;
  }

  return (
    <>
      <HeroSection
        title="Payment"
        description="Complete your payment for the winning auction"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: `/auction/${auctionId}` },
          { label: "Payment" }
        ]}
      />

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <div className="bg-[#4A5FBF] text-white p-4">
              <h2 className="text-xl font-semibold">Auction Details</h2>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                <img
                  src={auction.car?.photos?.[0] || "/placeholder.jpg"}
                  alt={auction.car?.title}
                  className="w-48 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{auction.car?.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Winning Bid:</span>
                      <span className="ml-2 font-bold text-[#4A5FBF]">
                        {formatPrice(auction.currentPrice || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Winner:</span>
                      <span className="ml-2">{user?.fullName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {!payment && (
            <Card>
              <div className="bg-[#4A5FBF] text-white p-4">
                <h2 className="text-xl font-semibold">Make Payment</h2>
              </div>
              <div className="p-6 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#4A5FBF] mb-2">
                    {formatPrice(auction.currentPrice || 0)}
                  </h3>
                  <p className="text-gray-600">Total Amount Due</p>
                </div>
                <Button
                  onClick={handleMakePayment}
                  disabled={createPayment.isPending}
                  className="bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white px-8 py-3 text-lg"
                >
                  {createPayment.isPending ? 'Processing...' : 'Make Payment'}
                </Button>
              </div>
            </Card>
          )}

          {payment && (
            <Card className="mt-8">
              <div className="bg-green-500 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Payment Successful
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
                  <div className="space-y-4">
                    {payment.deliveryUpdates?.map((update, index) => {
                      const getIcon = (status: string) => {
                        switch (status) {
                          case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
                          case 'ready_for_shipping': return <Package className="w-5 h-5 text-blue-500" />;
                          case 'in_transit': return <Truck className="w-5 h-5 text-orange-500" />;
                          case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
                          default: return <Clock className="w-5 h-5 text-gray-500" />;
                        }
                      };
                      
                      const getStatusText = (status: string) => {
                        switch (status) {
                          case 'pending': return 'Payment Received';
                          case 'ready_for_shipping': return 'Ready for Shipping';
                          case 'in_transit': return 'In Transit';
                          case 'delivered': return 'Delivered';
                          default: return status;
                        }
                      };
                      
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                          {getIcon(update.status)}
                          <div className="flex-1">
                            <p className="font-medium">{getStatusText(update.status)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(update.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your delivery status will update automatically. 
                    Refresh this page to see the latest updates.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}