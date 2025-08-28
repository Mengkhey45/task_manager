// app/tasks/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("Failed to load task", err);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    router.push("/"); // go back to dashboard
  };

  if (!task) return <p className="p-6 text-gray-500">Loading task...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-600 mb-2">{task.description || "No description"}</p>
      <p className="text-sm text-gray-500 mb-1">Priority: {task.priority}</p>
      <p className="text-sm text-gray-500 mb-1">Status: {task.status}</p>
      <p className="text-sm text-gray-500 mb-1">
        Assignee: {task.assignee?.name || "Unassigned"}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/tasks/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
