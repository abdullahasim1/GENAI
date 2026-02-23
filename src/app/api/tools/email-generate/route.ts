import { NextRequest, NextResponse } from "next/server";
import { generateEmailWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailType, candidateName, jobTitle, details } = body;

    if (!emailType || !candidateName || !jobTitle) {
      return NextResponse.json({
        success: false,
        error: "emailType, candidateName and jobTitle are required.",
      });
    }

    const email = await generateEmailWithAI(emailType, candidateName, jobTitle, details);

    return NextResponse.json({
      success: true,
      email,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}

