"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Equipment {
  id: string
  name: string
  category_id: string
  maintenance_team_id: string
}

interface Team {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface WorkCenter {
  id: string
  name: string
}

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([])

  const [subject, setSubject] = useState("")
  const [type, setType] = useState<"Corrective" | "Preventive">("Corrective")
  const [maintenanceFor, setMaintenanceFor] = useState<"Equipment" | "Work Center">("Equipment")
  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [selectedWorkCenter, setSelectedWorkCenter] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [equipRes, teamsRes, catsRes, wcRes] = await Promise.all([
        supabase.from("equipment").select("id, name, category_id, maintenance_team_id").eq("user_id", user.id),
        supabase.from("maintenance_teams").select("id, name").eq("user_id", user.id),
        supabase.from("equipment_categories").select("id, name").eq("user_id", user.id),
        supabase.from("work_centers").select("id, name").eq("user_id", user.id),
      ])

      if (equipRes.data) setEquipment(equipRes.data)
      if (teamsRes.data) setTeams(teamsRes.data)
      if (catsRes.data) setCategories(catsRes.data)
      if (wcRes.data) setWorkCenters(wcRes.data)
    }

    loadData()
  }, [supabase])

  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
    // Auto-fill team and category from selected equipment
    const selectedEq = equipment.find((e) => e.id === equipmentId)
    if (selectedEq) {
      // Category and team will be filled automatically
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const selectedEq = equipment.find((e) => e.id === selectedEquipment)
      const selectedWc = workCenters.find((w) => w.id === selectedWorkCenter)

      const { error: insertError } = await supabase.from("maintenance_requests").insert({
        subject,
        type,
        maintenance_for: maintenanceFor,
        equipment_id: maintenanceFor === "Equipment" ? selectedEquipment : null,
        work_center_id: maintenanceFor === "Work Center" ? selectedWorkCenter : null,
        team_id: selectedEq?.maintenance_team_id || null,
        category_id: selectedEq?.category_id || null,
        scheduled_date: type === "Preventive" ? scheduledDate : null,
        stage: "New",
        user_id: user.id,
      })

      if (insertError) throw insertError

      router.push("/protected/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Maintenance Request</CardTitle>
          <CardDescription>Fill in the details for your maintenance request</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label>Request Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Corrective"
                    checked={type === "Corrective"}
                    onChange={(e) => setType(e.target.value as "Corrective" | "Preventive")}
                  />
                  <span>Corrective (Breakdown)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Preventive"
                    checked={type === "Preventive"}
                    onChange={(e) => setType(e.target.value as "Corrective" | "Preventive")}
                  />
                  <span>Preventive (Checkup)</span>
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Subject</Label>
              <Input
                placeholder="What is the issue?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Maintenance For</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Equipment"
                    checked={maintenanceFor === "Equipment"}
                    onChange={(e) => setMaintenanceFor(e.target.value as "Equipment" | "Work Center")}
                  />
                  <span>Equipment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Work Center"
                    checked={maintenanceFor === "Work Center"}
                    onChange={(e) => setMaintenanceFor(e.target.value as "Equipment" | "Work Center")}
                  />
                  <span>Work Center</span>
                </label>
              </div>
            </div>

            {maintenanceFor === "Equipment" && (
              <div className="grid gap-2">
                <Label htmlFor="equipment">Select Equipment</Label>
                <select
                  id="equipment"
                  value={selectedEquipment}
                  onChange={(e) => handleEquipmentChange(e.target.value)}
                  className="border rounded px-3 py-2"
                  required
                >
                  <option value="">Choose an equipment...</option>
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {maintenanceFor === "Work Center" && (
              <div className="grid gap-2">
                <Label htmlFor="workCenter">Select Work Center</Label>
                <select
                  id="workCenter"
                  value={selectedWorkCenter}
                  onChange={(e) => setSelectedWorkCenter(e.target.value)}
                  className="border rounded px-3 py-2"
                  required
                >
                  <option value="">Choose a work center...</option>
                  {workCenters.map((wc) => (
                    <option key={wc.id} value={wc.id}>
                      {wc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === "Preventive" && (
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Creating..." : "Create Request"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
