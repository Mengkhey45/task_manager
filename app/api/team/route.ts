// // app/api/team/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "../../../lib/prisma";

// export const runtime = 'nodejs';

// // GET all team members
// export async function GET() {
//   try {
//     const members = await prisma.teamMember.findMany({
//       include: { tasks: true },
//     });

//     return NextResponse.json(members);
//   } catch (err: any) {
//     console.error("GET /api/team error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch team members", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // POST create new team member
// export async function POST(req: Request) {
//   try {
//     const { name, email, role } = await req.json();

//     const member = await prisma.teamMember.create({
//       data: { name, email, role, joinDate: new Date() },
//       include: { tasks: true }, // include tasks even if empty
//     });

//     return NextResponse.json(member);
//   } catch (err: any) {
//     console.error("POST /api/team error:", err);
//     return NextResponse.json(
//       { error: "Failed to add member", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT update team member
// export async function PUT(req: Request) {
//   try {
//     const { id, updates } = await req.json();

//     const member = await prisma.teamMember.update({
//       where: { id: Number(id) },
//       data: updates,
//       include: { tasks: true }, // ✅ FIX: include tasks
//     });

//     return NextResponse.json(member);
//   } catch (err: any) {
//     console.error("PUT /api/team error:", err);
//     return NextResponse.json(
//       { error: "Failed to update member", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE team member
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();
//     await prisma.teamMember.delete({ where: { id: Number(id) } });
//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error("DELETE /api/team error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete member", details: err.message },
//       { status: 500 }
//     );
//   }
// }





// app/api/team/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const runtime = "nodejs";

// GET all team members for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = Number(session.user.id);

    const members = await prisma.teamMember.findMany({
      where: { ownerId },        // only members owned by this user
      include: { tasks: true },  // include their tasks
    });

    return NextResponse.json(members);
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = Number(session.user.id);
    const { name, email, role } = await req.json();

    const member = await prisma.teamMember.create({
      data: { name, email, role, joinDate: new Date(), ownerId },
      include: { tasks: true },
    });

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
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = Number(session.user.id);
    const { id, updates } = await req.json();

    const member = await prisma.teamMember.updateMany({
      where: { id: Number(id), ownerId },  // only update if owned by user
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
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = Number(session.user.id);
    const { id } = await req.json();

    const deleted = await prisma.teamMember.deleteMany({
      where: { id: Number(id), ownerId },  // only delete if owned by user
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
