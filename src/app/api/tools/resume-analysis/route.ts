import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithAI } from "@/lib/ai";

function basicParseResume(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch =
    text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || null;
  const phoneMatch =
    text.match(/(\+?\d[\d\s\-()]{7,}\d)/) || null;

  // Try to find a human-looking name line rather than PDF header like "%PDF-1.5"
  const nameCandidate = lines.find((line) => {
    const lower = line.toLowerCase();
    if (
      lower.startsWith("%pdf") ||
      lower.includes("obj") ||
      lower.includes("endobj") ||
      lower.includes("xref") ||
      lower.includes("stream")
    ) {
      return false;
    }
    // Likely a short name: 2-4 words, mostly letters
    const words = line.split(/\s+/);
    if (words.length < 1 || words.length > 4) return false;
    const letterRatio =
      line.replace(/[^a-zA-Z]/g, "").length / Math.max(line.length, 1);
    return letterRatio > 0.6;
  });

  const name = nameCandidate || "";

  return {
    name: name || "Unknown",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    skills: [] as string[],
    experience: 0,
    education: "",
    summary: "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let text = "";

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      const file = fd.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "File is required." });
      }
      text = await file.text();
    } else {
      const body = await request.json();
      text = body.text || "";
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Resume text is required.",
      });
    }

    let parsed;
    try {
      parsed = await parseResumeWithAI(text);
    } catch (aiError) {
      console.error("Resume analysis AI failed, using fallback:", aiError);
      parsed = basicParseResume(text);
    }

    return NextResponse.json({
      success: true,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}

