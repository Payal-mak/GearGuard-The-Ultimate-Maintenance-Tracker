"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TeamFormProps {
  initialData?: any
  onClose: () => void
  onSuccess: () => void
}

export default function TeamForm({ initialData, onClose, onSuccess }: TeamFormProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memberInput, setMemberInput] = useState("")
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    team_members: initialData?.team_members || [],
    company: initialData?.company || "My Company (San Francisco)",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    if (memberInput.trim() && !formData.team_members.includes(memberInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        team_members: [...prev.team_members, memberInput.trim()],
      }))
      setMemberInput("")
    }
  }

  const handleRemoveMember = (memberToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((member) => member !== memberToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddMember()
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

      // Filter out empty strings
      const cleanedData = {
        name: formData.name,
        description: formData.description || null,
        team_members: formData.team_members.length > 0 ? formData.team_members : null,
        company: formData.company || null,
      }

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from("maintenance_teams")
          .update(cleanedData)
          .eq("id", initialData.id)
        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase.from("maintenance_teams").insert({
          ...cleanedData,
          user_id: user.id,
        })
        if (insertError) throw insertError
      }

      onSuccess()
    } catch (err: unknown) {
      console.error("Team form error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Team" : "Add New Team"}</h2>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Team Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="team_members">Team Members</Label>
          <div className="flex gap-2 mb-2">
            <Input
              id="member_input"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter member name and press Enter"
            />
            <Button type="button" onClick={handleAddMember} variant="outline">
              Add
            </Button>
          </div>
          {formData.team_members.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
              {formData.team_members.map((member, idx) => (
                <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1">
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" value={formData.company} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 min-h-20"
            placeholder="What does this team specialize in?"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Saving..." : "Save Team"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
