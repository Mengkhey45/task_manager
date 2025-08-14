import { create } from "zustand"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  joinDate: string
}

interface TeamStore {
  members: TeamMember[]
  addMember: (member: Omit<TeamMember, "id">) => void
  updateMember: (id: string, updates: Partial<TeamMember>) => void
  removeMember: (id: string) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  members: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Developer",
      joinDate: "2024-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Designer",
      joinDate: "2024-01-02",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Project Manager",
      joinDate: "2024-01-03",
    },
  ],
  addMember: (member) =>
    set((state) => ({
      members: [
        ...state.members,
        {
          ...member,
          id: Date.now().toString(),
        },
      ],
    })),
  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((member) => (member.id === id ? { ...member, ...updates } : member)),
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),
}))
