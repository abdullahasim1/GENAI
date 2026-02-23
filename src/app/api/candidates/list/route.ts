import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const whereJob = jobId
      ? sql`AND job_id = ${jobId}`
      : sql``;

    const candidates = await sql`
      SELECT
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
      FROM candidates
      WHERE user_id = ${userId}
      ${whereJob}
      ORDER BY COALESCE(match_score, 0) DESC, created_at DESC
    `;

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("Candidates list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
