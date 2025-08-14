"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Task {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  dueDate: string
  assignee: string
  status: "pending" | "todo" | "completed"
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  moveTask: (id: number, newStatus: "pending" | "todo" | "completed") => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Review quarterly reports",
    description: "Analyze and provide feedback on Q4 performance metrics",
    priority: "High",
    dueDate: "2024-01-15",
    assignee: "John Doe",
    status: "pending",
  },
  {
    id: 2,
    title: "Design user interface mockups",
    description: "Create wireframes and mockups for the new feature",
    priority: "High",
    dueDate: "2024-01-25",
    assignee: "Sarah Wilson",
    status: "todo",
  },
  {
    id: 3,
    title: "Update website content",
    description: "Refresh homepage and product pages with new information",
    priority: "Medium",
    dueDate: "2024-01-20",
    assignee: "Jane Smith",
    status: "pending",
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const moveTask = (id: number, newStatus: "pending" | "todo" | "completed") => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task)))
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
