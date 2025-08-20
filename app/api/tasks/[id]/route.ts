// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma'; // singleton Prisma client

// Force server runtime (prevents Vercel trying to pre-render)
export const runtime = 'nodejs';

// GET one task by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(params.id) },
      include: { assignee: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("GET /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch task", details: err.message },
      { status: 500 }
    );
  }
}

// PUT update task by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await req.json();
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

    const updated = await prisma.task.update({
      where: { id: Number(params.id) },
      data: updates,
      include: { assignee: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update task", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE task by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete task", details: err.message },
      { status: 500 }
    );
  }
}
