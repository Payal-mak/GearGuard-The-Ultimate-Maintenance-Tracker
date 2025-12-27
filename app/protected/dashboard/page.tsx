import { createClient } from "@/lib/supabase/server"
import KanbanBoard from "@/components/kanban-board"
import RequestsTable from "@/components/requests-table"

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Dashboard</h1>
        <p className="text-gray-600 mb-6">Track and manage all maintenance requests</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">New</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.new}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600 text-sm font-medium">In Progress</p>
            <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{stats.repaired}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Maintenance Requests</h2>
        </div>
        <div className="p-6">
          <RequestsTable requests={requests || []} />
        </div>
      </div>

      {/* Keep Kanban board below table */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Kanban Board View</h2>
        <KanbanBoard initialRequests={requests || []} />
      </div>
    </div>
  )
}
