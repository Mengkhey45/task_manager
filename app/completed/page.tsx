"use client"

import Layout from "../../components/Layout"
import { FcBarChart, FcApproval, FcClock } from "react-icons/fc"
import { SlCalender } from "react-icons/sl"
import { BsPerson } from "react-icons/bs"
import { MdOutlineDownloadDone } from "react-icons/md"
import { useTaskStore } from "../../store/useTaskStore"

export default function CompletedTasks() {
  const { tasks, updateTask } = useTaskStore()

  const completedTasks = tasks.filter((task) => task.status === "completed")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReopenTask = (taskId: string) => {
    updateTask(taskId, { status: "todo", completedAt: undefined })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-gray-600 mt-2">Tasks that have been successfully completed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                <FcApproval />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                <FcBarChart />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
                <FcClock />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Time</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-gray-900">Completed Tasks ({completedTasks.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="p-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border-l-4 border-green-400"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-500 text-white shadow-sm">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 leading-relaxed">{task.description}</p>
                    <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <SlCalender className="text-blue-500" />
                        <span>Due: {task.dueDate}</span>
                      </span>
                      {task.completedAt && (
                        <span className="flex items-center space-x-1">
                          <MdOutlineDownloadDone className="text-green-500" />
                          <span>Completed: {task.completedAt}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <BsPerson className="text-green-500" />
                        <span>{task.assignee}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleReopenTask(task.id)}
                      className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Reopen
                    </button>
                    <button
                      onClick={() => updateTask(task.id, { status: "trash" })}
                      className="px-4 py-2 text-sm font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
