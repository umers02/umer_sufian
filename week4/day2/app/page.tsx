"use client"

import { jobsData } from "@/lib/job-data"
import { JobCard } from "@/components/job-card"
import { FilterBar } from "@/components/filter-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useFilterStore } from "@/store/filter-store"
import { useMemo } from "react"

export default function HomePage() {
  const selectedFilters = useFilterStore((state) => state.selectedFilters)

  const filteredJobs = useMemo(() => {
    if (selectedFilters.length === 0) return jobsData

    return jobsData.filter((job) => {
      const allTags = [job.role, job.level, ...job.languages, ...job.tools].filter(Boolean) as string[]

      return selectedFilters.every((filter) => allTags.includes(filter))
    })
  }, [selectedFilters])

  return (
    <div className="min-h-screen bg-[#EFFAFA] dark:bg-gray-900 transition-colors">
      <ThemeToggle />

      {/* Header with decorative background */}
      <div className="bg-[#5BA4A4] dark:bg-[#2C3A3A] h-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 900 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="150" cy="-50" r="200" fill="rgba(255,255,255,0.1)" />
            <circle cx="650" cy="-100" r="300" fill="rgba(255,255,255,0.1)" />
            <circle cx="900" cy="100" r="250" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-20">
        <div className="relative z-10">
          <FilterBar />
        </div>

        <div className="mt-16 space-y-0">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No jobs found matching your filters. Try adjusting your selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
