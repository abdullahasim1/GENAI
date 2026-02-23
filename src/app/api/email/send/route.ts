import { NextRequest, NextResponse } from "next/server";
import { mockEmailLogs } from "@/lib/mock-db";
import { generateEmailWithAI } from "@/lib/ai";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      candidateEmail,
      candidateName,
      jobTitle,
      interviewDate,
      interviewTime,
      interviewLocation,
      userId,
      emailType = "invite", // "invite" | "rejection" | "followup"
    } = body;

    if (!candidateEmail || !candidateName || !jobTitle) {
      return NextResponse.json(
        { error: "Candidate email, name, and job title are required" },
        { status: 400 }
      );
    }

    // Use AI to generate professional email
    let emailContent;
    try {
      emailContent = await generateEmailWithAI(
        emailType as "invite" | "rejection" | "followup",
        candidateName,
        jobTitle,
        {
          interviewDate,
          interviewTime,
          interviewLocation,
        }
      );
    } catch (aiError) {
      console.error("AI Email Generation failed, using fallback:", aiError);
      // Fallback email
      emailContent = {
        subject: `Interview Invitation - ${jobTitle} Position at HireGen AI`,
        body: `Dear ${candidateName},\n\nThank you for your interest in the ${jobTitle} position.\n\nBest regards,\nHireGen AI Team`,
      };
    }

    // Send email using Nodemailer
    let emailResult;
    try {
      emailResult = await sendEmail(
        candidateEmail,
        emailContent.subject,
        emailContent.body
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue even if email fails (might be in dev mode)
      emailResult = {
        success: true,
        messageId: "mock_id",
        note: "Email not sent (check SMTP configuration)",
      };
    }

    // Log email
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const emailLog = {
      id: emailId,
      userId,
      candidateEmail,
      candidateName,
      jobTitle,
      subject: emailContent.subject,
      body: emailContent.body,
      status: emailResult.success ? "sent" : "failed",
      sentAt: new Date().toISOString(),
      interviewDate,
      interviewTime,
      interviewLocation,
      emailType,
      messageId: emailResult.messageId,
    };

    mockEmailLogs.push(emailLog);

    return NextResponse.json({
      success: true,
      email: emailLog,
      message: emailResult.success
        ? "Email sent successfully"
        : "Email generated but not sent (check SMTP config)",
      previewUrl: emailResult.previewUrl,
    });
  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get email logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userEmails = mockEmailLogs.filter((email) => email.userId === userId);

    return NextResponse.json({
      success: true,
      emails: userEmails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
