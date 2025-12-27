"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
        <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <EquipmentDetailCard equipment={equipment} />
        </div>

        <div>
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Maintenance</h3>
            <p className="text-3xl font-bold text-blue-600">{openRequests.length}</p>
            <p className="text-sm text-blue-700 mt-1">Open requests</p>
            <Button
              onClick={() => router.push(`/protected/requests/new?equipment=${equipment.id}`)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              New Request
            </Button>
          </Card>
        </div>
      </div>

      <EquipmentMaintenanceList requests={requests} />
    </div>
  )
}
