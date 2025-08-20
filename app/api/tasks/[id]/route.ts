// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = 'nodejs';

// GET one task by ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(params.id) },
      include: { assignee: true },
    });
    return NextResponse.json(task);
  } catch (err: any) {
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

    const updatedTask = await prisma.task.update({
      where: { id: Number(params.id) },
      data: updates,
      include: { assignee: true },
    });

    return NextResponse.json(updatedTask);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update task", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE task by ID
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete task", details: err.message },
      { status: 500 }
    );
  }
}
