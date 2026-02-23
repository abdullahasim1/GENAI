import OpenAI from "openai";
import { hasHfConfig, hfGenerateJson } from "@/lib/hf";
import { geminiGenerateJson, hasGeminiConfig } from "@/lib/gemini";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function getAiProvider(): "hf" | "openai" | "gemini" {
  const configured = (process.env.AI_PROVIDER || "").toLowerCase();
  if (configured === "hf") return "hf";
  if (configured === "openai") return "openai";
  if (configured === "gemini") return "gemini";

  if (hasHfConfig()) return "hf";
  if (hasGeminiConfig()) return "gemini";
  return "openai";
}

function requireOpenAI() {
  if (!openai) {
    throw new Error(
      "OPENAI_API_KEY is missing and AI_PROVIDER is not set to hf or gemini."
    );
  }
  return openai;
}

/**
 * Parse resume text using AI to extract structured data
 */
export async function parseResumeWithAI(resumeText: string) {
  try {
    const prompt = `Extract the following information from this resume text and return ONLY a valid JSON object with no additional text:

{
  "name": "Full name",
  "email": "Email address",
  "phone": "Phone number (if available)",
  "skills": ["skill1", "skill2", ...],
  "experience": number (years of experience),
  "education": "Education details",
  "summary": "Brief professional summary"
}

Resume text:
${resumeText}

Return only the JSON object, no markdown, no code blocks, just the JSON.`;

    const provider = getAiProvider();
    const parsed =
      provider === "hf"
        ? await hfGenerateJson(prompt)
        : provider === "gemini"
        ? await geminiGenerateJson(
            prompt,
            "You are an expert at parsing resumes. Extract structured data and return only valid JSON."
          )
        : await (async () => {
            const client = requireOpenAI();
            const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert at parsing resumes. Extract structured data and return only valid JSON.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.3,
              response_format: { type: "json_object" },
            });
            const response = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(response);
          })();

    return {
      name: parsed.name || "Unknown",
      email: parsed.email || "",
      phone: parsed.phone || "",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: parsed.experience || 0,
      education: parsed.education || "",
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("AI Resume Parsing Error:", error);
    throw new Error("Failed to parse resume with AI");
  }
}

/**
 * Score candidate against job requirements using AI
 */
export async function scoreCandidateWithAI(
  candidateData: {
    name: string;
    skills: string[];
    experience: number;
    summary?: string;
  },
  jobData: {
    title: string;
    description: string;
    requiredSkills: string[];
    experienceRequired: number;
  }
) {
  try {
    const prompt = `Analyze this candidate against the job requirements and return ONLY a valid JSON object:

Candidate:
- Name: ${candidateData.name}
- Skills: ${candidateData.skills.join(", ")}
- Experience: ${candidateData.experience} years
- Summary: ${candidateData.summary || "N/A"}

Job Requirements:
- Title: ${jobData.title}
- Description: ${jobData.description}
- Required Skills: ${jobData.requiredSkills.join(", ")}
- Experience Required: ${jobData.experienceRequired} years

Return a JSON object with:
{
  "matchScore": number (0-100),
  "strengthAreas": ["strength1", "strength2", ...],
  "missingSkills": ["missing1", "missing2", ...],
  "recommendation": "shortlisted" | "review" | "rejected",
  "reasoning": "Brief explanation of the score"
}

Return only the JSON object, no markdown, no code blocks.`;

    const provider = getAiProvider();
    const scoring =
      provider === "hf"
        ? await hfGenerateJson(prompt)
        : provider === "gemini"
        ? await geminiGenerateJson(
            prompt,
            "You are an expert HR recruiter. Analyze candidates objectively and provide detailed scoring."
          )
        : await (async () => {
            const client = requireOpenAI();
            const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert HR recruiter. Analyze candidates objectively and provide detailed scoring.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.4,
              response_format: { type: "json_object" },
            });
            const response = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(response);
          })();

    return {
      matchScore: Math.min(100, Math.max(0, scoring.matchScore || 0)),
      strengthAreas: Array.isArray(scoring.strengthAreas)
        ? scoring.strengthAreas
        : [],
      missingSkills: Array.isArray(scoring.missingSkills)
        ? scoring.missingSkills
        : [],
      recommendation: scoring.recommendation || "review",
      reasoning: scoring.reasoning || "",
    };
  } catch (error) {
    console.error("AI Scoring Error:", error);
    throw new Error("Failed to score candidate with AI");
  }
}

/**
 * Generate interview questions using AI
 */
