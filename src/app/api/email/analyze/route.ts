import { NextRequest, NextResponse } from "next/server";
import { analyzeEmailSentiment } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailText } = body;

    if (!emailText) {
      return NextResponse.json(
        { error: "Email text is required" },
        { status: 400 }
      );
    }

    // Use AI to analyze email sentiment
    let analysis;
    try {
      analysis = await analyzeEmailSentiment(emailText);
    } catch (aiError) {
      console.error("AI Sentiment Analysis failed:", aiError);
      // Fallback analysis
      analysis = {
        sentiment: "neutral",
        urgency: "medium",
        tone: "professional",
        summary: "Email received",
        actionRequired: false,
      };
    }

    return NextResponse.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
