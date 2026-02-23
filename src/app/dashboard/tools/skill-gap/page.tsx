"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function SkillGapTool() {
  const [requiredSkills, setRequiredSkills] = useState("React, Node.js, MySQL");
  const [candidateSkills, setCandidateSkills] = useState("React, TypeScript");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requiredSkills,
          candidateSkills,
          resumeText,
        }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error || "Failed to detect skill gap.");
      else setResult(data);
    } catch {
      setError("Failed to detect skill gap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
          Skill Gap Detection
        </h1>
        <p className="text-gray-600">
          Compare job required skills vs candidate skills (or resume text) and
          get missing skills + match score.
        </p>
      </section>

      <section className="bg-white shadow-lg p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 rounded-lg" aria-hidden="true">
            <BarChart3 className="text-cyan-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Inputs</p>
            <p className="text-sm text-gray-600">
              You can paste resume text to auto-extract skills.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="required-skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Required Skills (comma-separated)
            </label>
            <input
              id="required-skills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label
              htmlFor="candidate-skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Candidate Skills (comma-separated)
            </label>
            <input
              id="candidate-skills"
              value={candidateSkills}
              onChange={(e) => setCandidateSkills(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="resume-text"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Resume Text (optional)
          </label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Paste resume text if you want the system to extract skills automatically..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={run}
          disabled={loading || requiredSkills.trim().length === 0}
          className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group disabled:opacity-60"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
          <span className="relative z-10">
            {loading ? "Analyzing..." : "Detect Skill Gap"}
          </span>
        </motion.button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section className="bg-white shadow-lg p-6 rounded-2xl space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="text-2xl font-bold text-cyan-600">
              {result.matchScore}%
            </div>
            <div className="text-sm text-gray-600">Match Score</div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
              {result.recommendation}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {(result.strengthAreas || []).map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(result.missingSkills || []).map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {result.reasoning && (
            <div className="text-sm text-gray-700 bg-gray-50 border rounded-lg p-4">
              <span className="font-semibold text-gray-800">AI Notes: </span>
              {result.reasoning}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

