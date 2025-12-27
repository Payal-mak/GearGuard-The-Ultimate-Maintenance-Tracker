"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No equipment found. Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {equipment.map((eq) => (
        <Card key={eq.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{eq.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                {eq.serial_number && <p>Serial: {eq.serial_number}</p>}
                {eq.location && <p>Location: {eq.location}</p>}
                {eq.department && <p>Department: {eq.department}</p>}
                {eq.purchase_date && <p>Purchased: {eq.purchase_date}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onEdit(eq)} variant="outline" size="sm">
                Edit
              </Button>
              <Button onClick={() => onDelete(eq.id)} variant="outline" size="sm" className="text-red-600">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
