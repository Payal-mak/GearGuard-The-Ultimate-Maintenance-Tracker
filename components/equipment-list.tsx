"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Equipment {
  id: string
  name: string
  serial_number?: string
  location?: string
  department?: string
  purchase_date?: string
  warranty_expiry?: string
  assigned_to?: string
  category_id?: string
  maintenance_team_id?: string
}

interface EquipmentListProps {
  equipment: Equipment[]
  onEdit: (eq: Equipment) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

interface Category {
  id: string
  name: string
}

export default function EquipmentList({ equipment, onEdit, onDelete, onRefresh }: EquipmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from("equipment_categories").select("id, name")
      if (data) setCategories(data)
    }
    loadCategories()
  }, [supabase])

  const filteredEquipment = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "-"
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "-"
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No equipment found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 border-b">
        <Input
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Equipment Name</TableHead>
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Serial Number</TableHead>
              <TableHead className="font-semibold">Technician</TableHead>
              <TableHead className="font-semibold">Equipment Category</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((eq) => (
              <TableRow key={eq.id} className="hover:bg-gray-50 border-b">
                <TableCell className="font-medium text-gray-900">
                  <Link href={`/protected/equipment/${eq.id}`} className="text-blue-600 hover:underline">
                    {eq.name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-700">{eq.assigned_to || "-"}</TableCell>
                <TableCell className="text-gray-700">{eq.department || "-"}</TableCell>
                <TableCell className="text-gray-700">{eq.serial_number || "-"}</TableCell>
                <TableCell className="text-gray-700">{eq.assigned_to || "-"}</TableCell>
                <TableCell className="text-gray-700">{getCategoryName(eq.category_id)}</TableCell>
                <TableCell className="text-gray-700">My Company (San Francisco)</TableCell>
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
    </div>
  )
}
