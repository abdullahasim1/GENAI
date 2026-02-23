import { NextRequest, NextResponse } from "next/server";
import { parseResumeWithAI } from "@/lib/ai";

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

    const parsed = await parseResumeWithAI(text);

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

