// "use client";

// import { useState, useEffect } from "react";
// import { useTeamStore } from "../store/useTeamStore";
// import { FiList, FiCheckSquare, FiCalendar, FiBarChart } from "react-icons/fi";
// import { RiFireLine } from "react-icons/ri";
// import TaskModal from "./TaskModal";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function Dashboard() {
//   const { members } = useTeamStore();
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState<any>(null);

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") router.push("/auth/signin");
//   }, [status, router]);

//   // Fetch tasks from backend
//   const fetchTasks = async () => {
//     try {
//       const res = await fetch("/api/tasks");
//       const data = await res.json();
//       const mapped = data.map((t: any) => ({
//         ...t,
//         assignee: members.find(m => m.id === t.assigneeId) || null,
//       }));
//       setTasks(mapped);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (members.length) fetchTasks();
//   }, [members]);

//   // Listen for tasksUpdated events
//   useEffect(() => {
//     const handleTasksUpdated = () => fetchTasks();
//     window.addEventListener("tasksUpdated", handleTasksUpdated);
//     return () => window.removeEventListener("tasksUpdated", handleTasksUpdated);
//   }, [members]);

//   const handleSave = async (taskData: any) => {
//     try {
//       if (!session?.user?.id) return alert("User not authenticated");

//       const payload = {
//         title: taskData.title,
//         description: taskData.description,
//         priority: taskData.priority,
//         status: taskData.status || "pending",
//         assigneeId: taskData.assigneeId || null,
//         dueDate: taskData.dueDate || null,
//         createdById: Number(session.user.id),
//       };

//       let newTask;

//       if (editingTask) {
//         const res = await fetch(`/api/tasks/${editingTask.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         newTask = await res.json();
//       } else {
//         const res = await fetch("/api/tasks", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         newTask = await res.json();
//       }

//       window.dispatchEvent(new Event("tasksUpdated"));
//       setEditingTask(null);
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save task");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await fetch(`/api/tasks/${id}`, { method: "DELETE" });
//       window.dispatchEvent(new Event("tasksUpdated"));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const overview = [
//     { label: "Total Tasks", icon: <FiList size={22} />, color: "bg-blue-100 text-blue-600" },
//     { label: "In Progress", icon: <FiBarChart size={22} />, color: "bg-yellow-100 text-yellow-600" },
//     { label: "Completed Today", icon: <FiCheckSquare size={22} />, color: "bg-green-100 text-green-600" },
//     { label: "Due This Week", icon: <FiCalendar size={22} />, color: "bg-purple-100 text-purple-600" },
//   ];

//   const priorityIcons = {
//     low: <RiFireLine size={18} className="text-blue-400" />,
//     medium: <RiFireLine size={18} className="text-yellow-500" />,
//     high: <RiFireLine size={18} className="text-red-500" />,
//   };

//   const pendingTasks = tasks.filter(t => t.status === "pending").slice(0, 5);

//   if (status === "loading") return <div>Loading...</div>;
//   if (!session) return null;

//   return (
//     <div className="w-full max-w-6xl mx-auto py-6 px-2 md:px-0">
//       {/* Overview */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {overview.map(item => (
//           <div key={item.label} className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 min-h-[120px]">
//             <div className={`mb-2 w-12 h-12 flex items-center justify-center rounded-full ${item.color} shadow`}>
//               {item.icon}
//             </div>
//             <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
//             <div className="text-sm font-medium mt-1 text-gray-500">{item.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Pending Tasks */}
//       <div className="bg-white rounded-2xl shadow p-6 mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <span className="font-semibold text-lg text-gray-800">Recent Pending Tasks</span>
//           <button
//             onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
//           >
//             + Add New Task
//           </button>
//         </div>

//         <div className="space-y-3">
//           {pendingTasks.length === 0 && <div className="text-gray-400 text-center py-4">No pending tasks</div>}

//           {pendingTasks.map(task => (
//             <div
//               key={task.id}
//               className={`flex flex-col md:flex-row md:items-center justify-between rounded-xl px-4 py-3 ${
//                 task.priority === "Low" ? "bg-green-100" : task.priority === "Medium" ? "bg-yellow-100" : "bg-red-100"
//               } shadow-sm hover:shadow-md transition-shadow`}
//             >
//               <div className="flex items-center gap-3 flex-1 flex-wrap">
//                 <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow">
//                   {priorityIcons[task.priority?.toLowerCase() as keyof typeof priorityIcons]}
//                 </span>
//                 <span className="font-medium text-gray-800">{task.title}</span>
//                 <span className="text-xs text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
//                 <span className="text-xs text-gray-500">{task.assignee?.name || "Unassigned"}</span>
//               </div>

//               <div className="flex gap-2 mt-2 md:mt-0">
//                 <button
//                   className="text-blue-600 text-xs font-semibold hover:underline"
//                   onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="text-red-600 text-xs font-semibold hover:underline"
//                   onClick={() => handleDelete(task.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <TaskModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSave}
//         initialData={editingTask}
//       />
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useTeamStore } from "../store/useTeamStore";
import { FiList, FiCheckSquare, FiCalendar, FiBarChart } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";
import TaskModal from "./TaskModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { members } = useTeamStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();

      // Use backend-assigned assignee/teamMember directly
      const mapped = data.map((t: any) => ({
        ...t,
        assignee: t.assignee || null,
        teamMember: t.teamMember || null,
      }));

      setTasks(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Listen for tasksUpdated events
  useEffect(() => {
    const handleTasksUpdated = () => fetchTasks();
    window.addEventListener("tasksUpdated", handleTasksUpdated);
    return () => window.removeEventListener("tasksUpdated", handleTasksUpdated);
  }, []);

  const handleSave = async (taskData: any) => {
    try {
      if (!session?.user?.id) return alert("User not authenticated");

      const payload: any = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status || "pending",
        dueDate: taskData.dueDate || null,
        assigneeType: taskData.assigneeType,
        assigneeId: taskData.assigneeType === "user" ? taskData.assigneeId : undefined,
        teamMemberId: taskData.assigneeType === "member" ? taskData.teamMemberId : undefined,
      };

      if (editingTask) {
        payload.id = editingTask.id;
        await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      window.dispatchEvent(new Event("tasksUpdated"));
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      window.dispatchEvent(new Event("tasksUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

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

  const pendingTasks = tasks.filter(t => t.status === "pending").slice(0, 5);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-2 md:px-0">
      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overview.map(item => (
          <div key={item.label} className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 min-h-[120px]">
            <div className={`mb-2 w-12 h-12 flex items-center justify-center rounded-full ${item.color} shadow`}>
              {item.icon}
            </div>
            <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-sm font-medium mt-1 text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Pending Tasks */}
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

          {pendingTasks.map(task => (
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
                <span className="text-xs text-gray-500">
                  {task.assignee?.name || task.teamMember?.name || "Unassigned"}
                </span>
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
