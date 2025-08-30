


// app/api/team/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { getTeamMembersForUser } from "../../../lib/data/team";

export const runtime = "nodejs";

async function sendInvitationEmail(email: string, name: string, role: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You've been invited to TaskFlow 🎉",
    html: `
      <h2>Hello ${name},</h2>
      <p>You have been invited to join TaskFlow as a <strong>${role}</strong>.</p>
      <p>Click <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}">here</a> to join.</p>
      <p>Welcome aboard!</p>
    `,
  });
}

// GET all team members for current user
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await getTeamMembersForUser(user);
  return NextResponse.json(members);
}

// POST create new team member
export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
    
  try {
    const ownerId = user.id;
    const { name, email, role } = await req.json();

    const member = await prisma.teamMember.create({
      data: { name, email, role, joinDate: new Date(), ownerId },
      include: { tasks: true },
    });

    // Send invitation email
    await sendInvitationEmail(email, name, role);

    return NextResponse.json(member);
  } catch (err: any) {
    console.error("POST /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to add member", details: err.message },
      { status: 500 }
    );
  }
}

// PUT update team member (owner-only)
export async function PUT(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ownerId = user.id;
    const { id, updates } = await req.json();

    const member = await prisma.teamMember.updateMany({
      where: { id: Number(id), ownerId }, // only update if owned by user
      data: updates,
    });

    return NextResponse.json(member);
  } catch (err: any) {
    console.error("PUT /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to update member", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE team member (owner-only)
export async function DELETE(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ownerId = user.id;
    const { id } = await req.json();

    const deleted = await prisma.teamMember.deleteMany({
      where: { id: Number(id), ownerId }, // only delete if owned by user
    });

    return NextResponse.json({ success: deleted.count > 0 });
  } catch (err: any) {
    console.error("DELETE /api/team error:", err);
    return NextResponse.json(
      { error: "Failed to delete member", details: err.message },
      { status: 500 }
    );
  }
}
