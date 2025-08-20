"use client";

import { useState, useEffect } from "react";
import { useTeamStore } from "../store/useTeamStore";
import { FiList, FiCheckSquare, FiCalendar, FiBarChart } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";
import TaskModal from "./TaskModal";

const overview = [
  { label: "Total Tasks", icon: <FiList size={22} />, color: "bg-blue-100 text-blue-600" },
  { label: "In Progress", icon: <FiBarChart size={22} />, color: "bg-yellow-100 text-yellow-600" },
  { label: "Completed Today", icon: <FiCheckSquare size={22} />, color: "bg-green-100 text-green-600" },
  { label: "Due This Week", icon: <FiCalendar size={22} />, color: "bg-purple-100 text-purple-600" },
];

const priorityIcons = {
  low: <RiFireLine size={18} className="text-blue-400" />,
  medium: <RiFireLine size={18} className="text-yellow-500" />,
  high: <RiFireLine size={18} className="text-red-500" />,
};

export default function Dashboard() {
  const { members } = useTeamStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Fetch tasks from backend or sessionStorage
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
      sessionStorage.setItem("tasks", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    const cachedTasks = sessionStorage.getItem("tasks");
    if (cachedTasks) {
      setTasks(JSON.parse(cachedTasks));
    } else {
      fetchTasks();
    }
  }, []);

const handleSave = async (taskData: any) => {
  try {
    const updates = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      assigneeId: taskData.assignee?.id ? Number(taskData.assignee.id) : null,
      dueDate: taskData.dueDate ? taskData.dueDate : null,
    };

    if (editingTask) {
      // UPDATE existing task
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } else {
      // CREATE new task
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]); // instantly update UI
    }

    setEditingTask(null);
    setIsModalOpen(false);
    fetchTasks(); // refresh from backend
    window.dispatchEvent(new Event("tasksUpdated")); // notify other pages
  } catch (err) {
    console.error(err);
    alert("Failed to save task");
  }
};

const handleDelete = async (id: number) => {
  try {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "trash" }), // Move to trash
    });
    fetchTasks();
    window.dispatchEvent(new Event("tasksUpdated")); // notify trash page
  } catch (err) {
    console.error(err);
  }
};


  const pendingTasks = tasks.filter((task) => task.status === "pending").slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-2 md:px-0">
      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overview.map((item) => (
          <div key={item.label} className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 min-h-[120px]">
            <div className={`mb-2 w-12 h-12 flex items-center justify-center rounded-full ${item.color} shadow`}>
              {item.icon}
            </div>
            <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-sm font-medium mt-1 text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-gray-800">Recent Pending Tasks</span>
          <button
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            + Add New Task
          </button>
        </div>

        <div className="space-y-3">
          {pendingTasks.length === 0 && <div className="text-gray-400 text-center py-4">No pending tasks</div>}

          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col md:flex-row md:items-center justify-between rounded-xl px-4 py-3 ${
                task.priority === "Low" ? "bg-green-100" : task.priority === "Medium" ? "bg-yellow-100" : "bg-red-100"
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow">
                  {priorityIcons[task.priority?.toLowerCase() as keyof typeof priorityIcons]}
                </span>
                <span className="font-medium text-gray-800">{task.title}</span>
                <span className="text-xs text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
                <span className="text-xs text-gray-500">{task.assignee?.name || "Unassigned"}</span>
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="text-blue-600 text-xs font-semibold hover:underline"
                  onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 text-xs font-semibold hover:underline"
                  onClick={() => handleDelete(task.id)}
                >
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
  );
}
