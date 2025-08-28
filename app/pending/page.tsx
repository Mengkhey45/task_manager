// // "use client";

// // import Layout from "../../components/Layout";
// // import { SlCalender } from "react-icons/sl";
// // import { BsPerson } from "react-icons/bs";
// // import { useState, useEffect } from "react";
// // import TaskModal from "../../components/TaskModal";
// // import { useSession } from "next-auth/react";
// // import { useRouter } from "next/navigation";


// // interface Task {
// //   id: number;
// //   title: string;
// //   description?: string;
// //   priority: string;
// //   status: string;
// //   dueDate?: string; 
// //   assignee?: { id: number; name: string; email: string };
// //   assigneeId?: number | null;
// // }

// // interface TeamMember {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: string;
// // }

// // export default function PendingTasks() {
// //   const [tasks, setTasks] = useState<Task[]>([]);
// //   const [members, setMembers] = useState<TeamMember[]>([]);
// //   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
// //   const [assigneeFilter, setAssigneeFilter] = useState<string>("All Assignees");

// //   const { data: session, status } = useSession();
// //   const router = useRouter();

// //   // Redirect if not signed in
// //   useEffect(() => {
// //     if (status === "unauthenticated") router.push("/auth/signin");
// //   }, [status, router]);

// //   // Fetch members and tasks
// //   const fetchTasks = async () => {
// //     try {
// //       const res = await fetch("/api/tasks");
// //       const data = await res.json();
// //       const mapped = data.map((t: any) => ({
// //         ...t,
// //         assignee: members.find(m => m.id === t.assigneeId) || null,
// //       }));
// //       setTasks(mapped);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const fetchMembers = async () => {
// //     try {
// //       const res = await fetch("/api/team");
// //       const data = await res.json();
// //       setMembers(data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMembers();
// //   }, []);

// //   useEffect(() => {
// //     if (members.length) fetchTasks();
// //   }, [members]);

// //   useEffect(() => {
// //     const handler = () => fetchTasks();
// //     window.addEventListener("tasksUpdated", handler);
// //     return () => window.removeEventListener("tasksUpdated", handler);
// //   }, [members]);

// //   const handleSave = async (taskData: any) => {
// //     try {
// //       if (!session?.user?.id) return alert("User not authenticated");

// //       const payload = {
// //         title: taskData.title,
// //         description: taskData.description,
// //         priority: taskData.priority,
// //         status: taskData.status || "pending",
// //         assigneeId: taskData.assigneeId || null,
// //         dueDate: taskData.dueDate || null,
// //         createdById: Number(session.user.id),
// //       };

// //       if (selectedTask) {
// //         await fetch(`/api/tasks/${selectedTask.id}`, {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });
// //       } else {
// //         await fetch("/api/tasks", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });
// //       }

