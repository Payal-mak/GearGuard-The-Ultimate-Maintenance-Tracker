"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Request {
  id: string
  subject: string
  stage: "New" | "In Progress" | "Repaired" | "Scrap"
  type: "Corrective" | "Preventive"
  is_overdue?: boolean
  duration_hours?: number
  scheduled_date?: string
  created_at: string
  equipment?: { id: string; name: string }
  work_centers?: { id: string; name: string }
  maintenance_teams?: { id: string; name: string }
}

interface RequestsTableProps {
  requests: Request[]
}

const stageColors = {
  New: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Repaired: "bg-green-100 text-green-800",
  Scrap: "bg-red-100 text-red-800",
}

const typeColors = {
  Corrective: "bg-orange-100 text-orange-800",
  Preventive: "bg-purple-100 text-purple-800",
}

export default function RequestsTable({ requests }: RequestsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No maintenance requests found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold">Equipment/Center</TableHead>
            <TableHead className="font-semibold">Team</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold">Scheduled</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className="cursor-pointer hover:bg-gray-50 border-b"
              onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{request.subject}</p>
                  {request.is_overdue && <Badge className="bg-red-500 text-white mt-1">Overdue</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                {request.equipment?.name || request.work_centers?.name || "N/A"}
              </TableCell>
              <TableCell className="text-gray-700">{request.maintenance_teams?.name || "N/A"}</TableCell>
              <TableCell>
                <Badge className={typeColors[request.type]}>{request.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={stageColors[request.stage]}>{request.stage}</Badge>
              </TableCell>
              <TableCell className="text-gray-700">
                {request.scheduled_date ? format(new Date(request.scheduled_date), "MMM dd, yyyy") : "-"}
              </TableCell>
              <TableCell>
                <Link href={`/protected/requests/${request.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
