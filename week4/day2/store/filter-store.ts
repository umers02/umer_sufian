import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FilterState {
  selectedFilters: string[]
  isDarkMode: boolean
  addFilter: (filter: string) => void
  removeFilter: (filter: string) => void
  clearFilters: () => void
  toggleDarkMode: () => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      selectedFilters: [],
      isDarkMode: false,
      addFilter: (filter) =>
        set((state) => ({
          selectedFilters: state.selectedFilters.includes(filter)
            ? state.selectedFilters
            : [...state.selectedFilters, filter],
        })),
      removeFilter: (filter) =>
        set((state) => ({
          selectedFilters: state.selectedFilters.filter((f) => f !== filter),
        })),
      clearFilters: () => set({ selectedFilters: [] }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "job-filter-storage",
    },
  ),
)
