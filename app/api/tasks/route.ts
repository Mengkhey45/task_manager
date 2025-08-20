// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma'; // use your singleton client


// let prisma: PrismaClient;
// if (!(global as any).prisma) {
//   (global as any).prisma = new PrismaClient();
// }
// prisma = (global as any).prisma;

// GET all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignee: true },
    });
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST create task
export async function POST(req: Request) {
  try {
    const { title, description, priority, status, dueDate, assigneeId } = await req.json();

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status: status || "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId ? Number(assigneeId) : null,
      },
      include: { assignee: true },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to add task", details: err.message }, { status: 500 });
  }
}
