"use client"

import type React from "react"

import { Card } from "@/components/ui/card"

interface Request {
  id: string
  subject: string
  stage: string
  equipment?: { name: string }
  maintenance_teams?: { name: string }
  [key: string]: any
}

interface KanbanColumnProps {
  stage: string
  requests: Request[]
  onDragStart: (e: React.DragEvent, request: Request) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

const stageColors = {
  New: "bg-gray-100",
  "In Progress": "bg-blue-100",
  Repaired: "bg-green-100",
  Scrap: "bg-red-100",
}

const stageTitleColors = {
  New: "text-gray-700",
  "In Progress": "text-blue-700",
  Repaired: "text-green-700",
  Scrap: "text-red-700",
}

export default function KanbanColumn({ stage, requests, onDragStart, onDragOver, onDrop }: KanbanColumnProps) {
  return (
    <div
      className={`${stageColors[stage as keyof typeof stageColors]} rounded-lg p-4 min-h-96`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className={`${stageTitleColors[stage as keyof typeof stageTitleColors]} font-bold text-lg mb-4`}>{stage}</h2>
      <div className="space-y-3">
        {requests.map((request) => (
          <Card
            key={request.id}
            draggable
            onDragStart={(e) => onDragStart(e, request)}
            className="p-4 cursor-move hover:shadow-md transition bg-white"
          >
            <p className="font-semibold text-sm text-gray-900">{request.subject}</p>
            {request.equipment && <p className="text-xs text-gray-600 mt-2">Equipment: {request.equipment.name}</p>}
            {request.maintenance_teams && (
              <p className="text-xs text-gray-600">Team: {request.maintenance_teams.name}</p>
            )}
          </Card>
        ))}
        {requests.length === 0 && <p className="text-gray-500 text-sm italic">No requests yet</p>}
      </div>
    </div>
  )
}
