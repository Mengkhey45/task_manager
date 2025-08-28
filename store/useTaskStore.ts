// import { create } from "zustand"

// export interface Task {
//   id: string
//   title: string
//   description: string
//   priority: "Low" | "Medium" | "High"
//   dueDate: string
//   assignee: string
//   status: "todo" | "pending" | "completed" | "trash"
//   createdAt: string
//   completedAt?: string
// }

// interface TaskStore {
//   tasks: Task[]
//   addTask: (task: Omit<Task, "id" | "createdAt">) => void
//   updateTask: (id: string, updates: Partial<Task>) => void
//   deleteTask: (id: string) => void
//   moveTask: (id: string, status: Task["status"]) => void
// }

// export const useTaskStore = create<TaskStore>((set) => ({
//   tasks: [
//     {
//       id: "1",
//       title: "Design Homepage Layout",
//       description: "Create wireframes and mockups for the new homepage design",
//       priority: "High",
//       dueDate: "2024-01-15",
//       assignee: "John Doe",
//       status: "pending",
//       createdAt: "2024-01-10",
//     },
//     {
//       id: "2",
//       title: "Implement User Authentication",
//       description: "Set up login and registration functionality",
//       priority: "High",
//       dueDate: "2024-01-20",
//       assignee: "Jane Smith",
//       status: "todo",
//       createdAt: "2024-01-11",
//     },
//     {
//       id: "3",
//       title: "Write API Documentation",
//       description: "Document all API endpoints and their usage",
//       priority: "Medium",
//       dueDate: "2024-01-25",
//       assignee: "Mike Johnson",
//       status: "completed",
//       createdAt: "2024-01-08",
//       completedAt: "2024-01-12",
//     },
//   ],
//   addTask: (task) =>
//     set((state) => ({
//       tasks: [
//         ...state.tasks,
//         {
//           ...task,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString().split("T")[0],
//         },
//       ],
//     })),
//   updateTask: (id, updates) =>
//     set((state) => ({
//       tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
//     })),
//   deleteTask: (id) =>
//     set((state) => ({
//       tasks: state.tasks.filter((task) => task.id !== id),
//     })),
//   moveTask: (id, status) =>
//     set((state) => ({
//       tasks: state.tasks.map((task) =>
//         task.id === id
//           ? {
//               ...task,
//               status,
//               completedAt: status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
//             }
//           : task,
//       ),
//     })),
// }))


"use client";

import { create } from "zustand";

export interface Assignee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignee?: Assignee | null;
  createdAt?: string;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  fetchTasks: async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: Array.isArray(data) ? data : [] });
      sessionStorage.setItem("tasks", JSON.stringify(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      set({ tasks: [] });
    }
  },
  updateTask: (taskId, updates) => {
    const updatedTasks = get().tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    set({ tasks: updatedTasks });
    sessionStorage.setItem("tasks", JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event("tasksUpdated"));
  },
  deleteTask: (taskId) => {
    const updatedTasks = get().tasks.filter((t) => t.id !== taskId);
    set({ tasks: updatedTasks });
    const allTasks = JSON.parse(sessionStorage.getItem("tasks") || "[]");
    const newAll = allTasks.filter((t: Task) => t.id !== taskId);
    sessionStorage.setItem("tasks", JSON.stringify(newAll));
    window.dispatchEvent(new Event("tasksUpdated"));
  },
}));
