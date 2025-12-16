import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EFFAFA] dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 text-[#5BA4A4] mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-[#2C3A3A] dark:text-white mb-4">Job Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the job you're looking for. It may have been removed or the link may be incorrect.
        </p>
        <Link href="/">
          <Button className="bg-[#5BA4A4] hover:bg-[#2C3A3A] text-white">Back to Job Listings</Button>
        </Link>
      </div>
    </div>
  )
}
