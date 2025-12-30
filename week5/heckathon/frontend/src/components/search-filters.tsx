"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useFilterOptions } from "@/hooks/useFilterOptions";

interface SearchFiltersProps {
  onSearch: (filters: {
    make?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    priceRange: '',
  });
  
  const { data: options } = useFilterOptions();

  const handleSearch = () => {
    const searchFilters: any = {};
    if (filters.make && filters.make !== 'all') searchFilters.make = filters.make;
    if (filters.model && filters.model !== 'all') searchFilters.model = filters.model;
    if (filters.year && filters.year !== 'all') searchFilters.year = filters.year;
    
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-');
      if (min) searchFilters.minPrice = min;
      if (max && max !== '+') searchFilters.maxPrice = max;
    }
    
    onSearch(searchFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1">
          <div>
            <Select value={filters.make} onValueChange={(value) => setFilters(prev => ({ ...prev, make: value }))}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {options?.makes.map((make: string) => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.model} onValueChange={(value) => setFilters(prev => ({ ...prev, model: value }))}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {options?.models.map((model: string) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {options?.years.map((year: number) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25000">$0 - $25,000</SelectItem>
                <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                <SelectItem value="100000+">$100,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="lg:w-auto">
          <Button onClick={handleSearch} className="w-full lg:w-auto bg-[#4A5FBF] hover:bg-[#3A4FAF] px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
