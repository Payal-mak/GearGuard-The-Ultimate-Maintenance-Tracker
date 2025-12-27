"use client"

import { Card } from "@/components/ui/card"

interface Equipment {
  id: string
  name: string
  serial_number?: string
  location?: string
  department?: string
  purchase_date?: string
  warranty_expiry?: string
  category_id?: string
  maintenance_team_id?: string
}

interface EquipmentDetailCardProps {
  equipment: Equipment
}

export default function EquipmentDetailCard({ equipment }: EquipmentDetailCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Details</h2>

      <div className="space-y-4">
        {equipment.serial_number && (
          <div>
            <p className="text-sm text-gray-600">Serial Number</p>
            <p className="font-semibold text-gray-900">{equipment.serial_number}</p>
          </div>
        )}

        {equipment.location && (
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-900">{equipment.location}</p>
          </div>
        )}

        {equipment.department && (
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-semibold text-gray-900">{equipment.department}</p>
          </div>
        )}

        {equipment.purchase_date && (
          <div>
            <p className="text-sm text-gray-600">Purchase Date</p>
            <p className="font-semibold text-gray-900">{equipment.purchase_date}</p>
          </div>
        )}

        {equipment.warranty_expiry && (
          <div>
            <p className="text-sm text-gray-600">Warranty Expiry</p>
            <p className="font-semibold text-gray-900">{equipment.warranty_expiry}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
