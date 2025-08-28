import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, priority, status, dueDate, assigneeId } = await req.json();
    const id = Number(params.id);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
      },
      include: { assignee: true, createdBy: true },
    });

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
