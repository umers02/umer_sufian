"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatPrice } from '@/lib/auctionUtils';
import { toast } from 'sonner';

interface SocketContextType {
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
  currentBids: Record<string, { amount: number; count: number; bidderId?: string }>;
  timeUpdates: Record<string, string>;
  isConnected: boolean;
  initializeBidData: (auctionId: string, amount: number, count: number) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket, joinAuction, leaveAuction, onNewBid, off, isConnected } = useSocket();
  const [currentBids, setCurrentBids] = useState<Record<string, { amount: number; count: number; bidderId?: string }>>({});
  const [timeUpdates, setTimeUpdates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isConnected && socket) {
      console.log('🔗 SocketProvider: Connected to server');
      
      onNewBid((data) => {
        console.log('📨 SocketProvider: Received newBid event:', data);
        
        setCurrentBids(prev => {
          const currentData = prev[data.auctionId] || { amount: 0, count: 0 };
          const newCount = data.totalBids !== undefined ? data.totalBids : currentData.count + 1;
          const newState = {
            ...prev,
            [data.auctionId]: {
              amount: data.amount,
              count: newCount,
              bidderId: data.bidderId
            }
          };
          console.log('📊 SocketProvider: Updated bid state:', newState[data.auctionId]);
          return newState;
        });
        
        toast.success(`New bid placed: ${formatPrice(data.amount)}`);
      });
      // Listen for time updates
      if (socket) {
        socket.on('timeUpdate', (data) => {
          setTimeUpdates(prev => ({
            ...prev,
            [data.auctionId]: data.timeRemaining
          }));
        });
      }
    }

    return () => {
      if (socket) {
        console.log('🧹 SocketProvider: Cleaning up socket listeners');
        off('newBid');
        socket.off('timeUpdate');
      }
    };
  }, [isConnected, socket]);

  const initializeBidData = useCallback((auctionId: string, amount: number, count: number) => {
    console.log(`🎆 SocketProvider: Initializing bid data for ${auctionId}:`, { amount, count });
    setCurrentBids(prev => {
      // Only initialize if we don't have data or if the new data is more recent
      const existing = prev[auctionId];
      if (!existing || count >= existing.count) {
        return {
          ...prev,
          [auctionId]: { amount, count }
        };
      }
      return prev;
    });
  }, []);

  return (
    <SocketContext.Provider value={{
      joinAuction,
      leaveAuction,
      currentBids,
      timeUpdates,
      isConnected,
      initializeBidData
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
}