"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import MaintenanceCalendar from "@/components/maintenance-calendar"

interface PreventiveRequest {
  id: string
  subject: string
  scheduled_date: string
  equipment?: { name: string }
  work_centers?: { name: string }
}

export default function CalendarPage() {
  const [requests, setRequests] = useState<PreventiveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadPreventiveRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("maintenance_requests")
        .select(
          `
          id,
          subject,
          scheduled_date,
          equipment(id, name),
          work_centers(id, name)
        `,
        )
        .eq("type", "Preventive")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true })

      if (data) setRequests(data)
      setIsLoading(false)
    }

    loadPreventiveRequests()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Loading calendar...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Maintenance Calendar</h1>
        <p className="text-gray-600 text-sm mt-1">View and manage all scheduled preventive maintenance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MaintenanceCalendar requests={requests} />
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 bg-white border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Maintenance</h2>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <p className="text-sm text-gray-500">No scheduled maintenance</p>
              ) : (
                requests.slice(0, 5).map((request) => (
                  <Card key={request.id} className="p-3 bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-sm text-gray-900">{request.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(request.scheduled_date).toLocaleDateString()}
                    </p>
                    {request.equipment && (
                      <p className="text-xs text-gray-500 mt-1">Equipment: {request.equipment.name}</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
