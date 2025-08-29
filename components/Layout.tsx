


"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { 
  FiHome, FiClock, FiCheckSquare, FiEdit2, FiUsers, 
  FiTrash2, FiBell, FiSearch, FiLogOut 
} from "react-icons/fi"

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
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-white shadow">
      {fallback}
    </div>
  ) : (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover hover:ring-2 hover:ring-blue-300 transition"
      onError={() => setImgError(true)}
    />
  )
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signin")
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen text-gray-500 text-lg">Loading...</div>
  }

  // NOTE: layout should render the application chrome regardless of whether
  // the client-side next-auth session has hydrated. Server-side routes (e.g.
  // `app/page.tsx`) already perform auth redirects using Supabase. Returning
  // early here caused the header/sidebar to disappear for authenticated users
  // when the client session wasn't available yet.

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">

      {/* Global Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        html { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-20 rounded-b-2xl">
        <div className="flex items-center space-x-2 select-none">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-400 text-white font-bold text-lg shadow-md">
            TF
          </span>
          <span className="font-bold text-xl tracking-tight text-blue-700">TaskFlow</span>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full rounded-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-blue-600 transition">
            <FiBell size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-2">
            <ProfileAvatar
              src={session?.user?.image ?? "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Profile"
              fallback={(session?.user?.name?.charAt(0) ?? "U").toUpperCase()}
            />
            <div className="text-right">
              <div className="font-semibold text-sm text-gray-800">{session?.user?.name ?? "Guest"}</div>
              <div className="text-xs text-gray-400">{session?.user?.email ?? ""}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 p-4 md:p-6 gap-6">

        {/* Sidebar */}
        <aside className="w-72 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center min-h-[90vh] relative">
          <ProfileAvatar
            src={session?.user?.image ?? "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="Profile"
            fallback={(session?.user?.name?.charAt(0) ?? "U").toUpperCase()}
          />
          <div className="font-bold text-lg text-gray-800 mt-2 mb-1">{session?.user?.name ?? "Guest"}</div>
          <div className="text-xs text-gray-500 mb-4 text-center">Manage your tasks efficiently</div>

          <nav className="w-full flex-1 space-y-1 mt-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.name} href={link.href} legacyBehavior>
                  <a
                    className={`w-full flex items-center px-5 py-3 rounded-xl font-semibold text-base tracking-tight transition-all group border-l-4 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-500 shadow-md"
                        : "hover:bg-gray-100 text-gray-700 border-transparent"
                    }`}
                  >
                    <span
                      className={`mr-4 text-xl transition-colors ${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                </Link>
              )
            })}
          </nav>

          <div className="w-full mt-6 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-5 py-2 rounded-xl text-gray-600 hover:text-white hover:bg-blue-600 transition font-medium text-base shadow-sm hover:shadow-md"
            >
              <FiLogOut className="mr-3 text-xl" /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col space-y-6 mt-2 md:mt-0">{children}</main>
      </div>
    </div>
  )
}
