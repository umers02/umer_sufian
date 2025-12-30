import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

interface PaymentStep {
  date: string
  time: string
  amount: string
  id: string
  status: "completed" | "current" | "pending"
  label: string
}

interface PaymentStepsProps {
  steps: PaymentStep[]
}

export function PaymentSteps({ steps }: PaymentStepsProps) {
  return (
    <Card className="p-6 mt-8">
      <h3 className="text-lg font-semibold mb-6">Payment & Delivery Timeline</h3>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {step.status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : step.status === "current" ? (
                  <Clock className="w-6 h-6 text-orange-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{step.label}</div>
                      <div className="text-sm text-gray-600">{step.date} - {step.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{step.amount}</div>
                      <Badge variant={step.status === "completed" ? "default" : "secondary"}>
                        {step.status === "completed" ? "Completed" : step.status === "current" ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="ml-3 mt-2 mb-2 w-px h-6 bg-gray-200"></div>
            )}
          </div>
        ))}

        <div className="text-center mt-8">
          <Badge className="bg-green-500 text-lg px-6 py-2">Payment Required</Badge>
        </div>
      </div>
    </Card>
  )
}
