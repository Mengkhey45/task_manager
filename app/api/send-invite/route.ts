

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, name, role } = await req.json();

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Configure transporter (use your SMTP credentials)
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or SMTP settings for other providers
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
        <p>Click <a href="https://yourapp.com">here</a> to join.</p>
        <p>Welcome aboard!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending invite:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
