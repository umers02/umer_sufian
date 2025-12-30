import { Card } from "@/components/ui/card"


interface Bidder {
  name: string
  amount: string
  avatar?: string
}

interface BidderListProps {
  bidders: Bidder[]
  
}

export function BidderList({ bidders}: BidderListProps) {
  return (
    <Card className="p-6 bg-[#F1F2FF]">
      <h3 className="text-base flex items-center justify-start font-medium  bg-[#2E3D83] text-white p-3 -m-6 mb-4 rounded-t-sm h-18.75">
       
        Bidders List
      </h3>

      <div className="space-y-4 bg-[#F1F2FF] ">
       

        {bidders.map((bidder, index) => (
          <div key={index} className="flex items-center gap-3">
          
            <div className="flex-1">
              <div className="font-medium">{bidder.name}</div>
              <div className="text-sm text-gray-600">Bidder {index + 1}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{bidder.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
