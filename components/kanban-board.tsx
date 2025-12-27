"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import KanbanColumn from "@/components/kanban-column"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Request {
  id: string
  subject: string
  stage: "New" | "In Progress" | "Repaired" | "Scrap"
  equipment?: { name: string }
  maintenance_teams?: { name: string }
  [key: string]: any
}

interface KanbanBoardProps {
  initialRequests: Request[]
}

const STAGES = ["New", "In Progress", "Repaired", "Scrap"] as const

export default function KanbanBoard({ initialRequests }: KanbanBoardProps) {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const supabase = createClient()

  const handleDragStart = (e: React.DragEvent, request: Request) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("requestId", request.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent, newStage: string) => {
      e.preventDefault()
      const requestId = e.dataTransfer.getData("requestId")

      const requestToMove = requests.find((r) => r.id === requestId)
      if (!requestToMove) return

      // Update local state optimistically
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, stage: newStage } : r)))

      // Update in Supabase
      const { error } = await supabase.from("maintenance_requests").update({ stage: newStage }).eq("id", requestId)

      if (error) {
        console.error("Error updating request:", error)
        // Revert on error
        setRequests(initialRequests)
      }
    },
    [requests, supabase, initialRequests],
  )

  const groupedRequests = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = requests.filter((r) => r.stage === stage)
      return acc
    },
    {} as Record<string, Request[]>,
  )

  return (
    <div className="space-y-6">
      <Link href="/protected/requests/new">
        <Button className="bg-blue-600 hover:bg-blue-700">New Maintenance Request</Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            requests={groupedRequests[stage]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          />
        ))}
      </div>
    </div>
  )
}
