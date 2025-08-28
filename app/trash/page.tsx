// "use client";

// import Layout from "../../components/Layout";
// import { useState, useEffect } from "react";
// import { SlCalender } from "react-icons/sl";
// import { BsPerson } from "react-icons/bs";
// import { FiTrash2, FiRefreshCcw } from "react-icons/fi";

// interface Member {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// interface Task {
//   id: number;
//   title: string;
//   description?: string;
//   priority: string;
//   status: string;
//   dueDate?: string;
//   assigneeId?: number;
//   assignee?: Member | null;
// }

// export default function Trash() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [members, setMembers] = useState<Member[]>([]);

//   // Fetch members once
//   useEffect(() => {
//     const cached = sessionStorage.getItem("members");
//     if (cached) {
//       setMembers(JSON.parse(cached));
//     } else {
//       fetch("/api/members")
//         .then(res => res.json())
//         .then(data => {
//           setMembers(data);
//           sessionStorage.setItem("members", JSON.stringify(data));
//         })
//         .catch(err => console.error("Failed to fetch members:", err));
//     }
//   }, []);

//   // Fetch tasks and map assignees
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await fetch("/api/tasks");
//         const data: Task[] = await res.json();
//         const mapped = Array.isArray(data)
//           ? data.map(t => ({
//               ...t,
//               assignee: t.assigneeId ? members.find(m => m.id === t.assigneeId) : null,
//             }))
//           : [];
//         setTasks(mapped.filter(t => t.status === "trash"));
//         sessionStorage.setItem("tasks", JSON.stringify(mapped));
//       } catch (err) {
//         console.error("Failed to fetch tasks:", err);
//         setTasks([]);
//       }
//     };
//     fetchTasks();
//   }, [members]);

//   // Listen for updates from other pages
//   useEffect(() => {
//     const handler = () => {
//       const stored = sessionStorage.getItem("tasks");
//       if (stored) setTasks(JSON.parse(stored).filter((t: Task) => t.status === "trash"));
//     };
//     window.addEventListener("tasksUpdated", handler);
//     return () => window.removeEventListener("tasksUpdated", handler);
//   }, []);

//   const updateTask = async (taskId: number, updates: Partial<Task>) => {
//     try {
//       const updatedTasks = tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
//       setTasks(updatedTasks.filter(t => t.status === "trash"));

//       // Update sessionStorage for all tasks
//       const allTasks = JSON.parse(sessionStorage.getItem("tasks") || "[]");
//       const newAll = allTasks.map((t: Task) => (t.id === taskId ? { ...t, ...updates } : t));
//       sessionStorage.setItem("tasks", JSON.stringify(newAll));
//       window.dispatchEvent(new Event("tasksUpdated"));

//       await fetch(`/api/tasks/${taskId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRestore = (taskId: number) => updateTask(taskId, { status: "todo" });
//   const handleDeletePermanently = (taskId: number) => {
//     if (window.confirm("Are you sure you want to permanently delete this task?")) {
//       updateTask(taskId, { status: "deleted" }); // or call a DELETE API if you want to remove from DB
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "High": return "bg-red-100 text-red-800";
//       case "Medium": return "bg-yellow-100 text-yellow-800";
//       case "Low": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
//           <p className="text-gray-600 mt-2">
//             Tasks that have been deleted and can be restored or permanently removed.
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Trashed Tasks ({tasks.length})
//             </h2>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {tasks.length === 0 ? (
//               <div className="p-6 text-center text-gray-500">No tasks in trash.</div>
//             ) : (
//               tasks.map(task => (
//                 <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3">
//                       <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
//                         {task.priority}
//                       </span>
//                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                         Trashed
//                       </span>
//                     </div>
//                     <p className="text-gray-600 mt-2">{task.description}</p>
//                     <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
//                       <span className="flex items-center space-x-1">
//                         <SlCalender /> <span>Due: {task.dueDate || "No date"}</span>
//                       </span>
//                       <span className="flex items-center space-x-1">
//                         <BsPerson /> <span>{task.assignee?.name || "Unassigned"}</span>
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex space-x-2 ml-4">
//                     <button
//                       onClick={() => handleRestore(task.id)}
//                       className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
//                     >
//                       <FiRefreshCcw /> Restore
//                     </button>
//                     <button
//                       onClick={() => handleDeletePermanently(task.id)}
//                       className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
//                     >
//                       <FiTrash2 /> Delete Permanently
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }


"use client";

import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { BsPerson } from "react-icons/bs";
import { FiTrash2, FiRefreshCcw } from "react-icons/fi";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assigneeId?: number;
  assignee?: Member | null;
}

export default function Trash() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const cached = sessionStorage.getItem("members");
    if (cached) {
      setMembers(JSON.parse(cached));
    } else {
      fetch("/api/members")
        .then(res => res.json())
        .then(data => {
          setMembers(data);
          sessionStorage.setItem("members", JSON.stringify(data));
        })
        .catch(err => console.error("Failed to fetch members:", err));
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data: Task[] = await res.json();
        const mapped = Array.isArray(data)
          ? data.map(t => ({
              ...t,
              assignee: t.assigneeId ? members.find(m => m.id === t.assigneeId) : null,
            }))
          : [];
        setTasks(mapped.filter(t => t.status === "trash"));
        sessionStorage.setItem("tasks", JSON.stringify(mapped));
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [members]);

  useEffect(() => {
    const handler = () => {
      const stored = sessionStorage.getItem("tasks");
      if (stored) setTasks(JSON.parse(stored).filter((t: Task) => t.status === "trash"));
    };
    window.addEventListener("tasksUpdated", handler);
    return () => window.removeEventListener("tasksUpdated", handler);
  }, []);

  const updateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t));
      setTasks(updatedTasks.filter(t => t.status === "trash"));

      const allTasks = JSON.parse(sessionStorage.getItem("tasks") || "[]");
      const newAll = allTasks.map((t: Task) => (t.id === taskId ? { ...t, ...updates } : t));
      sessionStorage.setItem("tasks", JSON.stringify(newAll));
      window.dispatchEvent(new Event("tasksUpdated"));

      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = (taskId: number) => updateTask(taskId, { status: "todo" });
  const handleDeletePermanently = (taskId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this task?")) {
      updateTask(taskId, { status: "deleted" });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
          <p className="text-gray-600 mt-1">
            Tasks that have been deleted. You can restore or permanently remove them.
          </p>
        </div>

        {/* Trash List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center p-10 bg-white rounded-2xl shadow-sm text-gray-500">
              No tasks in trash.
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                {/* Task Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && <p className="text-gray-600 mb-3">{task.description}</p>}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <SlCalender /> <span>{task.dueDate || "No date"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <BsPerson /> <span>{task.assignee?.name || "Unassigned"}</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                      Trashed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => handleRestore(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                  >
                    <FiRefreshCcw /> Restore
                  </button>
                  <button
                    onClick={() => handleDeletePermanently(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
