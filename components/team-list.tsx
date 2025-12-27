"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No teams found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Team Name</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="hover:bg-gray-50 border-b">
              <TableCell className="font-medium text-gray-900">{team.name}</TableCell>
              <TableCell className="text-gray-700">{team.description || "-"}</TableCell>
              <TableCell className="text-gray-700">
                {team.created_at ? new Date(team.created_at).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(team)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(team.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
