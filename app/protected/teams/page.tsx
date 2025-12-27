"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TeamForm from "@/components/team-form"
import TeamList from "@/components/team-list"

interface Team {
  id: string
  name: string
  description?: string
  created_at?: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadTeams = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("maintenance_teams")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setTeams(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTeams()
  }, [supabase])

  const handleAddClick = () => {
    setSelectedTeam(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (team: Team) => {
    setSelectedTeam(team)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedTeam(null)
    loadTeams()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return

    const { error } = await supabase.from("maintenance_teams").delete().eq("id", id)
    if (!error) {
      loadTeams()
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Maintenance Teams</h1>
            <p className="text-gray-600 text-sm mt-1">Create and manage your maintenance teams</p>
          </div>
          <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 font-semibold px-6">
            Add Team
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <Card className="p-6 border border-gray-200">
            <TeamForm initialData={selectedTeam} onClose={handleFormClose} onSuccess={handleFormClose} />
          </Card>
        </div>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Loading teams...</p>
        </Card>
      ) : (
        <TeamList teams={teams} onEdit={handleEditClick} onDelete={handleDelete} onRefresh={loadTeams} />
      )}
    </div>
  )
}
