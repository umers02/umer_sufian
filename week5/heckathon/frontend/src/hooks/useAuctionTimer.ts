import { useState, useEffect } from 'react';
import { formatTimeRemaining } from '@/lib/auctionUtils';

export const useAuctionTimer = (endTime: string | null) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!endTime) {
      setTimeRemaining('Auction Ended');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeRemaining('Auction Ended');
        return;
      }

      setTimeRemaining(formatTimeRemaining(endTime));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeRemaining;
};