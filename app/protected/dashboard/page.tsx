import { createClient } from "@/lib/supabase/server"
import KanbanBoard from "@/components/kanban-board"
import { Card } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select(
      `
      id,
      subject,
      stage,
      type,
      is_overdue,
      duration_hours,
      scheduled_date,
      created_at,
      equipment(id, name, category_id),
      maintenance_teams(id, name),
      work_centers(id, name)
    `,
    )
    .order("created_at", { ascending: false })

  const stats = {
    total: requests?.length || 0,
    new: requests?.filter((r) => r.stage === "New").length || 0,
    inProgress: requests?.filter((r) => r.stage === "In Progress").length || 0,
    repaired: requests?.filter((r) => r.stage === "Repaired").length || 0,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Maintenance Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <p className="text-gray-600 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="p-4 bg-blue-50">
            <p className="text-blue-600 text-sm">New</p>
            <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
          </Card>
          <Card className="p-4 bg-yellow-50">
            <p className="text-yellow-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
          </Card>
          <Card className="p-4 bg-green-50">
            <p className="text-green-600 text-sm">Repaired</p>
            <p className="text-2xl font-bold text-green-900">{stats.repaired}</p>
          </Card>
        </div>
      </div>

      <KanbanBoard initialRequests={requests || []} />
    </div>
  )
}
