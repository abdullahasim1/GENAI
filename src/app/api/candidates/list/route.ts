import { NextRequest, NextResponse } from "next/server";
import { mockCandidates } from "@/lib/mock-db";

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

    let candidates = mockCandidates.filter((c) => c.userId === userId);

    if (jobId) {
      candidates = candidates.filter((c) => c.jobId === jobId);
    }

    // Sort by match score (highest first)
    candidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
