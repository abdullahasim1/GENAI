"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  Users,
  TrendingUp,
  Mail,
  FileText,
  Brain,
  Send,
  X,
} from "lucide-react";

function CandidatesPageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState(jobId || "");
  const [uploading, setUploading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<any>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
  });

  useEffect(() => {
    loadJobs();
    if (selectedJob) {
      loadCandidates();
    }
  }, [selectedJob]);

  const loadJobs = async () => {
    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(`/api/jobs/create?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
        if (data.jobs.length > 0 && !selectedJob) {
          setSelectedJob(data.jobs[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const loadCandidates = async () => {
    if (!selectedJob) return;

    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        `/api/candidates/list?userId=${user.id}&jobId=${selectedJob}`
      );
      const data = await response.json();

      if (data.success) {
        setCandidates(data.candidates || []);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedJob) {
      alert("Please select a job first");
      return;
    }

    setUploading(true);

    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) {
        alert("Please login first");
        return;
      }

      const user = JSON.parse(userStr);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobId", selectedJob);
      formData.append("userId", user.id);

      // Step 1: Upload and parse CV
      const uploadResponse = await fetch("/api/candidates/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        alert(uploadData.error || "Failed to upload CV");
        setUploading(false);
        return;
      }

      const candidate = uploadData.candidate;

      // Step 2: Get job details for scoring
      const job = jobs.find((j) => j.id === selectedJob);

      // Step 3: Score candidate
      const scoreResponse = await fetch("/api/candidates/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          jobId: selectedJob,
          candidate: {
            name: candidate.name,
            skills: candidate.skills,
            experience: candidate.experience,
            summary: candidate.summary,
          },
          job: {
            title: job?.title || "",
            description: job?.description || "",
            requiredSkills: job?.requiredSkills || [],
            experienceRequired: job?.experienceRequired || 0,
          },
        }),
      });

      const scoreData = await scoreResponse.json();

      if (scoreData.success) {
        // Reload candidates to get updated data from database
        await loadCandidates();
        alert("CV uploaded and scored successfully!");
      }
    } catch (error) {
      alert("Failed to upload CV");
      console.error(error);
    }

    setUploading(false);
  };

  const generateQuestions = async (candidate: any) => {
    try {
      const job = jobs.find((j) => j.id === selectedJob);
      if (!job) return;

      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description,
          candidateSkills: candidate.skills || [],
          missingSkills: candidate.missingSkills || [],
          candidateName: candidate.name,
          candidateExperience: candidate.experience || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
        setSelectedCandidate(candidate);
        setShowQuestions(true);
      }
    } catch (error) {
      alert("Failed to generate questions");
    }
  };

  const sendEmail = async (candidate: any) => {
    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const job = jobs.find((j) => j.id === selectedJob);

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail: candidate.email,
          candidateName: candidate.name,
          jobTitle: job?.title || "Position",
          interviewDate: emailData.interviewDate,
          interviewTime: emailData.interviewTime,
          interviewLocation: emailData.interviewLocation,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email sent successfully!");
        setShowEmailForm(false);
        setEmailData({
          interviewDate: "",
          interviewTime: "",
          interviewLocation: "",
        });
      } else {
        alert(data.error || "Failed to send email");
      }
    } catch (error) {
      alert("Failed to send email");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
          Candidates
        </h1>
        <p className="text-gray-600">
          Upload CVs, view match scores, and manage candidates.
        </p>
      </div>

      {/* Job Selector */}
      {jobs.length > 0 && (
        <div className="bg-white shadow-lg p-4 rounded-2xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Job:
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full md:w-auto rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload Section */}
      {selectedJob && (
        <div className="bg-white shadow-lg p-6 rounded-2xl border-2 border-dashed border-cyan-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Upload size={24} className="text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">
                Upload CV (PDF)
              </h3>
              <p className="text-sm text-gray-600">
                Upload candidate resumes for AI parsing and scoring.
              </p>
            </div>
            <label className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
              <span className="relative z-10 flex items-center gap-2">
                {uploading ? "Uploading..." : "Upload CV"}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No candidates yet. Upload a CV to get started!</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-600">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                </div>
                {candidate.matchScore !== null && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-600">
                      {candidate.matchScore}%
                    </div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.skills?.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-cyan-100 text-cyan-600 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Experience: {candidate.experience} years
                  </span>
                  {candidate.missingSkills?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-red-500">
                        Missing:{" "}
                      </span>
                      <span className="text-xs text-gray-600">
                        {candidate.missingSkills.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => generateQuestions(candidate)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition"
                >
                  <Brain size={16} />
                  Generate Questions
                </button>
                <button
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowEmailForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition"
                >
                  <Send size={16} />
                  Send Email
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Interview Questions Modal */}
      {showQuestions && questions && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-cyan-600">
                Interview Questions for {selectedCandidate.name}
              </h2>
              <button
                onClick={() => setShowQuestions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-cyan-600" />
                  Technical Questions (5)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {questions.technical.map((q: string, idx: number) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users size={18} className="text-cyan-600" />
                  Behavioral Questions (3)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {questions.behavioral.map((q: string, idx: number) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Brain size={18} className="text-cyan-600" />
                  Scenario-Based Questions (2)
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {questions.scenario.map((q: string, idx: number) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cyan-600">
                Send Interview Invite
              </h2>
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate
                </label>
                <p className="text-sm text-gray-600">
                  {selectedCandidate.name} ({selectedCandidate.email})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={emailData.interviewDate}
                  onChange={(e) =>
                    setEmailData({ ...emailData, interviewDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Time
                </label>
                <input
                  type="time"
                  value={emailData.interviewTime}
                  onChange={(e) =>
                    setEmailData({ ...emailData, interviewTime: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={emailData.interviewLocation}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      interviewLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Office or Online"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                onClick={() => sendEmail(selectedCandidate)}
                className="w-full relative inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
                <span className="relative z-10 flex items-center gap-2">
                  <Mail size={16} />
                  Send Email
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CandidatesPageContent />
    </Suspense>
  );
}
