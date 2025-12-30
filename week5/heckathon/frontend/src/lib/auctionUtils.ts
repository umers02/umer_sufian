export const formatTimeRemaining = (endTime: string | Date): string => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Auction Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getAuctionStatus = (endTime: string | Date, isCompleted?: boolean): string | null => {
  if (isCompleted) return null;
  
  const end = new Date(endTime);
  const now = new Date();
  const hoursLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 0) return null;
  if (hoursLeft <= 24) return "ending";
  return "trending";
};

export const generateMockBidders = (count: number = 3) => {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
  return Array.from({ length: count }, (_, i) => ({
    id: `bidder-${i + 1}`,
    name: names[i % names.length],
    amount: formatPrice(Math.floor(Math.random() * 50000) + 10000),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  }));
};

export const calculateTimeLeft = (endTime: string | Date) => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};