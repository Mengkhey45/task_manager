// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   try {
//     if (!req.body) {
//       return NextResponse.json(
//         { error: "Missing request body" },
//         { status: 400 }
//       );
//     }

//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       return NextResponse.json(
//         { error: "Email already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: { 
//         name, 
//         email, 
//         password: hashedPassword 
//       },
//     });

//     return NextResponse.json(
//       { 
//         id: user.id, 
//         name: user.name, 
//         email: user.email 
//       },
//       { 
//         status: 201 
//       }
//     );
//   } catch (err) {
//     console.error('Signup error:', err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
