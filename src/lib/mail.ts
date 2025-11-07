import nodemailer from "nodemailer";

// Create transporter with debug enabled
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
  logger: true,    // log all SMTP activity
  debug: true,     // include SMTP debug info
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  console.log("📨 Preparing to send email with details:", {
    to,
    subject,
    from: process.env.SENDER_EMAIL,
    smtpUser: process.env.SMTP_USER,
  });

  try {
    const mailOptions = {
      from: `"Companion AI" <${process.env.SENDER_EMAIL}>`,
      replyTo: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    };

    console.log("📤 Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email send completed. SMTP info:", {
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      envelope: info.envelope,
      messageId: info.messageId,
    });

    if (info.rejected.length > 0) {
      console.warn("⚠️ Some recipients were rejected:", info.rejected);
    }
  } catch (error) {
    console.error("❌ Failed to send email. Nodemailer error:", error);
    throw error; // keep throwing for upstream logging
  }
};
