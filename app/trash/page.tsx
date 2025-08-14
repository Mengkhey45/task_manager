"use client"

import Layout from "../../components/Layout"
import { SlCalender } from "react-icons/sl"
import { BsPerson } from "react-icons/bs"
import { FiTrash2, FiRefreshCcw } from "react-icons/fi"
import { useTaskStore } from "../../store/useTaskStore"

export default function Trash() {
  const { tasks, updateTask, deleteTask } = useTaskStore()

  const trashedTasks = tasks.filter((task) => task.status === "trash")

  const handleRestoreTask = (taskId: string) => {
    updateTask(taskId, { status: "todo" })
  }

  const handleDeletePermanently = (taskId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this task? This action cannot be undone.")) {
      deleteTask(taskId)
    }
  }

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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
          <p className="text-gray-600 mt-2">Tasks that have been deleted and can be restored or permanently removed.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Trashed Tasks ({trashedTasks.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {trashedTasks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No tasks in trash.</div>
            ) : (
              trashedTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Trashed
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>
                          <SlCalender /> Due: {task.dueDate}
                        </span>
                        <span>
                          <BsPerson /> {task.assignee}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleRestoreTask(task.id)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <FiRefreshCcw /> Restore
                      </button>
                      <button
                        onClick={() => handleDeletePermanently(task.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FiTrash2 /> Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
