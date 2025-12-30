import { Mail, Phone } from "lucide-react"

export function Header() {
  return (
    <div className="bg-[#4A5FBF] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Call Us</span>
            <span className="font-medium">570-694-4002</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-center sm:text-left">Email Id : info@cardeposit.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
