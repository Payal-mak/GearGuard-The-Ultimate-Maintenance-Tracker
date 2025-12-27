"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Equipment {
  id: string
  name: string
  serial_number?: string
  location?: string
  department?: string
  purchase_date?: string
  warranty_expiry?: string
}

interface EquipmentListProps {
  equipment: Equipment[]
  onEdit: (eq: Equipment) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function EquipmentList({ equipment, onEdit, onDelete, onRefresh }: EquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No equipment found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Equipment Name</TableHead>
            <TableHead className="font-semibold">Serial Number</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Purchase Date</TableHead>
            <TableHead className="font-semibold">Warranty Expiry</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((eq) => (
            <TableRow key={eq.id} className="hover:bg-gray-50 border-b">
              <TableCell className="font-medium text-gray-900">
                <Link href={`/protected/equipment/${eq.id}`} className="text-blue-600 hover:underline">
                  {eq.name}
                </Link>
              </TableCell>
              <TableCell className="text-gray-700">{eq.serial_number || "-"}</TableCell>
              <TableCell className="text-gray-700">{eq.location || "-"}</TableCell>
              <TableCell className="text-gray-700">{eq.department || "-"}</TableCell>
              <TableCell className="text-gray-700">{eq.purchase_date || "-"}</TableCell>
              <TableCell className="text-gray-700">{eq.warranty_expiry || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(eq)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(eq.id)}
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
