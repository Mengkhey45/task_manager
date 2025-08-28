// "use client"

// import { useState, useEffect } from "react"
// import { useTeamStore } from "../store/useTeamStore"

// type Task = {
//   id?: string
//   title: string
//   description: string
//   priority: "Low" | "Medium" | "High"
//   dueDate: string
//   assigneeId?: number // store ID
//   status?: string
// }

// type TaskModalProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSave: (task: Task) => void
//   initialData?: Task | null
// }

// export default function TaskModal({ isOpen, onClose, onSave, initialData }: TaskModalProps) {
//   const { members } = useTeamStore()

//   const [task, setTask] = useState<Task>({
//     title: "",
//     description: "",
//     priority: "Low",
//     dueDate: "",
//     assigneeId: undefined,
//     status: "pending",
//   })

//   // Load initial data when editing
//   useEffect(() => {
//     if (initialData) {
//       setTask({
//         ...initialData,
//         assigneeId: initialData.assigneeId || undefined,
//       })
//     } else {
//       setTask({
//         title: "",
//         description: "",
//         priority: "Low",
//         dueDate: "",
//         assigneeId: undefined,
//         status: "pending",
//       })
//     }
//   }, [initialData, isOpen])

//   // Generic input change handler
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     if (name === "assigneeId") {
//       setTask({ ...task, assigneeId: Number(value) })
//     } else {
//       setTask({ ...task, [name]: value })
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation
//     if (!task.title.trim()) {
//       alert("Please enter a task title")
//       return
//     }
//     if (!task.dueDate) {
//       alert("Please select a due date")
//       return
//     }
//     if (!task.assigneeId) {
//       alert("Please select an assignee")
//       return
//     }

//     onSave(task)
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl">
//         <h2 className="text-xl font-semibold mb-6 text-gray-900">{initialData ? "Edit Task" : "Add New Task"}</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Task Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
//             <input
//               name="title"
//               value={task.title}
//               onChange={handleChange}
//               placeholder="Enter task title"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               name="description"
//               value={task.description}
//               onChange={handleChange}
//               placeholder="Enter task description"
//               rows={3}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Priority and Due Date */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//               <select
//                 name="priority"
//                 value={task.priority}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
//               <input
//                 name="dueDate"
//                 value={task.dueDate}
//                 onChange={handleChange}
//                 type="date"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>
//           </div>

//           {/* Assignee */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Assignee *</label>
//             <select
//               name="assigneeId"
//               value={task.assigneeId || ""}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select an assignee</option>
//               {members.map((member) => (
//                 <option key={member.id} value={member.id}>
//                   {member.name} ({member.role})
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">{members?.length || 0} team members available</p>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               {initialData ? "Update Task" : "Add Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }


"use client";

import { useState, useEffect } from "react";

interface Member {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function TaskModal({ isOpen, onClose, onSave, initialData }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [assigneeType, setAssigneeType] = useState<"user" | "member">("user");
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [teamMemberId, setTeamMemberId] = useState<number | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPriority(initialData.priority || "Low");
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : null);

      if (initialData.assignee) {
        setAssigneeType("user");
        setAssigneeId(initialData.assignee.id);
        setTeamMemberId(null);
      } else if (initialData.teamMember) {
        setAssigneeType("member");
        setTeamMemberId(initialData.teamMember.id);
        setAssigneeId(null);
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("Low");
      setDueDate(null);
      setAssigneeType("user");
      setAssigneeId(null);
      setTeamMemberId(null);
    }
  }, [initialData]);

  // Fetch users and members
  useEffect(() => {
    fetch("/api/users") // make sure this endpoint returns only your users
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    fetch("/api/team")
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = () => {
    const payload: any = {
      title,
      description,
      priority,
      dueDate,
      assigneeType,
    };

    if (assigneeType === "user") payload.assigneeId = assigneeId;
    if (assigneeType === "member") payload.teamMemberId = teamMemberId;

    if (initialData?.id) payload.id = initialData.id; // update existing task

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{initialData ? "Edit Task" : "Add Task"}</h2>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="date"
            value={dueDate || ""}
            onChange={e => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <div>
            <label className="block mb-1 font-medium">Assign To</label>
            <select
              value={assigneeType}
              onChange={e => setAssigneeType(e.target.value as "user" | "member")}
              className="w-full border rounded px-3 py-2 mb-2"
            >
              <option value="user">User</option>
              <option value="member">Team Member</option>
            </select>

            {assigneeType === "user" && (
              <select
                value={assigneeId || ""}
                onChange={e => setAssigneeId(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select User</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            )}

            {assigneeType === "member" && (
              <select
                value={teamMemberId || ""}
                onChange={e => setTeamMemberId(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Team Member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">{initialData ? "Update" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
