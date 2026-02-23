"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

type EmailType = "invite" | "rejection" | "followup";

export default function EmailGeneratorTool() {
  const [emailType, setEmailType] = useState<EmailType>("invite");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ subject: string; body: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setGenerated(null);
    try {
      const res = await fetch("/api/tools/email-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailType,
          candidateName,
          jobTitle,
          details: {
            interviewDate,
            interviewTime,
            interviewLocation,
            reason,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error || "Failed to generate email.");
      else setGenerated(data.email);
    } catch {
      setError("Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!generated) return;
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem("hiregen_user");
      const userId = userStr ? JSON.parse(userStr).id : undefined;

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail,
          candidateName,
          jobTitle,
          interviewDate,
          interviewTime,
          interviewLocation,
          userId,
          emailType,
        }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error || "Failed to send email.");
      else alert("Email sent (or generated in dev mode).");
    } catch {
      setError("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
          Email Generation
        </h1>
        <p className="text-gray-600">
          Generate professional HR emails (Invite / Rejection / Follow-up) with
          your AI provider.
        </p>
      </section>

      <section className="bg-white shadow-lg p-6 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Type
            </label>
            <select
              id="email-type"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as EmailType)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="invite">Interview Invite</option>
              <option value="rejection">Rejection</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="job-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <input
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Frontend Developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="candidate-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Candidate Name
            </label>
            <input
              id="candidate-name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ali Khan"
            />
          </div>
          <div>
            <label
              htmlFor="candidate-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Candidate Email (for sending)
            </label>
            <input
              id="candidate-email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="ali@email.com"
            />
          </div>
        </div>

        {emailType === "invite" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="interview-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="interview-date"
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label
                htmlFor="interview-time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                id="interview-time"
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label
                htmlFor="interview-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="interview-location"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Online / Office"
              />
            </div>
          </div>
        )}

        {emailType === "rejection" && (
          <div>
            <label
              htmlFor="rejection-reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rejection Reason (optional)
            </label>
            <input
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="We moved forward with candidates closer to the required stack..."
            />
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generate}
            disabled={loading || !candidateName || !jobTitle}
            className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group disabled:opacity-60"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <Mail size={16} />
              {loading ? "Generating..." : "Generate Email"}
            </span>
          </motion.button>

          <button
            onClick={send}
            disabled={loading || !generated || !candidateEmail}
            className="px-6 py-2.5 text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Send size={16} />
            Send Email
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </section>

      {generated && (
        <section className="bg-white shadow-lg p-6 rounded-2xl space-y-3">
          <h2 className="text-lg font-semibold text-cyan-600">Preview</h2>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Subject:</span>{" "}
            <span className="text-gray-700">{generated.subject}</span>
          </div>
          <pre className="text-xs bg-gray-50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
            {generated.body}
          </pre>
        </section>
      )}
    </div>
  );
}

