
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = 'nodejs';

// GET all tasks for the signed-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json([], { status: 200 });

    const userId = Number(session.user.id);

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { createdById: userId },     // tasks created by user
          { assigneeId: userId },      // tasks assigned directly to user
          {
            teamMember: {
              ownerId: userId,         // tasks assigned to user's team members
            },
          },
        ],
      },
      include: {
        assignee: true,
        teamMember: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create a new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const userId = Number(session.user.id);
    const data = await req.json();

    const payload: any = {
      title: data.title,
      description: data.description || null,
      priority: data.priority || "Low",
      status: data.status || "pending",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdById: userId,
    };

    // Assign either to a User or a TeamMember
    if (data.assigneeType === "user" && data.assigneeId) {
      payload.assigneeId = Number(data.assigneeId);
    } else if (data.assigneeType === "member" && data.teamMemberId) {
      payload.teamMemberId = Number(data.teamMemberId);
    }

    const task = await prisma.task.create({ data: payload, include: { assignee: true, teamMember: true } });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update an existing task
export async function PUT(req: Request) {
  try {
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
      updates.assigneeId = data.assigneeId ? Number(data.assigneeId) : null;
      updates.teamMemberId = null; // clear previous member assignment
    } else if (data.assigneeType === "member") {
      updates.teamMemberId = data.teamMemberId ? Number(data.teamMemberId) : null;
      updates.assigneeId = null; // clear previous user assignment
    }

    const task = await prisma.task.update({
      where: { id: Number(data.id) },
      data: updates,
      include: { assignee: true, teamMember: true },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("PUT /api/tasks error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.task.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/tasks error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
