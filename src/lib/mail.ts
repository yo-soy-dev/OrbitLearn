import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  console.log("📨 Attempting to send email:", {
    to,
    subject,
    smtpUser: process.env.SMTP_USER,
    sender: process.env.SENDER_EMAIL,
  });

  try {
    const info = await transporter.sendMail({
      from: `"Companion AI" <${process.env.SENDER_EMAIL}>`,
      replyTo: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("✅ Email send result:", info);
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    throw error;
  }
};
