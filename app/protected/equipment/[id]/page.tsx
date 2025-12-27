"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import EquipmentDetailCard from "@/components/equipment-detail-card"
import EquipmentMaintenanceList from "@/components/equipment-maintenance-list"

interface Equipment {
  id: string
  name: string
  serial_number?: string
  location?: string
  department?: string
  purchase_date?: string
  warranty_expiry?: string
  category_id?: string
  maintenance_team_id?: string
  employee?: string
  technician?: string
  scrap_date?: string
  used_in_location?: string
  work_center_id?: string
  description?: string
}

interface MaintenanceRequest {
  id: string
  subject: string
  stage: string
  type: string
  created_at: string
  duration_hours?: number
}

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAllRequests, setShowAllRequests] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const equipmentId = params.id as string

      const { data: equipData } = await supabase.from("equipment").select("*").eq("id", equipmentId).single()

      const { data: requestsData } = await supabase
        .from("maintenance_requests")
        .select("id, subject, stage, type, created_at, duration_hours")
        .eq("equipment_id", equipmentId)
        .order("created_at", { ascending: false })

      setEquipment(equipData)
      setRequests(requestsData || [])
      setIsLoading(false)
    }

    loadData()
  }, [params.id, supabase])

  if (isLoading) return <div className="p-8 text-center">Loading...</div>
  if (!equipment) return <div className="p-8 text-center">Equipment not found</div>

  const openRequests = requests.filter((r) => r.stage !== "Repaired" && r.stage !== "Scrap")

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Equipment Details</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAllRequests(!showAllRequests)}
            variant="outline"
            className="relative"
          >
            <span className="mr-2">Maintenance</span>
            <Badge variant="secondary" className="ml-1">
              {openRequests.length}
            </Badge>
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <EquipmentDetailCard equipment={equipment} />
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">Maintenance</h3>
              <Badge variant="default" className="bg-blue-600">
                {openRequests.length}
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              {openRequests.length === 0
                ? "No open maintenance requests"
                : `${openRequests.length} active request${openRequests.length > 1 ? "s" : ""}`}
            </p>
            <Button
              onClick={() => router.push(`/protected/requests/new?equipment=${equipment.id}`)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              New Request
            </Button>
          </Card>

          {equipment.scrap_date && (
            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-lg font-bold text-red-900 mb-2">Scrapped</h3>
              <p className="text-sm text-red-700">
                This equipment was scrapped on{" "}
                {new Date(equipment.scrap_date).toLocaleDateString()}
              </p>
            </Card>
          )}
        </div>
      </div>

      {showAllRequests && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Maintenance History</h2>
          <EquipmentMaintenanceList requests={requests} />
        </div>
      )}
    </div>
  )
}
