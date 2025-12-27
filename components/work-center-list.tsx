"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WorkCenter {
  id: string
  name: string
  location?: string
  description?: string
  created_at?: string
}

interface WorkCenterListProps {
  workCenters: WorkCenter[]
  onEdit: (wc: WorkCenter) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function WorkCenterList({ workCenters, onEdit, onDelete, onRefresh }: WorkCenterListProps) {
  if (workCenters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No work centers found. Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workCenters.map((wc) => (
        <Card key={wc.id} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{wc.name}</h3>
          {wc.location && <p className="text-sm text-gray-600 mt-2">Location: {wc.location}</p>}
          {wc.description && <p className="text-sm text-gray-600 mt-1">{wc.description}</p>}
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onEdit(wc)} variant="outline" size="sm">
              Edit
            </Button>
            <Button onClick={() => onDelete(wc.id)} variant="outline" size="sm" className="text-red-600">
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
