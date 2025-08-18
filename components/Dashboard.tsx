"use client"

import { useTeamStore } from "../store/useTeamStore" // add this import at top
import { useState } from "react"
import {
  FiList,
  FiCheckSquare,
  FiCalendar,
  FiChevronRight,
  FiMessageCircle,
  FiFileText,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiBarChart,
} from "react-icons/fi"
import { RiFireLine } from "react-icons/ri"
import TaskModal from "./TaskModal"
import { useTaskStore } from "../store/useTaskStore"

const overview = [
  { label: "Total Tasks", value: 24, icon: <FiList size={22} />, color: "bg-blue-100 text-blue-600" },
  { label: "In Progress", value: 8, icon: <FiBarChart size={22} />, color: "bg-yellow-100 text-yellow-600" },
  { label: "Completed Today", value: 12, icon: <FiCheckSquare size={22} />, color: "bg-green-100 text-green-600" },
  { label: "Due This Week", value: 12, icon: <FiCalendar size={22} />, color: "bg-purple-100 text-purple-600" },
]

const priorityIcons = {
  low: <RiFireLine size={18} className="text-blue-400" />,
  medium: <RiFireLine size={18} className="text-yellow-500" />,
  high: <RiFireLine size={18} className="text-red-500" />,
}

export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  const pendingTasks = tasks.filter((task) => task.status === "pending").slice(0, 5)



const { members } = useTeamStore() // inside your Dashboard component

const handleSave = async (taskData: any) => {
  if (editingTask) {
    updateTask(editingTask.id, taskData);
  } else {
    addTask({
      ...taskData,
      status: "pending",
    });

    // Find the assigned member's email
    const assignedMember = members.find((m) => m.name === taskData.assignee);
    if (assignedMember?.email) {
      try {
        await fetch("/api/send-task-email", { // match PendingTasks endpoint
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            assigneeEmail: assignedMember.email,
            dueDate: taskData.dueDate,
          }),
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }
  }

  setIsModalOpen(false);
  setEditingTask(null);
};


  const handleDelete = (id: string) => {
    updateTask(id, { status: "trash" })
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-2 md:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overview.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 min-h-[120px]"
          >
            <div className={`mb-2 w-12 h-12 flex items-center justify-center rounded-full ${item.color} shadow`}>
              {item.icon}
            </div>
            <div className="text-3xl font-bold text-gray-800">{item.value}</div>
            <div className="text-sm font-medium mt-1 text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <span className="font-semibold text-gray-700">Task Progress</span>
          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div className="h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full w-3/4"></div>
          </div>
          <span className="text-sm text-gray-500">
            Task Completed: <span className="font-bold text-blue-600">18</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">1/1</span>
          <FiChevronRight className="text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-gray-800">Recent Pending Tasks</span>
          <button
            onClick={() => {
              setEditingTask(null)
              setIsModalOpen(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            + Add New Task
          </button>
        </div>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col md:flex-row md:items-center justify-between rounded-xl px-4 py-3 ${
                task.priority === "Low" ? "bg-green-100" : task.priority === "Medium" ? "bg-yellow-100" : "bg-red-100"
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow ${
                    task.priority === "Low"
                      ? "ring-2 ring-blue-200"
                      : task.priority === "Medium"
                        ? "ring-2 ring-yellow-200"
                        : "ring-2 ring-red-200"
                  }`}
                >
                  {priorityIcons[task.priority?.toLowerCase() as keyof typeof priorityIcons]}
                </span>
                <span className="font-medium text-gray-800">{task.title}</span>
                <span
                  className={`text-xs font-semibold capitalize ${
                    task.priority === "Low"
                      ? "text-blue-500"
                      : task.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {task.priority} Priority
                </span>
                <span className="text-xs text-gray-400">{task.dueDate}</span>
                <span className="flex items-center text-xs text-gray-400">
                  <FiMessageCircle className="mr-1" />0
                </span>
                <span className="flex items-center text-xs text-gray-400">
                  <FiFileText className="mr-1" />0
                </span>
                <span className="flex items-center text-xs text-gray-400">
                  <FiUsers className="mr-1" />1
                </span>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="flex items-center gap-1 text-blue-600 text-xs font-semibold hover:underline"
                  onClick={() => {
                    setEditingTask(task)
                    setIsModalOpen(true)
                  }}
                >
                  <FiEdit2 />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1 text-red-600 text-xs font-semibold hover:underline"
                  onClick={() => handleDelete(task.id)}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  )
}
