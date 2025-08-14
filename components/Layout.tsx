"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // Using usePathname instead of useRouter for App Router
import { FiHome, FiClock, FiCheckSquare, FiEdit2, FiUsers, FiTrash2, FiBell, FiSearch, FiLogOut } from "react-icons/fi"

const sidebarLinks = [
  { name: "Dashboard", icon: <FiHome size={20} />, href: "/" },
  { name: "Pending Tasks", icon: <FiClock size={20} />, href: "/pending" },
  { name: "Completed Tasks", icon: <FiCheckSquare size={20} />, href: "/completed" },
  { name: "To Do", icon: <FiEdit2 size={20} />, href: "/todo" },
  { name: "Team", icon: <FiUsers size={20} />, href: "/team" },
  { name: "Trash", icon: <FiTrash2 size={20} />, href: "/trash" },
]

interface LayoutProps {
  children: ReactNode
}

function ProfileAvatar({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [imgError, setImgError] = useState(false)
  return imgError ? (
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-200">
      {fallback}
    </div>
  ) : (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover"
      onError={() => setImgError(true)}
    />
  )
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname() // Using usePathname hook for App Router
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        html { font-family: 'Inter', sans-serif; }
      `}</style>
      <header className="flex items-center ring-1 justify-between px-6 py-5 bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-2 select-none">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-400 text-white font-bold text-lg shadow">
            TF
          </span>
          <span className="font-bold text-lg tracking-tight text-blue-700">TaskFlow</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              className="w-full rounded-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-sm"
              placeholder="Search tasks..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-blue-600 transition focus:outline-none">
            <FiBell size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-blue-200 object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="text-right">
              <div className="font-semibold text-sm text-gray-800">Khey Alexander</div>
              <div className="text-xs text-gray-400">khey.alexander@email.com</div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 p-4 md:p-6 space-x-0 md:space-x-6">
        <aside className="w-72 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center min-h-[90vh] relative">
          <ProfileAvatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" fallback="KA" />
          <div className="font-bold text-lg text-gray-800 mt-2 mb-1">khey alexander</div>
          <div className="text-xs text-gray-500 mb-4">Manage your tasks efficiently</div>
          <div className="w-full mb-6">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Productivity</span>
              <span>100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full w-full"></div>
            </div>
          </div>
          <nav className="w-full flex-1 space-y-1 mt-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href // Using pathname instead of router.pathname
              return (
                <Link key={link.name} href={link.href} legacyBehavior>
                  <a
                    className={`w-full flex items-center px-5 py-3 rounded-xl font-semibold transition-colors text-base tracking-tight shadow-sm group border-l-4 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-blue-500 shadow-md"
                        : "hover:bg-gray-100 text-gray-700 border-transparent"
                    }`}
                  >
                    <span
                      className={`mr-4 text-xl transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}`}
                    >
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                </Link>
              )
            })}
          </nav>
          <div className="w-full mt-8 flex flex-col gap-2">
            <button className="flex items-center w-full px-5 py-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition font-medium text-base">
              <FiLogOut className="mr-3 text-xl" /> Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 flex flex-col space-y-6 mt-2 md:mt-0">{children}</main>
      </div>
    </div>
  )
}
