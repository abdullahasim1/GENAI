import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestionsWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobTitle,
      jobDescription,
      candidateSkills,
      missingSkills,
      candidateName,
      candidateExperience,
    } = body;

    if (!jobTitle || !candidateSkills) {
      return NextResponse.json(
        { error: "Job title and candidate skills are required" },
        { status: 400 }
      );
    }

    // Use AI to generate personalized interview questions
    let questions;
    try {
      questions = await generateInterviewQuestionsWithAI(
        jobTitle,
        jobDescription || "",
        {
          name: candidateName || "Candidate",
          skills: Array.isArray(candidateSkills) ? candidateSkills : [],
          experience: candidateExperience || 0,
          missingSkills: Array.isArray(missingSkills) ? missingSkills : [],
        }
      );
    } catch (aiError) {
      console.error("AI Question Generation failed, using fallback:", aiError);
      // Fallback questions
      questions = {
        technical: [
          `Explain your experience with ${candidateSkills[0] || "React"}.`,
          "How do you handle state management?",
          "Describe a challenging technical problem you solved.",
          "What's your approach to optimizing performance?",
          "How do you ensure code quality?",
        ],
        behavioral: [
          "Tell me about working under pressure.",
          "Describe collaborating with a difficult team member.",
          "How do you handle feedback?",
        ],
        scenario: [
          `If building a ${jobTitle} application, what's your approach?`,
          "How would you handle a critical production bug?",
        ],
        personalized: candidateName
          ? `Hi ${candidateName}, let's discuss your experience.`
          : "",
      };
    }

    return NextResponse.json({
      success: true,
      questions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Question Generation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