export async function generateInterviewQuestionsWithAI(
  jobTitle: string,
  jobDescription: string,
  candidateData: {
    name: string;
    skills: string[];
    experience: number;
    missingSkills?: string[];
  }
) {
  try {
    const prompt = `Generate personalized interview questions for this candidate applying for ${jobTitle}.

Job Description: ${jobDescription}

Candidate Profile:
- Name: ${candidateData.name}
- Skills: ${candidateData.skills.join(", ")}
- Experience: ${candidateData.experience} years
- Missing Skills: ${candidateData.missingSkills?.join(", ") || "None"}

Generate:
1. 5 Technical questions specific to their skills and the job role
2. 3 Behavioral questions
3. 2 Scenario-based questions

Return ONLY a valid JSON object:
{
  "technical": ["question1", "question2", ...],
  "behavioral": ["question1", "question2", ...],
  "scenario": ["question1", "question2"],
  "personalized": "Personalized opening statement"
}

Return only the JSON object, no markdown, no code blocks.`;

    const provider = getAiProvider();
    const questions =
      provider === "hf"
        ? await hfGenerateJson(prompt)
        : provider === "gemini"
        ? await geminiGenerateJson(
            prompt,
            "You are an expert interviewer. Generate relevant, insightful interview questions."
          )
        : await (async () => {
            const client = requireOpenAI();
            const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert interviewer. Generate relevant, insightful interview questions.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.7,
              response_format: { type: "json_object" },
            });
            const response = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(response);
          })();

    return {
      technical: Array.isArray(questions.technical)
        ? questions.technical
        : [],
      behavioral: Array.isArray(questions.behavioral)
        ? questions.behavioral
        : [],
      scenario: Array.isArray(questions.scenario) ? questions.scenario : [],
      personalized: questions.personalized || "",
    };
  } catch (error) {
    console.error("AI Question Generation Error:", error);
    throw new Error("Failed to generate questions with AI");
  }
}

/**
 * Generate professional email using AI
 */
export async function generateEmailWithAI(
  emailType: "invite" | "rejection" | "followup",
  candidateName: string,
  jobTitle: string,
  details?: {
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    reason?: string;
  }
) {
  try {
    let prompt = "";

    if (emailType === "invite") {
      prompt = `Generate a professional interview invitation email for ${candidateName} for the ${jobTitle} position.

${details?.interviewDate ? `Interview Date: ${details.interviewDate}` : ""}
${details?.interviewTime ? `Interview Time: ${details.interviewTime}` : ""}
${details?.interviewLocation ? `Location: ${details.interviewLocation}` : "Format: Online/In-Person"}

Return ONLY a valid JSON object:
{
  "subject": "Email subject line",
  "body": "Professional email body (formatted nicely)"
}`;
    } else if (emailType === "rejection") {
      prompt = `Generate a professional and respectful rejection email for ${candidateName} who applied for ${jobTitle}.

${details?.reason ? `Reason: ${details.reason}` : ""}

Return ONLY a valid JSON object:
{
  "subject": "Email subject line",
  "body": "Professional rejection email body"
}`;
    } else {
      prompt = `Generate a professional follow-up email for ${candidateName} regarding their application for ${jobTitle}.

Return ONLY a valid JSON object:
{
  "subject": "Email subject line",
  "body": "Professional follow-up email body"
}`;
    }

    const provider = getAiProvider();
    const email =
      provider === "hf"
        ? await hfGenerateJson(prompt)
        : provider === "gemini"
        ? await geminiGenerateJson(
            prompt,
            "You are a professional HR communication expert. Write clear, professional, and respectful emails."
          )
        : await (async () => {
            const client = requireOpenAI();
            const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a professional HR communication expert. Write clear, professional, and respectful emails.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.6,
              response_format: { type: "json_object" },
            });
            const response = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(response);
          })();

    return {
      subject: email.subject || "Email from HireGen AI",
      body: email.body || "",
    };
  } catch (error) {
    console.error("AI Email Generation Error:", error);
    throw new Error("Failed to generate email with AI");
  }
}

/**
 * Analyze email sentiment and urgency
 */
export async function analyzeEmailSentiment(emailText: string) {
  try {
    const prompt = `Analyze this email reply and return ONLY a valid JSON object:

Email text:
${emailText}

Return:
{
  "sentiment": "positive" | "neutral" | "negative",
  "urgency": "high" | "medium" | "low",
  "tone": "professional" | "casual" | "formal",
  "summary": "Brief summary of the email content",
  "actionRequired": boolean
}

Return only the JSON object, no markdown, no code blocks.`;

    const provider = getAiProvider();
    const analysis =
      provider === "hf"
        ? await hfGenerateJson(prompt)
        : provider === "gemini"
        ? await geminiGenerateJson(
            prompt,
            "You are an expert at analyzing email sentiment and tone. Be objective and accurate."
          )
        : await (async () => {
            const client = requireOpenAI();
            const completion = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert at analyzing email sentiment and tone. Be objective and accurate.",
                },
                { role: "user", content: prompt },
              ],
              temperature: 0.3,
              response_format: { type: "json_object" },
            });
            const response = completion.choices[0]?.message?.content || "{}";
            return JSON.parse(response);
          })();

    return {
      sentiment: analysis.sentiment || "neutral",
      urgency: analysis.urgency || "medium",
      tone: analysis.tone || "professional",
      summary: analysis.summary || "",
      actionRequired: analysis.actionRequired || false,
    };
  } catch (error) {
    console.error("AI Sentiment Analysis Error:", error);
    throw new Error("Failed to analyze email sentiment");
  }
}
