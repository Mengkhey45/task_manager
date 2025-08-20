"use client";

import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { BsPerson, BsCheckCircleFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignee?: string;
}

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from sessionStorage first
  useEffect(() => {
    const cached = sessionStorage.getItem("tasks");
    if (cached) {
      setTasks(JSON.parse(cached));
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data: Task[] = await res.json();
      setTasks(data);
      sessionStorage.setItem("tasks", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const newStatus = task.status === "todo" ? "completed" : "todo";
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update tasks locally and cache
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
      sessionStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.error(err);
    }
  };

const handleDeleteTask = async (taskId: number) => {
  try {
    // Update backend: move task to trash
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "trash" }),
    });

    // Update local state
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: "trash" } : t
    );
    setTasks(updatedTasks);

    // Update sessionStorage
    sessionStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Notify other pages (Trash page will update automatically)
    window.dispatchEvent(new Event("tasksUpdated"));
  } catch (err) {
    console.error(err);
  }
};



  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return {
          gradient: "bg-gradient-to-br from-rose-100 via-pink-100 to-red-100",
          border: "border-rose-300",
          accent: "bg-gradient-to-r from-rose-500 to-pink-500",
          badge: "bg-rose-500 text-white",
          glow: "shadow-rose-200",
        };
      case "Medium":
        return {
          gradient: "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100",
          border: "border-amber-300",
          accent: "bg-gradient-to-r from-amber-500 to-yellow-500",
          badge: "bg-amber-500 text-white",
          glow: "shadow-amber-200",
        };
      case "Low":
        return {
          gradient: "bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100",
          border: "border-emerald-300",
          accent: "bg-gradient-to-r from-emerald-500 to-green-500",
          badge: "bg-emerald-500 text-white",
          glow: "shadow-emerald-200",
        };
      default:
        return {
          gradient: "bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100",
          border: "border-slate-300",
          accent: "bg-gradient-to-r from-slate-500 to-gray-500",
          badge: "bg-slate-500 text-white",
          glow: "shadow-slate-200",
        };
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">To Do</h1>
              <p className="text-indigo-100 text-sm">Manage your active tasks and track progress</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {todoTasks.length} <span className="text-sm font-medium text-indigo-200">active</span>
              </div>
              <div className="text-xs text-green-200 font-medium">{completedTasks.length} completed</div>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="space-y-4">
          {todoTasks.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-100 to-slate-200 rounded-xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BsCheckCircleFill className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No active tasks remaining. Great work!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todoTasks.map((task) => {
                const styles = getPriorityStyles(task.priority);
                return (
                  <div
                    key={task.id}
                    className={`group relative overflow-hidden rounded-xl ${styles.gradient} border ${styles.border} shadow-sm hover:shadow-md ${styles.glow} transition-all duration-300`}
                  >
                    <div className={`absolute left-0 top-0 w-1 h-full ${styles.accent}`}></div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              checked={task.status === "completed"}
                              onChange={() => toggleTaskCompletion(task)}
                              className="h-5 w-5 text-indigo-400 focus:ring-indigo-300 border-2 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge} shadow-sm`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && (
                              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1 bg-white/80 px-2 py-1 rounded">
                                <SlCalender size={12} />
                                <span>Due: {task.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-white/80 px-2 py-1 rounded">
                                <BsPerson size={12} />
                                <span>{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-xs font-medium"
                          >
                            <FiTrash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border border-green-300 shadow-sm hover:shadow-md transition-all duration-300 opacity-75 hover:opacity-90"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold line-through text-gray-500">{task.title}</h3>
                    {task.description && <p className="text-gray-400 line-through text-sm">{task.description}</p>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-xs font-medium"
                    >
                      <FiTrash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
