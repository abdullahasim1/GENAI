import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithAI, scoreCandidateWithAI } from "@/lib/ai";

function toList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requiredSkillsStr = body.requiredSkills || "";
    const candidateSkillsStr = body.candidateSkills || "";
    const resumeText = body.resumeText || "";

    const requiredSkills = Array.isArray(body.requiredSkills)
      ? body.requiredSkills
      : toList(requiredSkillsStr);

    if (requiredSkills.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Required skills are required.",
      });
    }

    let candidateSkills = Array.isArray(body.candidateSkills)
      ? body.candidateSkills
      : toList(candidateSkillsStr);

    let candidateName = "Candidate";
    let candidateExperience = 0;
    let candidateSummary = "";

    if (resumeText && resumeText.trim().length > 0 && candidateSkills.length === 0) {
      const parsed = await parseResumeWithAI(resumeText);
      candidateName = parsed.name || candidateName;
      candidateExperience = parsed.experience || 0;
      candidateSummary = parsed.summary || "";
      candidateSkills = parsed.skills || [];
    }

    // If we still don't have candidate skills, do a basic comparison.
    if (candidateSkills.length === 0) {
      const missingSkills = requiredSkills;
      return NextResponse.json({
        success: true,
        matchScore: 0,
        strengthAreas: [],
        missingSkills,
        recommendation: "review",
        reasoning: "Candidate skills not provided.",
      });
    }

    // Use AI scoring for skill-gap style output.
    const scoring = await scoreCandidateWithAI(
      {
        name: candidateName,
        skills: candidateSkills,
        experience: candidateExperience,
        summary: candidateSummary,
      },
      {
        title: "Skill Gap Check",
        description: "Compare required skills with candidate skills.",
        requiredSkills,
        experienceRequired: 0,
      }
    );

    return NextResponse.json({
      success: true,
      matchScore: scoring.matchScore,
      strengthAreas: scoring.strengthAreas,
      missingSkills: scoring.missingSkills,
      recommendation: scoring.recommendation,
      reasoning: scoring.reasoning,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}

