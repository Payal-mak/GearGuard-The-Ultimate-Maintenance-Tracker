"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewRequestPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [maintenanceFor, setMaintenanceFor] = useState<"Equipment" | "Work Center">("Equipment")
  const [equipment, setEquipment] = useState([])
  const [workCenters, setWorkCenters] = useState([])
  const [categories, setCategories] = useState([])
  const [teams, setTeams] = useState([])

  const [formData, setFormData] = useState({
    subject: "",
    maintenance_for: "Equipment",
    equipment_id: "",
    work_center_id: "",
    category_id: "",
    request_date: new Date().toISOString().split("T")[0],
    maintenance_type: "Corrective",
    team_id: "",
    technician: "",
    scheduled_date: "",
    duration_hours: "",
    priority: "",
    company: "My Company (San Francisco)",
    notes: "",
    instructions: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const [equipRes, workCentersRes, catsRes, teamsRes] = await Promise.all([
      supabase.from("equipment").select("id, name, serial_number").eq("user_id", user.id),
      supabase.from("work_centers").select("id, name").eq("user_id", user.id),
      supabase.from("equipment_categories").select("id, name").eq("user_id", user.id),
      supabase.from("maintenance_teams").select("id, name").eq("user_id", user.id),
    ])

    if (equipRes.data) setEquipment(equipRes.data)
    if (workCentersRes.data) setWorkCenters(workCentersRes.data)
    if (catsRes.data) setCategories(catsRes.data)
    if (teamsRes.data) setTeams(teamsRes.data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("maintenance_requests").insert({
        subject: formData.subject,
        type: formData.maintenance_type,
        maintenance_for: maintenanceFor,
        equipment_id: maintenanceFor === "Equipment" ? formData.equipment_id : null,
        work_center_id: maintenanceFor === "Work Center" ? formData.work_center_id : null,
        category_id: formData.category_id,
        team_id: formData.team_id,
        scheduled_date: formData.scheduled_date,
        duration_hours: formData.duration_hours ? Number.parseFloat(formData.duration_hours) : null,
        stage: "New",
        user_id: user.id,
      })

      if (error) throw error
      router.push("/protected/dashboard")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Maintenance Requests</h1>
          <p className="text-gray-600">Test activity</p>
        </div>
        <Button variant="outline" className="ml-auto bg-transparent">
          Worksheet
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className={maintenanceFor === "Equipment" ? "font-medium" : ""}>New Request</span>
        <span>&gt;</span>
        <span>In Progress</span>
        <span>&gt;</span>
        <span>Repaired</span>
        <span>&gt;</span>
        <span>Scrap</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label>Subject?</Label>
              <Input name="subject" value={formData.subject} onChange={handleChange} required />
            </div>

            <div>
              <Label>Created By</Label>
              <Input value="Mitchell Admin" disabled />
            </div>

            <div>
              <Label>Maintenance For</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={maintenanceFor === "Equipment" ? "default" : "outline"}
                  onClick={() => setMaintenanceFor("Equipment")}
                  className="flex-1"
                >
                  Equipment
                </Button>
                <Button
                  type="button"
                  variant={maintenanceFor === "Work Center" ? "default" : "outline"}
                  onClick={() => setMaintenanceFor("Work Center")}
                  className="flex-1"
                >
                  Work Center
                </Button>
              </div>
            </div>

            {maintenanceFor === "Equipment" ? (
              <div>
                <Label>Equipment</Label>
                <select
                  name="equipment_id"
                  value={formData.equipment_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipment.map((e: any) => (
                    <option key={e.id} value={e.id}>
                      {e.name} {e.serial_number ? `(${e.serial_number})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <Label>Work Center</Label>
                <select
                  name="work_center_id"
                  value={formData.work_center_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Work Center</option>
                  {workCenters.map((wc: any) => (
                    <option key={wc.id} value={wc.id}>
                      {wc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label>Category</Label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Request Date?</Label>
              <Input type="date" name="request_date" value={formData.request_date} onChange={handleChange} />
            </div>

            <div>
              <Label>Maintenance Type</Label>
              <RadioGroup
                value={formData.maintenance_type}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, maintenance_type: v }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Corrective" id="corrective" />
                  <Label htmlFor="corrective">Corrective</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Preventive" id="preventive" />
                  <Label htmlFor="preventive">Preventive</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label>Team</Label>
              <select
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Team</option>
                {teams.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Technician</Label>
              <Input name="technician" value={formData.technician} onChange={handleChange} />
            </div>

            <div>
              <Label>Scheduled Date?</Label>
              <Input
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Duration</Label>
              <Input
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleChange}
                placeholder="0.00 hours"
              />
            </div>

            <div>
              <Label>Priority</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  1
                </Button>
                <Button type="button" variant="outline" size="sm">
                  2
                </Button>
                <Button type="button" variant="outline" size="sm">
                  3
                </Button>
              </div>
            </div>

            <div>
              <Label>Company</Label>
              <Input value={formData.company} disabled />
            </div>
          </div>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="notes">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded p-3 min-h-[100px]"
              placeholder="Add notes..."
            />
          </TabsContent>
          <TabsContent value="instructions">
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full border rounded p-3 min-h-[100px]"
              placeholder="Add instructions..."
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
