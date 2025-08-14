"use client"

import Layout from "../../components/Layout"
import { SlCalender } from "react-icons/sl"
import { BsPerson } from "react-icons/bs"
import { useState } from "react"
import TaskModal from "../../components/TaskModal"
import { useTaskStore, type Task } from "../../store/useTaskStore"
import { useTeamStore } from "../../store/useTeamStore"

export default function PendingTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore()
  const { members } = useTeamStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All Assignees")

  const pendingTasks = tasks.filter((task) => task.status === "pending")

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId)
    if (taskToUpdate) {
      if (newStatus === "completed") {
        updateTask(taskId, { status: newStatus, completedAt: new Date().toISOString().split("T")[0] })
      } else {
        updateTask(taskId, { status: newStatus })
      }
    }
  }

  const filteredTasks = pendingTasks.filter((task) => {
    const matchesPriority = priorityFilter === "All Priorities" || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "All Assignees" || task.assignee === assigneeFilter
    return matchesPriority && matchesAssignee
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border border-red-400"
      case "Medium":
        return "bg-amber-100 text-amber-700 border border-amber-400"
      case "Low":
        return "bg-emerald-100 text-emerald-700 border border-emerald-400"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-400"
    }
  }

  const getTaskBorderColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-red-500"
      case "Medium":
        return "border-l-amber-500"
      case "Low":
        return "border-l-emerald-500"
      default:
        return "border-l-gray-500"
    }
  }

  const openAddModal = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSave = (taskData: any) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData)
    } else {
      addTask({
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "Low",
        dueDate: taskData.dueDate,
        assignee: taskData.assignee,
        status: "pending",
      })
    }
    setSelectedTask(null)
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    updateTask(id, { status: "trash" })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Pending Tasks</h1>
              <p className="text-blue-100 mt-1">Tasks waiting to be started or in progress</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-md"
            >
              + Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tasks ({filteredTasks.length})</h2>
            </div>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${getTaskBorderColor(task.priority)} hover:shadow-md hover:translate-y-[-2px] transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title || "Untitled Task"}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description || "No description provided"}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <SlCalender className="mr-1" />
                        Due: {task.dueDate}
                      </span>
                      <span className="flex items-center">
                        <BsPerson className="mr-1" />
                        {task.assignee}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusChange(task.id, "todo")}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                    >
                      Move to Todo
                    </button>
                    <button
                      onClick={() => openEditModal(task)}
                      className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
                <p className="text-gray-500">All caught up! Add a new task to get started.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option>All Priorities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="All Assignees">All Assignees</option>
                    {members && members.length > 0 ? (
                      members.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No team members found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={selectedTask}
        />
      </div>
    </Layout>
  )
}
