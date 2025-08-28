// store/useTeamStore.ts
import { create } from "zustand";

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  assigneeId?: number;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  tasks: Task[];
}

interface TeamStore {
  members: TeamMember[];
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<TeamMember, "id" | "tasks">) => Promise<void>;
  updateMember: (id: number, updates: Partial<Omit<TeamMember, "tasks">>) => Promise<void>;
  removeMember: (id: number) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set) => ({
  members: [],

  fetchMembers: async () => {
    try {
      // Use absolute URL to ensure it works after refresh
      const res = await fetch(`${window.location.origin}/api/team`);
      if (!res.ok) throw new Error("Failed to fetch members");
      const data: TeamMember[] = await res.json();

      // Ensure tasks exist
      const membersWithTasks = data.map((m) => ({
        ...m,
        tasks: m.tasks ?? [],
      }));

      set({ members: membersWithTasks });
    } catch (err) {
      console.error("fetchMembers error:", err);
    }
  },

  addMember: async (member) => {
    try {
      const res = await fetch(`${window.location.origin}/api/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      if (!res.ok) throw new Error("Failed to add member");
      const newMember: TeamMember = await res.json();

      // Update state immediately
      set((state) => ({
        members: [...state.members, { ...newMember, tasks: newMember.tasks ?? [] }],
      }));
    } catch (err) {
      console.error("addMember error:", err);
    }
  },

  updateMember: async (id, updates) => {
  try {
    const res = await fetch(`${window.location.origin}/api/team`, { // <-- no /${id}
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }), // id in body
    });
    if (!res.ok) throw new Error("Failed to update member");
    const updatedMember: TeamMember = await res.json();

    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...updatedMember, tasks: updatedMember.tasks ?? [] } : m
      ),
    }));
  } catch (err) {
    console.error("updateMember error:", err);
  }
},

removeMember: async (id) => {
  try {
    const res = await fetch(`${window.location.origin}/api/team`, { // <-- no /${id}
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // id in body
    });
    if (!res.ok) throw new Error("Failed to remove member");
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    }));
  } catch (err) {
    console.error("removeMember error:", err);
  }
},

}));
