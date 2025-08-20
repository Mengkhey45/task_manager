// app/api/team/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = 'nodejs';

// GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      include: { tasks: true },
    });

    // Ensure tasks array is never undefined
    const membersWithTasks = members.map((m) => ({
      ...m,
      tasks: m.tasks ?? [],
    }));

    return NextResponse.json(membersWithTasks);
  } catch (err: any) {
    console.error("GET /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to fetch team members", details: err.message },
      { status: 500 }
    );
  }
}

// POST create new team member
export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    const member = await prisma.teamMember.create({
      data: { name, email, role, joinDate: new Date() },
    });

    return NextResponse.json({ ...member, tasks: [] });
  } catch (err: any) {
    console.error("POST /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to add member", details: err.message },
      { status: 500 }
    );
  }
}

// PUT update team member
export async function PUT(req: Request) {
  try {
    const { id, updates } = await req.json();

    const member = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: updates,
    });

    return NextResponse.json({ ...member, tasks: member.tasks ?? [] });
  } catch (err: any) {
    console.error("PUT /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to update member", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE team member
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.teamMember.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to delete member", details: err.message },
      { status: 500 }
    );
  }
}
