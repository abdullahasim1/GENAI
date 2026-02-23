import { NextRequest, NextResponse } from "next/server";
import { mockCandidates, mockJobs } from "@/lib/mock-db";
import { scoreCandidateWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, jobId } = body;

    if (!candidateId || !jobId) {
      return NextResponse.json(
        { error: "Candidate ID and Job ID are required" },
        { status: 400 }
      );
    }

    // Fetch candidate from database
    let candidate = mockCandidates.find((c) => c.id === candidateId);
    
    // If not found in DB, use data from request
    if (!candidate && body.candidate) {
      candidate = body.candidate;
    } else if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Fetch job from database
    let job = mockJobs.find((j) => j.id === jobId);
    
    // If not found in DB, use data from request
    if (!job && body.job) {
      job = body.job;
    } else if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Use AI for intelligent candidate scoring
    let scoringResult;
    try {
      scoringResult = await scoreCandidateWithAI(
        {
          name: candidate.name || "Unknown",
          skills: candidate.skills || [],
          experience: candidate.experience || 0,
          summary: candidate.summary || "",
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
      // Fallback to basic scoring if AI fails
      const candidateSkills = (candidate.skills || []).map((s: string) =>
        s.toLowerCase()
      );
      const requiredSkills = job.requiredSkills.map((s: string) =>
        s.toLowerCase()
      );

      const matchedSkills = requiredSkills.filter((skill: string) =>
        candidateSkills.some((cs: string) => cs.includes(skill) || skill.includes(cs))
      );

      const skillMatchPercentage =
        (matchedSkills.length / requiredSkills.length) * 100;
      const experienceScore = Math.min(
        ((candidate.experience || 0) / job.experienceRequired) * 30,
        30
      );

      scoringResult = {
        matchScore: Math.round(
          Math.min(skillMatchPercentage * 0.7 + experienceScore, 100)
        ),
        missingSkills: requiredSkills.filter(
          (skill: string) =>
            !candidateSkills.some((cs: string) => cs.includes(skill) || skill.includes(cs))
        ),
        strengthAreas: matchedSkills,
        recommendation: "review",
        reasoning: "Basic scoring algorithm",
      };
    }

    // Update candidate in database with score
    const candidateIndex = mockCandidates.findIndex(
      (c) => c.id === candidateId
    );
    if (candidateIndex !== -1) {
      mockCandidates[candidateIndex] = {
        ...mockCandidates[candidateIndex],
        matchScore: scoringResult.matchScore,
        missingSkills: scoringResult.missingSkills,
        strengthAreas: scoringResult.strengthAreas,
        status:
          scoringResult.recommendation === "shortlisted"
            ? "shortlisted"
            : scoringResult.recommendation === "rejected"
            ? "rejected"
            : "review",
        aiReasoning: scoringResult.reasoning,
      };
    }

    return NextResponse.json({
      success: true,
      scoring: scoringResult,
      candidate: candidateIndex !== -1 ? mockCandidates[candidateIndex] : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
