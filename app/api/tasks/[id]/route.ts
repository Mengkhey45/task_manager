

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const runtime = 'nodejs';

// GET a single task by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(params.id) },
      include: {
        teamMember: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Basic authorization: user can get task if they created it or own the team member it's assigned to
    const isCreator = task.createdById === user.id;
    const teamMember = task.teamMember;
    const isOwner = teamMember ? teamMember.ownerId === user.id : false;

    if (!isCreator && !isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (err: any) {
    console.error(`GET /api/tasks/${params.id} error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update a task by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const taskToUpdate = await prisma.task.findUnique({ 
        where: { id: Number(params.id) },
        include: { teamMember: true }
    });

    if (!taskToUpdate) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Authorization check
    const isCreator = taskToUpdate.createdById === user.id;
    const isOwner = taskToUpdate.teamMember ? taskToUpdate.teamMember.ownerId === user.id : false;

    if (!isCreator && !isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const updates: any = {
      title: data.title,
      description: data.description || null,
      priority: data.priority || "Low",
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };

    // Update assignee
    if (data.assigneeType === "user") {
      updates.assigneeId = data.assigneeId || null;
      updates.teamMemberId = null; // clear previous member assignment
    } else if (data.assigneeType === "member") {
      updates.teamMemberId = data.teamMemberId ? Number(data.teamMemberId) : null;
      updates.assigneeId = null; // clear previous user assignment
    }

    const task = await prisma.task.update({
      where: { id: Number(params.id) },
      data: updates,
      include: { teamMember: true },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error(`PUT /api/tasks/${params.id} error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE a task by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    const taskToDelete = await prisma.task.findUnique({ 
        where: { id: Number(params.id) },
        include: { teamMember: true }
    });

    if (!taskToDelete) {
        return NextResponse.json({ success: true }); // Already deleted
    }

    // Authorization check
    const isCreator = taskToDelete.createdById === user.id;
    const isOwner = taskToDelete.teamMember ? taskToDelete.teamMember.ownerId === user.id : false;

    if (!isCreator && !isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.task.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`DELETE /api/tasks/${params.id} error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
