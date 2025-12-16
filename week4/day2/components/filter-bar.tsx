"use client"

import { useFilterStore } from "@/store/filter-store"
import { X } from "lucide-react"

export function FilterBar() {
  const selectedFilters = useFilterStore((state) => state.selectedFilters)
  const removeFilter = useFilterStore((state) => state.removeFilter)
  const clearFilters = useFilterStore((state) => state.clearFilters)

  if (selectedFilters.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {selectedFilters.map((filter) => (
          <div key={filter} className="flex items-center bg-[#EFFAFA] dark:bg-gray-700 rounded overflow-hidden">
            <span className="px-3 py-1 text-[#5BA4A4] dark:text-[#5BA4A4] font-bold text-sm">{filter}</span>
            <button
              onClick={() => removeFilter(filter)}
              className="bg-[#5BA4A4] hover:bg-[#2C3A3A] dark:hover:bg-gray-900 text-white p-2 transition-colors"
              aria-label={`Remove ${filter} filter`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={clearFilters}
        className="text-[#5BA4A4] dark:text-[#5BA4A4] hover:underline font-bold text-sm whitespace-nowrap"
      >
        Clear
      </button>
    </div>
  )
}
