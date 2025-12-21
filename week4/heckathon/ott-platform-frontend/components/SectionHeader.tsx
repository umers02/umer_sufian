import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  showNavigation?: boolean
}

export default function SectionHeader({ title, showNavigation = true }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-bold">{title}</h3>
      {showNavigation && (
        <div className="flex items-center space-x-2 bg-black rounded-lg px-3 py-2">
          <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" style={{backgroundColor: '#1A1A1A'}}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1">
            <div className="w-2 h-1 bg-red-600 rounded-full"></div>
            <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-1 bg-gray-600 rounded-full"></div>
          </div>
          <button className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" style={{backgroundColor: '#1A1A1A'}}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}