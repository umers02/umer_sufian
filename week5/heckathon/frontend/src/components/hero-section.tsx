import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface HeroSectionProps {
  title: string
  description: string
  breadcrumbs: { label: string; href?: string }[]
}

export function HeroSection({ title, description, breadcrumbs }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-12 lg:py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A5FBF] mb-4">{title}</h1>
        <div className="w-12 sm:w-16 h-1 bg-[#4A5FBF] mx-auto mb-6"></div>
        <p className="text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto text-sm sm:text-base">{description}</p>

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="text-[#4A5FBF] hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
