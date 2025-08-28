"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  FiHome,
  FiClock,
  FiEdit2,
  FiCheckSquare,
  FiUsers,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

interface SidebarItem {
  name: string
  href: string
  icon: React.ReactNode
}

const Sidebar: React.FC = () => {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", href: "/", icon: <FiHome size={24} /> },
    { name: "Pending Tasks", href: "/pending", icon: <FiClock size={24} /> },
    { name: "To Do", href: "/todo", icon: <FiEdit2 size={24} /> },
    { name: "Completed Tasks", href: "/completed", icon: <FiCheckSquare size={24} /> },
    { name: "Team", href: "/team", icon: <FiUsers size={24} /> },
    { name: "Trash", href: "/trash", icon: <FiTrash2 size={24} /> },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-80"} h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">TF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-slate-400 text-sm">Manage efficiently</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive =
            router.pathname === item.href ||
            (item.href === "/" && (router.pathname === "/" || router.pathname === "/dashboard"))

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`
                flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
                    : "hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/50"
                }
              `}
              >
                <div
                  className={`
                  flex items-center justify-center w-12 h-12 rounded-lg transition-colors
                  ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                `}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="ml-4 flex-1">
                    <span
                      className={`
                      font-semibold text-base transition-colors
                      ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}
                    `}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">KA</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Khey Alexander</p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
