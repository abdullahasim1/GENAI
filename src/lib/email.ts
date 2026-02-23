import nodemailer from "nodemailer";

/**
 * Create email transporter
 * In production, configure with your SMTP settings
 */
export function createEmailTransporter() {
  // For development, use Gmail or your SMTP provider
  // You'll need to set these in .env file:
  // EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Mock transporter for development (won't actually send emails)
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "test@example.com",
      pass: "test",
    },
  });
}

/**
 * Send email using Nodemailer
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  from?: string
) {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: from || process.env.EMAIL_FROM || "noreply@hiregen.ai",
      to,
      subject,
      html: body.replace(/\n/g, "<br>"), // Convert newlines to HTML
      text: body, // Plain text version
    };

    // In development without SMTP, this will fail gracefully
    // In production, ensure EMAIL_HOST, EMAIL_USER, EMAIL_PASS are set
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info), // For testing
    };
  } catch (error) {
    console.error("Email sending error:", error);
    // In development, return success anyway (mock mode)
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        messageId: "mock_message_id",
        previewUrl: null,
        note: "Email not actually sent (development mode)",
      };
    }
    throw new Error("Failed to send email");
  }
}
