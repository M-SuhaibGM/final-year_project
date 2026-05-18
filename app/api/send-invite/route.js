import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, interviewLink, jobPosition } = await req.json();

    // 1. Create transporter using the "service" method that works for you
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Setup the HTML content with your interview link and guidance
    const mailOptions = {
      from: `"AI Interviewer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Interview Invitation: ${jobPosition}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #333;">Interview Invitation</h2>
          <p>You have been invited to interview for the <strong>${jobPosition}</strong> position.</p>
          <p>Please click the button below to start your AI-powered interview session:</p>
          
          <div style="margin: 30px 0;">
            <a href="${interviewLink}" 
               style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               Start Interview
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee;" />
          
          <h3 style="color: #555;">Guidance & Instructions:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li><strong>Environment:</strong> Ensure you are in a quiet, well-lit room.</li>
            <li><strong>Hardware:</strong> Test your microphone and camera before starting.</li>
            <li><strong>Timing:</strong> The interview is timed; try to be concise and clear.</li>
            <li><strong>Stability:</strong> Do not refresh the browser page once the interview starts.</li>
          </ul>
          
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            If the button doesn't work, copy and paste this link: <br/>
            <span style="color: #0066cc;">${interviewLink}</span>
          </p>
        </div>
      `,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { error: "Failed to send email invitation" },
      { status: 500 }
    );
  }
}