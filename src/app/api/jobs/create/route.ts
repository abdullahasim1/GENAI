import { NextRequest, NextResponse } from "next/server";
import { mockJobs } from "@/lib/mock-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, requiredSkills, experienceRequired, userId } =
      body;

    if (!title || !description || !requiredSkills || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create job
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newJob = {
      id: jobId,
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(",").map((s: string) => s.trim()),
      experienceRequired: experienceRequired || 0,
      userId,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    mockJobs.push(newJob);

    return NextResponse.json(
      {
        success: true,
        job: newJob,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all jobs for a user
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

    const userJobs = mockJobs.filter((job) => job.userId === userId);

    return NextResponse.json({
      success: true,
      jobs: userJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
