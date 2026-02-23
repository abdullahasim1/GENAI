"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus, CheckCircle, X } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    experienceRequired: "",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(`/api/jobs/create?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) {
        alert("Please login first");
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          experienceRequired: parseInt(formData.experienceRequired) || 0,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJobs([...jobs, data.job]);
        setFormData({
          title: "",
          description: "",
          requiredSkills: "",
          experienceRequired: "",
        });
        setShowForm(false);
      } else {
        alert(data.error || "Failed to create job");
      }
    } catch (error) {
      alert("Failed to create job");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
            Job Postings
          </h1>
          <p className="text-gray-600">
            Create and manage job postings for candidate matching.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="relative inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={20} />
            Create Job
          </span>
        </motion.button>
      </div>

      {/* Create Job Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg p-6 rounded-2xl border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-cyan-600 mb-4">
            Create New Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills * (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredSkills: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="e.g., React, Node.js, MySQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Required (years)
                </label>
                <input
                  type="number"
                  value={formData.experienceRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceRequired: e.target.value,
                    })
                  }
                  min="0"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group disabled:opacity-70"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-xl" />
                <span className="relative z-10">
                  {loading ? "Creating..." : "Create Job"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No jobs created yet. Create your first job!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-cyan-600">
                  {job.title}
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                  {job.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Required Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.requiredSkills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-cyan-100 text-cyan-600 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Experience: {job.experienceRequired} years
                </div>
              </div>

              <a
                href={`/dashboard/candidates?jobId=${job.id}`}
                className="mt-4 inline-block text-sm text-cyan-600 font-semibold hover:underline"
              >
                View Candidates →
              </a>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
