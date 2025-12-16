import { jobsData } from "@/lib/job-data"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface JobDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params
  const job = jobsData.find((j) => j.id === Number.parseInt(id))

  if (!job) {
    notFound()
  }

  const allTags = [job.role, job.level, ...job.languages, ...job.tools].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-[#EFFAFA] dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      
      {/* Header */}
      <div className="bg-[#5BA4A4] dark:bg-[#2C3A3A] h-32"></div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          {/* Company header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.logoImg ? (
                <img src={job.logoImg} alt={job.company} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: job.logoColor }}
                >
                  <span className="text-white text-xs sm:text-sm font-bold">{job.logo}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2C3A3A] dark:text-white">{job.company}</h1>
                <div className="flex items-center gap-2">
                  {job.isNew && (
                    <span className="bg-[#5BA4A4] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      New!
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="bg-[#2C3A3A] dark:bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5BA4A4] dark:text-[#5BA4A4] mb-4">{job.position}</h2>
            </div>
          </div>

          {/* Job metadata */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mb-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{job.postedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{job.contract}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{job.location}</span>
            </div>
          </div>

          <hr className="my-6 border-gray-200 dark:border-gray-700" />

          {/* Job description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#2C3A3A] dark:text-white mb-4">Job Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We are looking for an exceptional {job.position} to join our growing team at {job.company}. This is an
              exciting opportunity to work on cutting-edge projects and collaborate with talented professionals.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              As a {job.position}, you will be responsible for developing high-quality solutions, maintaining code
              standards, and contributing to our innovative product development process.
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#2C3A3A] dark:text-white mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#EFFAFA] dark:bg-gray-700 rounded font-bold text-[#5BA4A4] dark:text-[#5BA4A4] text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#5BA4A4] hover:bg-[#2C3A3A] dark:hover:bg-gray-900 text-white px-6 sm:px-8 w-full sm:w-auto">
              Apply Now
            </Button>
            <Button
              variant="outline"
              className="border-[#5BA4A4] text-[#5BA4A4] hover:bg-[#5BA4A4] hover:text-white bg-transparent w-full sm:w-auto"
            >
              Save Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
