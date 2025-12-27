"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Team {
  id: string
  name: string
  description?: string
  created_at?: string
}

interface TeamListProps {
  teams: Team[]
  onEdit: (team: Team) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function TeamList({ teams, onEdit, onDelete, onRefresh }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No teams found. Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team) => (
        <Card key={team.id} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          {team.description && <p className="text-sm text-gray-600 mt-2">{team.description}</p>}
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onEdit(team)} variant="outline" size="sm">
              Edit
            </Button>
            <Button onClick={() => onDelete(team.id)} variant="outline" size="sm" className="text-red-600">
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
