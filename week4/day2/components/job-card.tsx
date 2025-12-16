"use client"

import type { Job } from "@/lib/job-data"
import { useFilterStore } from "@/store/filter-store"
import Link from "next/link"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const addFilter = useFilterStore((state) => state.addFilter)
  const selectedFilters = useFilterStore((state) => state.selectedFilters)

  const allTags = [job.role, job.level, ...job.languages, ...job.tools].filter(Boolean) as string[]

  return (
    <Link href={`/jobs/${job.id}`}>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border-l-4 hover:shadow-lg transition-shadow cursor-pointer ${
          job.isFeatured ? "border-[#5BA4A4]" : "border-transparent"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Logo */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 -mt-10 md:mt-0 overflow-hidden">
            {job.logoImg ? (
              <img src={job.logoImg} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: job.logoColor }}
              >
                <span className="text-white text-xs font-bold">{job.logo}</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            {/* Company and badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[#5BA4A4] dark:text-[#5BA4A4] font-bold">{job.company}</span>
              {job.isNew && (
                <span className="bg-[#5BA4A4] text-white text-xs font-bold px-2 py-1 rounded-full uppercase">New!</span>
              )}
              {job.isFeatured && (
                <span className="bg-[#2C3A3A] dark:bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                  Featured
                </span>
              )}
            </div>

            {/* Position */}
            <h2 className="text-[#2C3A3A] dark:text-white font-bold text-lg hover:text-[#5BA4A4] dark:hover:text-[#5BA4A4] transition-colors">
              {job.position}
            </h2>

            {/* Job details */}
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
              <span>{job.postedAt}</span>
              <span>•</span>
              <span>{job.contract}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault()
                  addFilter(tag)
                }}
                className={`px-3 py-1 rounded font-bold text-[#5BA4A4] dark:text-[#5BA4A4] text-sm hover:bg-[#5BA4A4] hover:text-white dark:hover:bg-[#5BA4A4] dark:hover:text-white transition-colors ${
                  selectedFilters.includes(tag)
                    ? "bg-[#5BA4A4] text-white dark:bg-[#5BA4A4] dark:text-white"
                    : "bg-[#EFFAFA] dark:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
