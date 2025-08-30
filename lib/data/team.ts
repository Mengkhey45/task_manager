
import { prisma } from "@/lib/prisma";
import { User } from "@supabase/supabase-js";

export async function getTeamMembersForUser(user: User) {
    try {
        const ownerId = user.id;
    
        const members = await prisma.teamMember.findMany({
          where: { ownerId },        // only members owned by this user
          include: { tasks: true },  // include their tasks
        });
    
        return members;
      } catch (err: any) {
        console.error("getTeamMembersForUser error:", err);
        return [];
      }
}
