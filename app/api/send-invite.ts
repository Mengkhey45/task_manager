import nodemailer from "nodemailer";

export default async function handler(req: { method: string; body: { name: any; email: any; role: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; end: { (): any; new(): any; }; json: { (arg0: { message?: string; error?: string; }): void; new(): any; }; }; }) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, role } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Team Invitation",
      text: `Hello ${name},\n\nYou have been invited to join as a ${role}.`,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email could not be sent" });
  }
}
