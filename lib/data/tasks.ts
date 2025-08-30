
import { prisma } from "@/lib/prisma";
import { User } from "@supabase/supabase-js";

export async function getTasksForUser(user: User) {
    try {
        const userId: string = user.id;

        // Find if the current user is also a team member
        const teamMember = await prisma.teamMember.findUnique({
          where: { email: user.email! },
        });
    
        const tasks = await prisma.task.findMany({
          where: {
            OR: [
              { createdById: userId },     // tasks created by user
              { assigneeId: userId },      // tasks assigned directly to user
              teamMember ? { teamMemberId: teamMember.id } : {},
              {
                teamMember: {
                  ownerId: userId,         // tasks assigned to user's team members
                },
              },
            ],
          },
          include: {
            teamMember: true,
          },
          orderBy: { createdAt: "desc" },
        });
    
        return tasks;
      } catch (err: any) {
        console.error("getTasksForUser error:", err);
        return [];
      }
}
