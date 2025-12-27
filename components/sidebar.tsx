"use client"

import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">GearGuard</h2>
        <p className="text-sm text-gray-400 mt-1">Maintenance Tracker</p>
      </div>

      <nav className="space-y-4 mb-8">
        <Link href="/protected/dashboard" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Dashboard
        </Link>
        <Link href="/protected/equipment" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Equipment
        </Link>
        <Link href="/protected/teams" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Teams
        </Link>
        <Link href="/protected/categories" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Categories
        </Link>
        <Link href="/protected/work-centers" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Work Centers
        </Link>
        <Link href="/protected/calendar" className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition">
          Calendar
        </Link>
      </nav>

      <div className="border-t border-slate-700 pt-4">
        <p className="text-sm text-gray-400 mb-4">{user?.email}</p>
        <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </div>
    </aside>
  )
}
