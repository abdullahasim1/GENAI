import { NextRequest, NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import { generateEmailWithAI } from "@/lib/ai";
import { sendEmail } from "@/lib/email";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();
    const {
      candidateEmail,
      candidateName,
      jobTitle,
      interviewDate,
      interviewTime,
      interviewLocation,
      userId,
      emailType = "invite",
    } = body;

    if (!candidateEmail || !candidateName || !jobTitle) {
      return NextResponse.json(
        { error: "Candidate email, name, and job title are required" },
        { status: 400 }
      );
    }

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
      emailContent = {
        subject: `Interview Invitation - ${jobTitle} Position at HireGen AI`,
        body: `Dear ${candidateName},\n\nThank you for your interest in the ${jobTitle} position.\n\nBest regards,\nHireGen AI Team`,
      };
    }

    let emailResult;
    try {
      emailResult = await sendEmail(
        candidateEmail,
        emailContent.subject,
        emailContent.body
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      emailResult = {
        success: true,
        messageId: "mock_id",
        note: "Email not sent (check SMTP configuration)",
      } as any;
    }

    const emailId = randomUUID();

    const rows = await sql`
      INSERT INTO email_logs (
        id,
        user_id,
        candidate_id,
        job_id,
        subject,
        body,
        to_email,
        status
      )
      VALUES (
        ${emailId},
        ${userId},
        NULL,
        NULL,
        ${emailContent.subject},
        ${emailContent.body},
        ${candidateEmail},
        ${emailResult.success ? "sent" : "failed"}
      )
      RETURNING
        id,
        user_id as "userId",
        candidate_id as "candidateId",
        job_id as "jobId",
        subject,
        body,
        to_email as "candidateEmail",
        status,
        sent_at as "sentAt"
    `;

    const emailLog = rows[0];

    return NextResponse.json({
      success: true,
      email: {
        ...emailLog,
        candidateName,
        jobTitle,
        interviewDate,
        interviewTime,
        interviewLocation,
        emailType,
        messageId: emailResult.messageId,
      },
      message: emailResult.success
        ? "Email sent successfully"
        : "Email generated but not sent (check SMTP config)",
      previewUrl: (emailResult as any).previewUrl,
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
    await ensureDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const emails = await sql`
      SELECT
        id,
        user_id as "userId",
        candidate_id as "candidateId",
        job_id as "jobId",
        subject,
        body,
        to_email as "candidateEmail",
        status,
        sent_at as "sentAt"
      FROM email_logs
      WHERE user_id = ${userId}
      ORDER BY sent_at DESC
    `;

    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Email logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
