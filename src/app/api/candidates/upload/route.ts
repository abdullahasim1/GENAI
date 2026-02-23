import { NextRequest, NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import { parseResumeWithAI } from "@/lib/ai";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobId = formData.get("jobId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !jobId || !userId) {
      return NextResponse.json(
        { error: "File, jobId, and userId are required" },
        { status: 400 }
      );
    }

    let extractedText = "";
    try {
      extractedText = await file.text();
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "Failed to read file contents. Please try another file (PDF or .txt).",
        },
        { status: 400 }
      );
    }

    // Clean text to ensure valid UTF-8 for Postgres (remove null bytes)
    const cleanedText = extractedText.replace(/\u0000/g, "");

    if (!cleanedText || cleanedText.trim().length === 0) {
      return NextResponse.json(
        { error: "File appears to be empty or could not be parsed" },
        { status: 400 }
      );
    }

    // Use AI to parse resume
    let parsedData;
    try {
      parsedData = await parseResumeWithAI(cleanedText);
    } catch (aiError) {
      console.error("AI parsing failed, using fallback:", aiError);
      parsedData = {
        name: "Unknown",
        email: "",
        phone: "",
        skills: [],
        experience: 0,
        education: "",
        summary: "",
      };
    }

    const candidateId = randomUUID();
    const skillsArray = Array.isArray(parsedData.skills)
      ? parsedData.skills
      : [];

    const rows = await sql`
      INSERT INTO candidates (
        id,
        user_id,
        job_id,
        name,
        email,
        phone,
        resume_text,
        skills,
        match_score,
        status
      )
      VALUES (
        ${candidateId},
        ${userId},
        ${jobId},
        ${parsedData.name},
        ${parsedData.email},
        ${parsedData.phone},
        ${cleanedText},
        ${skillsArray},
        NULL,
        'pending'
      )
      RETURNING
        id,
        user_id as "userId",
        job_id as "jobId",
        name,
        email,
        phone,
        resume_text as "rawText",
        skills,
        match_score as "matchScore",
        status,
        created_at as "uploadedAt"
    `;

    const candidate = rows[0];

    return NextResponse.json({
      success: true,
      candidate,
      message: "Resume parsed successfully using AI",
    });
  } catch (error) {
    console.error("CV Upload Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
