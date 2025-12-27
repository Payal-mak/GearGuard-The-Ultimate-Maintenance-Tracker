"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    <TooltipProvider>
      <Card className="p-6 bg-white border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <Button onClick={handlePrevMonth} variant="outline" size="sm">
                Previous
              </Button>
              <Button onClick={handleNextMonth} variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
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
                className={`aspect-square border rounded p-2 transition-colors ${
                  isToday ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                } cursor-pointer`}
              >
                <p className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</p>
                <div className="space-y-1">
                  {dayRequests.length > 0 && (
                    <>
                      {dayRequests.map((request, idx) => (
                        <Tooltip key={request.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs rounded px-2 py-1 truncate cursor-pointer transition-colors ${
                                idx === 0
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }`}
                            >
                              {request.subject.substring(0, 14)}
                              {request.subject.length > 14 ? "..." : ""}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-semibold">{request.subject}</p>
                              {request.equipment && <p className="text-sm">Equipment: {request.equipment.name}</p>}
                              {request.work_centers && (
                                <p className="text-sm">Work Center: {request.work_centers.name}</p>
                              )}
                              <p className="text-xs text-gray-400">
                                {new Date(request.scheduled_date).toLocaleDateString()}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {dayRequests.length > 2 && (
                        <p className="text-xs text-gray-500 px-2">+{dayRequests.length - 2} more</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </TooltipProvider>
  )
}
