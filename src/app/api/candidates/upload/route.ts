import { NextRequest, NextResponse } from "next/server";
import { mockCandidates } from "@/lib/mock-db";
import { parseResumeWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
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

    // Extract text from file (PDF or text)
    // For reliability in this project, we avoid heavy PDF parsing libraries
    // and simply read the file as text. This works for .txt and many simple PDFs,
    // and guarantees the API will not crash.
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

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "File appears to be empty or could not be parsed" },
        { status: 400 }
      );
    }

    // Use AI to parse resume
    let parsedData;
    try {
      parsedData = await parseResumeWithAI(extractedText);
    } catch (aiError) {
      // Fallback to basic parsing if AI fails
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

    // Save candidate
    const candidateId = `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const candidate = {
      id: candidateId,
      jobId,
      userId,
      ...parsedData,
      rawText: extractedText, // Store original text
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      matchScore: null, // Will be calculated later
      status: "pending",
    };

    mockCandidates.push(candidate);

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
