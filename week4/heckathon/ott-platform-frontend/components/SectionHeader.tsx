import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  showNavigation?: boolean
  onPrevious?: () => void
  onNext?: () => void
  currentPage?: number
  totalPages?: number
}

export default function SectionHeader({ 
  title, 
  showNavigation = true, 
  onPrevious, 
  onNext, 
  currentPage = 0, 
  totalPages = 4 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-bold">{title}</h3>
      {showNavigation && (
        <div className="flex items-center space-x-2 bg-black rounded-lg px-3 py-2">
          <button 
            onClick={onPrevious}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" 
            style={{backgroundColor: '#1A1A1A'}}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-1 rounded-full ${
                  index === currentPage ? 'bg-red-600' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={onNext}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors" 
            style={{backgroundColor: '#1A1A1A'}}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}