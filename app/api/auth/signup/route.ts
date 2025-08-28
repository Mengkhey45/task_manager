import { NextResponse } from "next/server";
// import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
