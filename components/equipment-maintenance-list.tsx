"use client"

import { Card } from "@/components/ui/card"

interface MaintenanceRequest {
  id: string
  subject: string
  stage: string
  type: string
  created_at: string
  duration_hours?: number
}

interface EquipmentMaintenanceListProps {
  requests: MaintenanceRequest[]
}

export default function EquipmentMaintenanceList({ requests }: EquipmentMaintenanceListProps) {
  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      New: "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Repaired: "bg-green-100 text-green-800",
      Scrap: "bg-red-100 text-red-800",
    }
    return colors[stage] || "bg-gray-100 text-gray-800"
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance History</h2>

      {requests.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No maintenance requests for this equipment</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{request.subject}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>{request.type}</span>
                    {request.duration_hours && <span>Duration: {request.duration_hours}h</span>}
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(request.stage)}`}>
                  {request.stage}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
