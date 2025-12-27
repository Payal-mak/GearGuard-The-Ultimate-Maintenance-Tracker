"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface RequestDetail {
  id: string
  subject: string
  type: "Corrective" | "Preventive"
  maintenance_for: "Equipment" | "Work Center"
  stage: "New" | "In Progress" | "Repaired" | "Scrap"
  scheduled_date?: string
  duration_hours?: number
  priority?: string
  description?: string
  corrective_action?: string
  preventive_action?: string
  created_at: string
  equipment?: { id: string; name: string; category_id: string }
  work_centers?: { id: string; name: string }
  maintenance_teams?: { id: string; name: string }
  equipment_categories?: { id: string; name: string }
}

interface Equipment {
  id: string
  name: string
  category_id: string
  maintenance_team_id: string
}

interface WorkCenter {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string
  const supabase = createClient()

  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    subject: "",
    type: "Corrective" as "Corrective" | "Preventive",
    maintenance_for: "Equipment" as "Equipment" | "Work Center",
    stage: "New" as "New" | "In Progress" | "Repaired" | "Scrap",
    equipment_id: "",
    work_center_id: "",
    team_id: "",
    category_id: "",
    scheduled_date: "",
    duration_hours: "",
    priority: "",
    description: "",
    corrective_action: "",
    preventive_action: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        // Load request
        const { data: requestData, error: requestError } = await supabase
          .from("maintenance_requests")
          .select(
            `
            id,
            subject,
            type,
            maintenance_for,
            stage,
            scheduled_date,
            duration_hours,
            priority,
            description,
            corrective_action,
            preventive_action,
            created_at,
            equipment_id,
            work_center_id,
            team_id,
            category_id,
            equipment(id, name, category_id),
            work_centers(id, name),
            maintenance_teams(id, name),
            equipment_categories(id, name)
          `,
          )
          .eq("id", requestId)
          .single()

        if (requestError) throw requestError
        if (requestData) {
          setRequest(requestData)
          setFormData({
            subject: requestData.subject || "",
            type: requestData.type || "Corrective",
            maintenance_for: requestData.maintenance_for || "Equipment",
            stage: requestData.stage || "New",
            equipment_id: requestData.equipment_id || "",
            work_center_id: requestData.work_center_id || "",
            team_id: requestData.team_id || "",
            category_id: requestData.category_id || "",
            scheduled_date: requestData.scheduled_date || "",
            duration_hours: requestData.duration_hours?.toString() || "",
            priority: requestData.priority || "",
            description: requestData.description || "",
            corrective_action: requestData.corrective_action || "",
            preventive_action: requestData.preventive_action || "",
          })
        }

        // Load reference data
        const [equipRes, wcRes, teamsRes, catsRes] = await Promise.all([
          supabase.from("equipment").select("id, name, category_id, maintenance_team_id").eq("user_id", user.id),
          supabase.from("work_centers").select("id, name").eq("user_id", user.id),
          supabase.from("maintenance_teams").select("id, name").eq("user_id", user.id),
          supabase.from("equipment_categories").select("id, name").eq("user_id", user.id),
        ])

        if (equipRes.data) setEquipment(equipRes.data)
        if (wcRes.data) setWorkCenters(wcRes.data)
        if (teamsRes.data) setTeams(teamsRes.data)
        if (catsRes.data) setCategories(catsRes.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load request")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [requestId, supabase])

  const handleEquipmentChange = (equipmentId: string) => {
    setFormData((prev) => ({ ...prev, equipment_id: equipmentId }))
    const selectedEq = equipment.find((e) => e.id === equipmentId)
    if (selectedEq) {
      setFormData((prev) => ({
        ...prev,
        team_id: selectedEq.maintenance_team_id || "",
        category_id: selectedEq.category_id || "",
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("maintenance_requests")
        .update({
          subject: formData.subject,
          type: formData.type,
          maintenance_for: formData.maintenance_for,
          stage: formData.stage,
          equipment_id: formData.maintenance_for === "Equipment" ? formData.equipment_id : null,
          work_center_id: formData.maintenance_for === "Work Center" ? formData.work_center_id : null,
          team_id: formData.team_id,
          category_id: formData.category_id,
          scheduled_date: formData.type === "Preventive" ? formData.scheduled_date : null,
          duration_hours: formData.duration_hours ? Number.parseInt(formData.duration_hours) : null,
          priority: formData.priority,
          description: formData.description,
          corrective_action: formData.corrective_action,
          preventive_action: formData.preventive_action,
        })
        .eq("id", requestId)

      if (updateError) throw updateError
      setIsEditing(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save request")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Request not found</p>
      </div>
    )
  }

  const stageColors = {
    New: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Repaired: "bg-green-100 text-green-800",
    Scrap: "bg-red-100 text-red-800",
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{request.subject}</h1>
          <p className="text-gray-600 text-sm mt-2">Request created for {request.maintenance_for}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="outline" onClick={() => router.back()}>
                Back
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <Badge className={stageColors[request.stage]}>{request.stage}</Badge>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Input name="subject" value={formData.subject} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Corrective">Corrective</option>
                    <option value="Preventive">Preventive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Maintenance For</Label>
                  <select
                    name="maintenance_for"
                    value={formData.maintenance_for}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Work Center">Work Center</option>
                  </select>
                </div>

                {formData.maintenance_for === "Equipment" ? (
                  <div>
                    <Label>Equipment</Label>
                    <select
                      value={formData.equipment_id}
                      onChange={(e) => handleEquipmentChange(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Select Equipment</option>
                      {equipment.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name}
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
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Select Work Center</option>
                      {workCenters.map((wc) => (
                        <option key={wc.id} value={wc.id}>
                          {wc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Team</Label>
                  <select
                    name="team_id"
                    value={formData.team_id}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.type === "Preventive" && (
                  <div>
                    <Label>Scheduled Date</Label>
                    <Input
                      name="scheduled_date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div>
                  <Label>Duration (hours)</Label>
                  <Input
                    name="duration_hours"
                    type="number"
                    value={formData.duration_hours}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Stage</Label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Repaired">Repaired</option>
                  <option value="Scrap">Scrap</option>
                </select>
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <Label>Corrective Action</Label>
                <textarea
                  name="corrective_action"
                  value={formData.corrective_action}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <Label>Preventive Action</Label>
                <textarea
                  name="preventive_action"
                  value={formData.preventive_action}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-medium">{request.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance For</p>
                  <p className="text-lg font-medium">{request.maintenance_for}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Equipment/Work Center</p>
                  <p className="text-lg font-medium">
                    {request.equipment?.name || request.work_centers?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-lg font-medium">{request.equipment_categories?.name || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Team</p>
                  <p className="text-lg font-medium">{request.maintenance_teams?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <p className="text-lg font-medium">{request.priority || "N/A"}</p>
                </div>
              </div>

              {request.type === "Preventive" && (
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="text-lg font-medium">{request.scheduled_date || "N/A"}</p>
                </div>
              )}

              {request.duration_hours && (
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-medium">{request.duration_hours} hours</p>
                </div>
              )}

              {request.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-lg">{request.description}</p>
                </div>
              )}

              {request.corrective_action && (
                <div>
                  <p className="text-sm text-gray-600">Corrective Action</p>
                  <p className="text-lg">{request.corrective_action}</p>
                </div>
              )}

              {request.preventive_action && (
                <div>
                  <p className="text-sm text-gray-600">Preventive Action</p>
                  <p className="text-lg">{request.preventive_action}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