// //       window.dispatchEvent(new Event("tasksUpdated"));
// //       setSelectedTask(null);
// //       setIsModalOpen(false);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to save task");
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     try {
// //       await fetch(`/api/tasks/${id}`, { method: "DELETE" });
// //       window.dispatchEvent(new Event("tasksUpdated"));
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const handleStatusChange = async (taskId: number, newStatus: string) => {
// //     try {
// //       await fetch(`/api/tasks/${taskId}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status: newStatus }),
// //       });
// //       window.dispatchEvent(new Event("tasksUpdated"));
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const pendingTasks = tasks.filter(t => t.status === "pending");
// //   const filteredTasks = pendingTasks.filter(t => 
// //     (priorityFilter === "All Priorities" || t.priority === priorityFilter) &&
// //     (assigneeFilter === "All Assignees" || t.assignee?.name === assigneeFilter)
// //   );

// //   const getPriorityColor = (priority: string) => {
// //     switch (priority) {
// //       case "High": return "bg-red-100 text-red-700 border border-red-400";
// //       case "Medium": return "bg-amber-100 text-amber-700 border border-amber-400";
// //       case "Low": return "bg-emerald-100 text-emerald-700 border border-emerald-400";
// //       default: return "bg-gray-100 text-gray-700 border border-gray-400";
// //     }
// //   };
// //   const getTaskBorderColor = (priority: string) => {
// //     switch (priority) {
// //       case "High": return "border-l-red-500";
// //       case "Medium": return "border-l-amber-500";
// //       case "Low": return "border-l-emerald-500";
// //       default: return "border-l-gray-500";
// //     }
// //   };

// //   if (status === "loading") return <div>Loading...</div>;
// //   if (!session) return null;

// //   return (
// //     <Layout>
// //       <div className="space-y-6">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
// //           <div className="flex justify-between items-center">
// //             <div>
// //               <h1 className="text-2xl font-bold">Pending Tasks</h1>
// //               <p className="text-blue-100 mt-1">Tasks waiting to be started or in progress</p>
// //             </div>
// //             <button
// //               onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
// //               className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-md"
// //             >
// //               + Add Task
// //             </button>
// //           </div>
// //         </div>

// //         {/* Tasks Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           <div className="lg:col-span-2 space-y-4">
// //             {filteredTasks.length === 0 && (
// //               <div className="text-center py-12 bg-white rounded-xl shadow-sm">
// //                 <div className="text-gray-400 text-4xl mb-4">📋</div>
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
// //                 <p className="text-gray-500">Add a new task to get started.</p>
// //               </div>
// //             )}

// //             {filteredTasks.map(task => (
// //               <div key={task.id} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${getTaskBorderColor(task.priority)} hover:shadow-md transition-all duration-200`}>
// //                 <div className="flex items-start justify-between">
// //                   <div className="flex-1">
// //                     <div className="flex items-center space-x-3 mb-2">
// //                       <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
// //                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
// //                         {task.priority}
// //                       </span>
// //                     </div>
// //                     <p className="text-gray-600 mb-3">{task.description || "No description provided"}</p>
// //                     <div className="flex items-center space-x-4 text-sm text-gray-500">
// //                       <span className="flex items-center"><SlCalender className="mr-1"/> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
// //                       <span className="flex items-center"><BsPerson className="mr-1"/> {task.assignee?.name || "Unassigned"}</span>
// //                     </div>
// //                   </div>

// //                   <div className="flex space-x-2 ml-4">
// //                     <button onClick={() => handleStatusChange(task.id, "todo")} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">Move to Todo</button>
// //                     <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium">Edit</button>
// //                     <button onClick={() => handleDelete(task.id)} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">Delete</button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Filters */}
// //           <div className="space-y-6">
// //             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
// //                   <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2">
// //                     <option>All Priorities</option>
// //                     <option>High</option>
// //                     <option>Medium</option>
// //                     <option>Low</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
// //                   <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2">
// //                     <option value="All Assignees">All Assignees</option>
// //                     {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedTask}/>
// //       </div>
// //     </Layout>
// //   );
// // }



// "use client";

// import Layout from "../../components/Layout";
// import { SlCalender } from "react-icons/sl";
// import { BsPerson } from "react-icons/bs";
// import { useState, useEffect } from "react";
// import TaskModal from "../../components/TaskModal";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// interface Task {
//   id: number;
//   title: string;
//   description?: string;
//   priority: string;
//   status: string;
//   dueDate?: string;
//   assignee?: { id: number; name: string; email: string } | null;
//   teamMember?: { id: number; name: string; email: string } | null;
// }

// interface TeamMember {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// export default function PendingTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [members, setMembers] = useState<TeamMember[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
//   const [assigneeFilter, setAssigneeFilter] = useState<string>("All Assignees");

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") router.push("/auth/signin");
//   }, [status, router]);

//   // Fetch team members
//   const fetchMembers = async () => {
//     try {
//       const res = await fetch("/api/team");
//       const data = await res.json();
//       setMembers(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Fetch tasks
//   const fetchTasks = async () => {
//     try {
//       const res = await fetch("/api/tasks");
//       const data = await res.json();

//       // Map tasks to include assignee/teamMember for frontend
//       const mapped = data.map((t: Task) => ({
//         ...t,
//         assignee: t.assignee || null,
//         teamMember: t.teamMember || null,
//       }));

//       setTasks(mapped);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   useEffect(() => {
//     if (members.length) fetchTasks();
//   }, [members]);

//   useEffect(() => {
//     const handler = () => fetchTasks();
//     window.addEventListener("tasksUpdated", handler);
//     return () => window.removeEventListener("tasksUpdated", handler);
//   }, [members]);

//   // Save task
//   const handleSave = async (taskData: any) => {
//     try {
//       if (!session?.user?.id) return alert("User not authenticated");

//       const payload: any = {
//         title: taskData.title,
//         description: taskData.description,
//         priority: taskData.priority,
//         status: taskData.status || "pending",
//         dueDate: taskData.dueDate || null,
//         assigneeType: taskData.assigneeType,
//         assigneeId: taskData.assigneeType === "user" ? taskData.assigneeId : undefined,
//         teamMemberId: taskData.assigneeType === "member" ? taskData.teamMemberId : undefined,
//       };

//       if (selectedTask) {
//         payload.id = selectedTask.id;
//         await fetch(`/api/tasks/${selectedTask.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         await fetch("/api/tasks", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       window.dispatchEvent(new Event("tasksUpdated"));
//       setSelectedTask(null);
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

//   const handleStatusChange = async (taskId: number, newStatus: string) => {
//     try {
//       await fetch(`/api/tasks/${taskId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       window.dispatchEvent(new Event("tasksUpdated"));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const pendingTasks = tasks.filter(t => t.status === "pending");
//   const filteredTasks = pendingTasks.filter(
//     t =>
//       (priorityFilter === "All Priorities" || t.priority === priorityFilter) &&
//       (assigneeFilter === "All Assignees" ||
//         t.assignee?.name === assigneeFilter ||
//         t.teamMember?.name === assigneeFilter)
//   );

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "High": return "bg-red-100 text-red-700 border border-red-400";
//       case "Medium": return "bg-amber-100 text-amber-700 border border-amber-400";
//       case "Low": return "bg-emerald-100 text-emerald-700 border border-emerald-400";
//       default: return "bg-gray-100 text-gray-700 border border-gray-400";
//     }
//   };
//   const getTaskBorderColor = (priority: string) => {
//     switch (priority) {
//       case "High": return "border-l-red-500";
//       case "Medium": return "border-l-amber-500";
//       case "Low": return "border-l-emerald-500";
//       default: return "border-l-gray-500";
//     }
//   };

//   if (status === "loading") return <div>Loading...</div>;
//   if (!session) return null;

//   return (
//     <Layout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold">Pending Tasks</h1>
//               <p className="text-blue-100 mt-1">Tasks waiting to be started or in progress</p>
//             </div>
//             <button
//               onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
//               className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-md"
//             >
//               + Add Task
//             </button>
//           </div>
//         </div>

//         {/* Tasks Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-4">
//             {filteredTasks.length === 0 && (
//               <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//                 <div className="text-gray-400 text-4xl mb-4">📋</div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
//                 <p className="text-gray-500">Add a new task to get started.</p>
//               </div>
//             )}

//             {filteredTasks.map(task => (
//               <div key={task.id} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${getTaskBorderColor(task.priority)} hover:shadow-md transition-all duration-200`}>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
//                         {task.priority}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 mb-3">{task.description || "No description provided"}</p>
//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <span className="flex items-center"><SlCalender className="mr-1"/> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
//                       <span className="flex items-center"><BsPerson className="mr-1"/> {task.assignee?.name || task.teamMember?.name || "Unassigned"}</span>
//                     </div>
//                   </div>

//                   <div className="flex space-x-2 ml-4">
//                     <button onClick={() => handleStatusChange(task.id, "todo")} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">Move to Todo</button>
//                     <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium">Edit</button>
//                     <button onClick={() => handleDelete(task.id)} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Filters */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
//                   <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2">
//                     <option>All Priorities</option>
//                     <option>High</option>
//                     <option>Medium</option>
//                     <option>Low</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
//                   <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2">
//                     <option value="All Assignees">All Assignees</option>
//                     {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedTask}/>
//       </div>
//     </Layout>
//   );
// }
"use client";

import Layout from "../../components/Layout";
import { SlCalender } from "react-icons/sl";
import { BsPerson } from "react-icons/bs";
import { useState, useEffect } from "react";
import TaskModal from "../../components/TaskModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignee?: { id: number; name: string; email: string } | null;
  teamMember?: { id: number; name: string; email: string } | null;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PendingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All Assignees");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      const mapped = data.map((t: Task) => ({
        ...t,
        assignee: t.assignee || null,
        teamMember: t.teamMember || null,
      }));
      setTasks(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMembers(); }, []);
  useEffect(() => { if (members.length) fetchTasks(); }, [members]);
  useEffect(() => {
    const handler = () => fetchTasks();
    window.addEventListener("tasksUpdated", handler);
    return () => window.removeEventListener("tasksUpdated", handler);
  }, [members]);

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

      if (selectedTask) {
        payload.id = selectedTask.id;
        await fetch(`/api/tasks/${selectedTask.id}`, {
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
      setSelectedTask(null);
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
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      window.dispatchEvent(new Event("tasksUpdated"));
    } catch (err) { console.error(err); }
  };

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const filteredTasks = pendingTasks.filter(
    t =>
      (priorityFilter === "All Priorities" || t.priority === priorityFilter) &&
      (assigneeFilter === "All Assignees" ||
        t.assignee?.name === assigneeFilter ||
        t.teamMember?.name === assigneeFilter)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 border border-red-400";
      case "Medium": return "bg-amber-100 text-amber-700 border border-amber-400";
      case "Low": return "bg-emerald-100 text-emerald-700 border border-emerald-400";
      default: return "bg-gray-100 text-gray-700 border border-gray-400";
    }
  };
  const getTaskBorderColor = (priority: string) => {
    switch (priority) {
      case "High": return "border-l-red-500";
      case "Medium": return "border-l-amber-500";
      case "Low": return "border-l-emerald-500";
      default: return "border-l-gray-500";
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pending Tasks</h1>
            <p className="text-indigo-100 mt-1">Tasks waiting to be started or in progress</p>
          </div>
          <button
            onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg shadow-md font-semibold hover:shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-0.5"
          >
            + Add Task
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tasks List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending tasks</h3>
                <p className="text-gray-500">Add a new task to get started.</p>
              </div>
            )}

            {filteredTasks.map(task => (
              <div key={task.id} className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${getTaskBorderColor(task.priority)} hover:shadow-lg transition transform hover:-translate-y-1`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description || "No description provided"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><SlCalender /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
                      <span className="flex items-center gap-1"><BsPerson /> {task.assignee?.name || task.teamMember?.name || "Unassigned"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => handleStatusChange(task.id, "todo")}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      Move to Todo
                    </button>
                    <button
                      onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                      className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 hover:shadow-md transition transform hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 transition">
                    <option>All Priorities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 transition">
                    <option value="All Assignees">All Assignees</option>
                    {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

        <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedTask}/>
      </div>
    </Layout>
  );
}
