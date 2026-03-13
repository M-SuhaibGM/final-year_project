import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, message, company, subject } = await req.json();

    // 1. Create a trans,porter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS // your app password
      },
    });

    // 2. Setup email data
    const mailOptions = {
      from: `"${company}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}