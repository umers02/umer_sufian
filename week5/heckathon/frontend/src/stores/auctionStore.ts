import { create } from 'zustand';
import { Car, Auction } from '@/types/api';

interface AuctionState {
  cars: Car[];
  auctions: Auction[];
  selectedAuction: Auction | null;
  filters: {
    carType: string;
    color: string;
    make: string;
    model: string;
    style: string;
    priceRange: [number, number];
  };
  setCars: (cars: Car[]) => void;
  setAuctions: (auctions: Auction[]) => void;
  setSelectedAuction: (auction: Auction | null) => void;
  updateFilters: (filters: Partial<AuctionState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  carType: '',
  color: '',
  make: '',
  model: '',
  style: '',
  priceRange: [0, 100000] as [number, number],
};

export const useAuctionStore = create<AuctionState>((set) => ({
  cars: [],
  auctions: [],
  selectedAuction: null,
  filters: defaultFilters,
  
  setCars: (cars) => set({ cars }),
  
  setAuctions: (auctions) => set({ auctions }),
  
  setSelectedAuction: (auction) => set({ selectedAuction: auction }),
  
  updateFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
  
  resetFilters: () => set({ filters: defaultFilters }),
}));