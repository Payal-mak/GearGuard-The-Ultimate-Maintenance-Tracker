"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface PreventiveRequest {
  id: string
  subject: string
  scheduled_date: string
  equipment?: { name: string }
  work_centers?: { name: string }
}

interface MaintenanceCalendarProps {
  requests: PreventiveRequest[]
}

export default function MaintenanceCalendar({ requests }: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getRequestsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return requests.filter((r) => r.scheduled_date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition">
              Previous
            </button>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded"></div>
        ))}

        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const dayRequests = getRequestsForDate(date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={day}
              className={`aspect-square border rounded p-1 ${
                isToday ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</p>
              <div className="space-y-1">
                {dayRequests.map((request) => (
                  <div
                    key={request.id}
                    className="text-xs bg-green-100 text-green-800 rounded p-1 truncate cursor-pointer hover:bg-green-200"
                    title={request.subject}
                  >
                    {request.subject.substring(0, 12)}...
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
