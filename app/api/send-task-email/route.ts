import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { title, description, assigneeEmail, dueDate } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: assigneeEmail,
      subject: `New Task Assigned: ${title}`,
      text: `
Hello,

You have been assigned a new task on Task Flow.

Title: ${title}
Description: ${description || "No description"}
Due Date: ${dueDate}

Please check Task Flow for more details.
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending task email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
