
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getTasksForUser } from "../../../lib/data/tasks";
import { prisma } from "../../../lib/prisma";

export const runtime = 'nodejs';

// GET all tasks for the signed-in user
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await getTasksForUser(user);
  return NextResponse.json(tasks);
}

// POST create a new task
export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const payload: any = {
      title: data.title,
      description: data.description || null,
      priority: data.priority || "Low",
      status: data.status || "pending",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdById: user.id, // Use Supabase user ID (string)
    };

    // Assign either to a User (string ID) or a TeamMember (Int ID)
    if (data.assigneeType === "user" && data.assigneeId) {
      payload.assigneeId = data.assigneeId; // Should be a string ID
    } else if (data.assigneeType === "member" && data.teamMemberId) {
      payload.teamMemberId = Number(data.teamMemberId);
    }

    const task = await prisma.task.create({ data: payload, include: { teamMember: true } });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
