"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No work centers found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Work Center Name</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workCenters.map((wc) => (
            <TableRow key={wc.id} className="hover:bg-gray-50 border-b">
              <TableCell className="font-medium text-gray-900">{wc.name}</TableCell>
              <TableCell className="text-gray-700">{wc.location || "-"}</TableCell>
              <TableCell className="text-gray-700">{wc.description || "-"}</TableCell>
              <TableCell className="text-gray-700">
                {wc.created_at ? new Date(wc.created_at).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(wc)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(wc.id)}
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
