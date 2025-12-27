"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function EquipmentForm({ initialData, onClose, onSuccess }: EquipmentFormProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [teams, setTeams] = useState<Team[]>([])

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
  })

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [catsRes, teamsRes] = await Promise.all([
        supabase.from("equipment_categories").select("id, name").eq("user_id", user.id),
        supabase.from("maintenance_teams").select("id, name").eq("user_id", user.id),
      ])

      if (catsRes.data) setCategories(catsRes.data)
      if (teamsRes.data) setTeams(teamsRes.data)
    }

    loadData()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase.from("equipment").update(formData).eq("id", initialData.id)
        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase.from("equipment").insert({
          ...formData,
          user_id: user.id,
        })
        if (insertError) throw insertError
      }

      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Equipment" : "Add New Equipment"}</h2>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Equipment Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="serial_number">Serial Number</Label>
          <Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="warranty_expiry">Warranty Expiry</Label>
            <Input
              id="warranty_expiry"
              name="warranty_expiry"
              type="date"
              value={formData.warranty_expiry}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category_id">Category</Label>
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
            <Label htmlFor="maintenance_team_id">Maintenance Team</Label>
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
        </div>

        <div>
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Input id="assigned_to" name="assigned_to" value={formData.assigned_to} onChange={handleChange} />
        </div>
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
