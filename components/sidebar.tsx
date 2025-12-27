"use client"

import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const isActive = (href: string) => {
    return pathname.includes(href)
  }

  const navItems = [
    { href: "/protected/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/protected/equipment", label: "Equipment", icon: "⚙️" },
    { href: "/protected/teams", label: "Teams", icon: "👥" },
    { href: "/protected/categories", label: "Categories", icon: "🏷️" },
    { href: "/protected/work-centers", label: "Work Centers", icon: "🏭" },
    { href: "/protected/calendar", label: "Calendar", icon: "📅" },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-lg border-r border-slate-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">GearGuard</h2>
        <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">MAINTENANCE TRACKER</p>
      </div>

      <nav className="space-y-1 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-gray-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700 pt-4">
        <div className="bg-slate-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-400 font-semibold mb-1">LOGGED IN AS</p>
          <p className="text-sm text-white truncate font-medium">{user?.email}</p>
        </div>
        <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 font-semibold">
          Logout
        </Button>
      </div>
    </aside>
  )
}
