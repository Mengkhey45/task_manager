


// "use client";

// import { useState, useEffect } from "react";
// import Layout from "../../components/Layout";
// import { FiPlus, FiMail, FiUser, FiTrash2, FiEdit2 } from "react-icons/fi";
// import { useTeamStore, type TeamMember } from "../../store/useTeamStore";

// export default function Team() {
//   const { members, fetchMembers, addMember, updateMember, removeMember } = useTeamStore();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

//   // Fix: Type formData correctly to match addMember
//   const [formData, setFormData] = useState<Omit<TeamMember, "id" | "tasks">>({
//     name: "",
//     email: "",
//     role: "",
//     joinDate: new Date().toISOString(), // optional, backend can also set this
//   });

//   useEffect(() => { fetchMembers(); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.role) return alert("Fill all fields");

//     try {
//      if (editingMember) {
//   await updateMember(editingMember.id, formData);
//   alert("Member updated!");
// } else {
//   await addMember(formData);
//   await fetchMembers(); // <- Add this line
//   alert("Member added!");
// }

//       setFormData({ name: "", email: "", role: "", joinDate: new Date().toISOString() });
//       setEditingMember(null);
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("Error saving member");
//     }
//   };

//   const handleEdit = (member: TeamMember) => {
//     setEditingMember(member);
//     setFormData({
//       name: member.name,
//       email: member.email,
//       role: member.role,
//       joinDate: member.joinDate,
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Remove this member?")) return;
//     await removeMember(id);
//     alert("Member removed!");
//   };

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Team</h1>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <FiPlus size={16}/> Invite Member
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {members.map(member => (
//             <div key={member.id} className="bg-white rounded-lg shadow-sm border p-6">
//               <div className="flex items-center space-x-4 mb-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-600 font-semibold text-lg">
//                     {member.name.split(" ").map(n => n[0]).join("")}
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold">{member.name}</h3>
//                   <p className="text-sm text-gray-500">{member.role}</p>
//                 </div>
//               </div>

//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <FiMail className="mr-2" size={14}/>{member.email}
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <FiUser className="mr-2" size={14}/> Joined: {new Date(member.joinDate).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="mt-2">
//                 <h4 className="font-semibold text-gray-700">Tasks:</h4>
//                 {member.tasks.length ? (
//                   <ul className="text-sm text-gray-600 list-disc list-inside">
//                     {member.tasks.map(task => (
//                       <li key={task.id}>{task.title} - {task.status}</li>
//                     ))}
//                   </ul>
//                 ) : <p className="text-gray-400 text-sm">No tasks assigned</p>}
//               </div>

//               <div className="flex space-x-2 mt-4">
//                 <button
//                   onClick={() => handleEdit(member)}
//                   className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center justify-center gap-1"
//                 >
//                   <FiEdit2 size={12}/> Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(member.id)}
//                   className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center justify-center gap-1"
//                 >
//                   <FiTrash2 size={12}/> Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
//               <h2 className="text-xl font-semibold mb-6">{editingMember ? "Edit Member" : "Invite New Member"}</h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={e => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full border px-3 py-2 rounded"
//                   required
//                 />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={e => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full border px-3 py-2 rounded"
//                   required
//                 />
//                 <select
//                   value={formData.role}
//                   onChange={e => setFormData({ ...formData, role: e.target.value })}
//                   className="w-full border px-3 py-2 rounded"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Developer">Developer</option>
//                   <option value="Designer">Designer</option>
//                   <option value="Project Manager">Project Manager</option>
//                   <option value="QA Tester">QA Tester</option>
//                   <option value="DevOps">DevOps</option>
//                   <option value="Product Manager">Product Manager</option>
//                 </select>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
//                   <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingMember ? "Update" : "Invite"}</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { FiPlus, FiMail, FiUser, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useTeamStore, type TeamMember } from "../../store/useTeamStore";

export default function Team() {
  const { members, fetchMembers, addMember, updateMember, removeMember } = useTeamStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState<Omit<TeamMember, "id" | "tasks">>({
    name: "",
    email: "",
    role: "",
    joinDate: new Date().toISOString(),
  });

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return alert("Fill all fields");

    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
        alert("Member updated!");
      } else {
        await addMember(formData);
        await fetchMembers();
        alert("Member added!");
      }
      setFormData({ name: "", email: "", role: "", joinDate: new Date().toISOString() });
      setEditingMember(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving member");
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      joinDate: member.joinDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this member?")) return;
    await removeMember(id);
    alert("Member removed!");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:from-blue-600 hover:to-indigo-700 transition"
          >
            <FiPlus size={16}/> Invite Member
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition relative">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">{member.role}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiMail size={14}/> {member.email}
                </div>
                <div className="flex items-center gap-2">
                  <FiUser size={14}/> Joined: {new Date(member.joinDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Tasks:</h4>
                {member.tasks.length ? (
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                    {member.tasks.map(task => (
                      <li key={task.id} className="truncate">{task.title} - <span className="font-medium">{task.status}</span></li>
                    ))}
                  </ul>
                ) : <p className="text-gray-400 text-sm">No tasks assigned</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1 transition"
                >
                  <FiEdit2 size={14}/> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center justify-center gap-1 transition"
                >
                  <FiTrash2 size={14}/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
              <h2 className="text-xl font-semibold mb-6">{editingMember ? "Edit Member" : "Invite New Member"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="QA Tester">QA Tester</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{editingMember ? "Update" : "Invite"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
