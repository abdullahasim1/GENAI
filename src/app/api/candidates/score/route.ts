import { NextRequest, NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import { scoreCandidateWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    await ensureDb();
    const body = await request.json();
    const { candidateId, jobId } = body;

    if (!candidateId || !jobId) {
      return NextResponse.json(
        { error: "Candidate ID and Job ID are required" },
        { status: 400 }
      );
    }

    const candidateRows = await sql`
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
        status
      FROM candidates
      WHERE id = ${candidateId}
      LIMIT 1
    `;

    const candidate = candidateRows[0] || body.candidate;

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const jobRows = await sql`
      SELECT
        id,
        user_id as "userId",
        title,
        description,
        required_skills as "requiredSkills",
        experience_required as "experienceRequired"
      FROM jobs
      WHERE id = ${jobId}
      LIMIT 1
    `;

    const job = jobRows[0] || body.job;

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    let scoringResult;
    try {
      scoringResult = await scoreCandidateWithAI(
        {
          name: candidate.name || "Unknown",
          skills: candidate.skills || [],
          experience: (candidate as any).experience || 0,
          summary: (candidate as any).summary || "",
        },
        {
          title: job.title,
          description: job.description,
          requiredSkills: job.requiredSkills,
          experienceRequired: job.experienceRequired,
        }
      );
    } catch (aiError) {
      console.error("AI Scoring failed, using fallback:", aiError);
      const candidateSkills = (candidate.skills || []).map((s: string) =>
        s.toLowerCase()
      );
      const requiredSkills = job.requiredSkills.map((s: string) =>
        s.toLowerCase()
      );

      const matchedSkills = requiredSkills.filter((skill: string) =>
        candidateSkills.some(
          (cs: string) => cs.includes(skill) || skill.includes(cs)
        )
      );

      const skillMatchPercentage =
        (matchedSkills.length / requiredSkills.length) * 100;
      const experienceScore = Math.min(
        (((candidate as any).experience || 0) / job.experienceRequired) * 30,
        30
      );

      scoringResult = {
        matchScore: Math.round(
          Math.min(skillMatchPercentage * 0.7 + experienceScore, 100)
        ),
        missingSkills: requiredSkills.filter(
          (skill: string) =>
            !candidateSkills.some(
              (cs: string) => cs.includes(skill) || skill.includes(cs)
            )
        ),
        strengthAreas: matchedSkills,
        recommendation: "review",
        reasoning: "Basic scoring algorithm",
      };
    }

    await sql`
      UPDATE candidates
      SET
        match_score = ${scoringResult.matchScore},
        status = ${
          scoringResult.recommendation === "shortlisted"
            ? "shortlisted"
            : scoringResult.recommendation === "rejected"
            ? "rejected"
            : "review"
        }
      WHERE id = ${candidateId}
    `;

    const updatedRows = await sql`
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
      WHERE id = ${candidateId}
      LIMIT 1
    `;

    const updatedCandidate = updatedRows[0] || null;

    return NextResponse.json({
      success: true,
      scoring: scoringResult,
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Candidate score error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
