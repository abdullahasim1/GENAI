import { NextRequest, NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();
    const { title, description, requiredSkills, experienceRequired, userId } =
      body;

    if (!title || !description || !requiredSkills || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills.split(",").map((s: string) => s.trim());

    const jobId = randomUUID();

    const rows = await sql`
      INSERT INTO jobs (
        id,
        user_id,
        title,
        description,
        required_skills,
        experience_required,
        status
      )
      VALUES (
        ${jobId},
        ${userId},
        ${title},
        ${description},
        ${skillsArray},
        ${experienceRequired || 0},
        'active'
      )
      RETURNING
        id,
        user_id as "userId",
        title,
        description,
        required_skills as "requiredSkills",
        experience_required as "experienceRequired",
        status,
        created_at as "createdAt"
    `;

    const newJob = rows[0];

    return NextResponse.json(
      {
        success: true,
        job: newJob,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all jobs for a user
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

    const userJobs = await sql`
      SELECT
        id,
        user_id as "userId",
        title,
        description,
        required_skills as "requiredSkills",
        experience_required as "experienceRequired",
        status,
        created_at as "createdAt"
      FROM jobs
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      jobs: userJobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
