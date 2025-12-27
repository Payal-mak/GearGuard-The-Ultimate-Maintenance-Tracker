"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EquipmentForm from "@/components/equipment-form"
import EquipmentList from "@/components/equipment-list"

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

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadEquipment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("equipment")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setEquipment(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadEquipment()
  }, [supabase])

  const handleAddClick = () => {
    setSelectedEquipment(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedEquipment(null)
    loadEquipment()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return

    const { error } = await supabase.from("equipment").delete().eq("id", id)
    if (!error) {
      loadEquipment()
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          Add Equipment
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <Card className="p-6">
            <EquipmentForm initialData={selectedEquipment} onClose={handleFormClose} onSuccess={handleFormClose} />
          </Card>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <EquipmentList
          equipment={equipment}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRefresh={loadEquipment}
        />
      )}
    </div>
  )
}
