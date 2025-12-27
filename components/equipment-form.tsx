"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EquipmentFormProps {
  initialData?: any
  onClose: () => void
  onSuccess: () => void
}

interface Category {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
}

interface WorkCenter {
  id: string
  name: string
}

export default function EquipmentForm({ initialData, onClose, onSuccess }: EquipmentFormProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([])

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    serial_number: initialData?.serial_number || "",
    location: initialData?.location || "",
    department: initialData?.department || "",
    purchase_date: initialData?.purchase_date || "",
    warranty_expiry: initialData?.warranty_expiry || "",
    category_id: initialData?.category_id || "",
    maintenance_team_id: initialData?.maintenance_team_id || "",
    assigned_to: initialData?.assigned_to || "",
    employee: initialData?.employee || "",
    technician: initialData?.technician || "",
    scrap_date: initialData?.scrap_date || "",
    used_in_location: initialData?.used_in_location || "",
    work_center_id: initialData?.work_center_id || "",
    description: initialData?.description || "",
  })

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [catsRes, teamsRes, workCentersRes] = await Promise.all([
        supabase.from("equipment_categories").select("id, name").eq("user_id", user.id),
        supabase.from("maintenance_teams").select("id, name").eq("user_id", user.id),
        supabase.from("work_centers").select("id, name").eq("user_id", user.id),
      ])

      if (catsRes.data) setCategories(catsRes.data)
      if (teamsRes.data) setTeams(teamsRes.data)
      if (workCentersRes.data) setWorkCenters(workCentersRes.data)
    }

    loadData()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

      // Filter out empty strings and null values
      const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase.from("equipment").update(cleanedData).eq("id", initialData.id)
        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase.from("equipment").insert({
          ...cleanedData,
          user_id: user.id,
        })
        if (insertError) throw insertError
      }

      onSuccess()
    } catch (err: unknown) {
      console.error("Equipment form error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Equipment" : "New Equipment"}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name? *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="category_id">Equipment Category?</Label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
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
            <Label htmlFor="department">Company?</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="My Company (San Francisco)"
            />
          </div>

          <div>
            <Label htmlFor="employee">Used By?</Label>
            <Input
              id="employee"
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              placeholder="Employee"
            />
          </div>

          <div>
            <Label htmlFor="maintenance_team_id">Maintenance Team?</Label>
            <select
              id="maintenance_team_id"
              name="maintenance_team_id"
              value={formData.maintenance_team_id}
              onChange={handleChange}
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

          <div>
            <Label htmlFor="purchase_date">Assigned Date?</Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="technician">Technician?</Label>
            <Input
              id="technician"
              name="technician"
              value={formData.technician}
              onChange={handleChange}
              placeholder="Mitchell Admin"
            />
          </div>

          <div>
            <Label htmlFor="assigned_to">Employee?</Label>
            <Input
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="Abigail Peterson"
            />
          </div>

          <div>
            <Label htmlFor="scrap_date">Scrap Date?</Label>
            <Input id="scrap_date" name="scrap_date" type="date" value={formData.scrap_date} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="used_in_location">Used in location?</Label>
            <Input
              id="used_in_location"
              name="used_in_location"
              value={formData.used_in_location}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="work_center_id">Work Center?</Label>
            <select
              id="work_center_id"
              name="work_center_id"
              value={formData.work_center_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Work Center</option>
              {workCenters.map((wc) => (
                <option key={wc.id} value={wc.id}>
                  {wc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="serial_number">Serial Number</Label>
            <Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Description - Full Width */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="min-h-24"
          placeholder="Enter equipment description..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Saving..." : "Save Equipment"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
