"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WorkCenterForm from "@/components/work-center-form"
import WorkCenterList from "@/components/work-center-list"

interface WorkCenter {
  id: string
  name: string
  location?: string
  description?: string
  created_at?: string
}

export default function WorkCentersPage() {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadWorkCenters = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("work_centers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setWorkCenters(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadWorkCenters()
  }, [supabase])

  const handleAddClick = () => {
    setSelectedWorkCenter(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (wc: WorkCenter) => {
    setSelectedWorkCenter(wc)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedWorkCenter(null)
    loadWorkCenters()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work center?")) return

    const { error } = await supabase.from("work_centers").delete().eq("id", id)
    if (!error) {
      loadWorkCenters()
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Work Centers</h1>
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          Add Work Center
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <Card className="p-6">
            <WorkCenterForm initialData={selectedWorkCenter} onClose={handleFormClose} onSuccess={handleFormClose} />
          </Card>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <WorkCenterList
          workCenters={workCenters}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRefresh={loadWorkCenters}
        />
      )}
    </div>
  )
}
