"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Brain } from "lucide-react";

export default function ResumeAnalysisTool() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/resume-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to analyze resume.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/tools/resume-analysis", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to analyze resume.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
          Resume Analysis
        </h1>
        <p className="text-gray-600">
          Upload a CV or paste resume text. We’ll extract name, email, skills,
          experience, and education using your configured AI provider.
        </p>
      </section>

      <section className="bg-white shadow-lg p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Brain className="text-cyan-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Upload Resume</p>
              <p className="text-sm text-gray-600">
                PDF or TXT supported (PDF text quality depends on the file).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group cursor-pointer">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
            <span className="relative z-10 flex items-center gap-2">
              <Upload size={18} />
              Upload File
            </span>
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) analyzeFile(f);
              }}
              disabled={loading}
            />
          </label>
        </div>
      </section>

      <section className="bg-white shadow-lg p-6 rounded-2xl space-y-4">
        <p className="font-semibold text-gray-800">Or paste resume text</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Paste resume text here..."
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeText}
          disabled={loading || text.trim().length === 0}
          className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group disabled:opacity-60"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
          <span className="relative z-10">
            {loading ? "Analyzing..." : "Analyze Resume"}
          </span>
        </motion.button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section className="bg-white shadow-lg p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-cyan-600 mb-4">
            Extracted JSON
          </h2>
          <pre className="text-xs bg-gray-50 border rounded-lg p-4 overflow-x-auto">
            {JSON.stringify(result.parsed, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

