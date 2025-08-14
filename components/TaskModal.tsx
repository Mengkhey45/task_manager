"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTeamStore } from "../store/useTeamStore" // Import team store

type Task = {
  id?: string
  title: string // Changed from 'name' to 'title'
  description: string // Added description
  priority: "Low" | "Medium" | "High" // Capitalized to match pending tasks
  dueDate: string // Changed from 'date' to 'dueDate'
  assignee: string // Added assignee
  status?: string // Added status for global store
}

type TaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  initialData?: Task | null
}

export default function TaskModal({ isOpen, onClose, onSave, initialData }: TaskModalProps) {
  const { members } = useTeamStore() // Get team members

  console.log("TaskModal members:", members)

  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignee: "",
    status: "pending",
  })

  useEffect(() => {
    if (initialData) {
      setTask(initialData)
    } else {
      setTask({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",
        assignee: "",
        status: "pending",
      })
    }
  }, [initialData, isOpen]) // Add isOpen dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!task.title.trim()) {
      alert("Please enter a task title")
      return
    }
    if (!task.dueDate) {
      alert("Please select a due date")
      return
    }
    if (!task.assignee.trim()) {
      alert("Please enter an assignee")
      return
    }

    onSave(task)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">{initialData ? "Edit Task" : "Add New Task"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee *</label>
            <select
              name="assignee"
              value={task.assignee}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select an assignee</option>
              {members && members.length > 0 ? (
                members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No team members available
                </option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">{members?.length || 0} team members available</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
