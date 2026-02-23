"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  TrendingUp,
  UserPlus,
  Mail,
  Search,
  Brain,
  MailCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardHome() {
  const [candidates, setCandidates] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [search, setSearch] = useState("");
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userStr = localStorage.getItem("hiregen_user");
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);

      // Load jobs
      const jobsResponse = await fetch(`/api/jobs/create?userId=${user.id}`);
      const jobsData = await jobsResponse.json();
      const jobsList = jobsData.success ? jobsData.jobs || [] : [];
      setJobs(jobsList.length);

      // Load candidates
      const candidatesResponse = await fetch(
        `/api/candidates/list?userId=${user.id}`
      );
      const candidatesData = await candidatesResponse.json();
      const candidatesList = candidatesData.success
        ? candidatesData.candidates || []
        : [];
      setCandidates(candidatesList.length);

      // Calculate average score
      if (candidatesList.length > 0) {
        const scores = candidatesList
          .map((c: any) => c.matchScore)
          .filter((s: any) => s !== null && s !== undefined);
        if (scores.length > 0) {
          const avg =
            scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
          setAvgScore(Math.round(avg));
        }
      }

      // Get recent candidates (top 5)
      setRecentCandidates(candidatesList.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 40 },
    { month: "May", value: 70 },
  ];

  const filteredCandidates = recentCandidates.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-3">
          Welcome to HireGen AI
        </h1>
        <p className="text-gray-600 max-w-2xl">
          AI-powered recruitment automation platform for smarter hiring decisions.
        </p>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Candidates"
          value={loading ? "..." : candidates}
          icon={<Users />}
        />
        <StatCard
          title="Jobs Posted"
          value={loading ? "..." : jobs}
          icon={<Briefcase />}
        />
        <StatCard
          title="Avg Match Score"
          value={loading ? "..." : `${avgScore}%`}
          icon={<TrendingUp />}
        />
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-2xl font-semibold text-cyan-600 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/jobs"
            className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition hover:-translate-y-1 cursor-pointer group"
          >
            <div className="text-cyan-600 mb-4">
              <Briefcase size={32} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Create Job</h4>
            <p className="text-gray-500 text-sm mb-3">
              Post a new job opening and define requirements.
            </p>
            <span className="text-cyan-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Get Started <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/dashboard/candidates"
            className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition hover:-translate-y-1 cursor-pointer group"
          >
            <div className="text-cyan-600 mb-4">
              <Users size={32} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Upload CV</h4>
            <p className="text-gray-500 text-sm mb-3">
              Upload candidate resumes for AI analysis and scoring.
            </p>
            <span className="text-cyan-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Upload Now <ArrowRight size={16} />
            </span>
          </Link>

          <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition hover:-translate-y-1">
            <div className="text-cyan-600 mb-4">
              <Brain size={32} />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">
              AI-Powered Analysis
            </h4>
            <p className="text-gray-500 text-sm">
              Automatic resume parsing, skill matching, and candidate scoring.
            </p>
          </div>
        </div>
      </section>

      {/* CHART + TABLE */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* Chart */}
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6 text-cyan-600">
            Monthly Candidate Growth
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Candidates Table */}
        <div className="bg-white shadow-lg p-6 rounded-2xl overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-cyan-600">
              Recent Candidates
            </h2>

            <div className="flex items-center border rounded-lg px-3 py-1">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="outline-none text-sm"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-600">
                <th className="py-3">Name</th>
                <th>Status</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    {loading
                      ? "Loading..."
                      : "No candidates yet. Upload a CV to get started!"}
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c, index) => (
                  <tr key={c.id || index} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 font-medium">{c.name || "Unknown"}</td>
                    <td>
                      <StatusBadge
                        status={
                          c.matchScore
                            ? c.matchScore >= 70
                              ? "Shortlisted"
                              : c.matchScore >= 50
                              ? "Review"
                              : "Rejected"
                            : "Pending"
                        }
                      />
                    </td>
                    <td>
                      {c.matchScore !== null && c.matchScore !== undefined
                        ? `${c.matchScore}% match`
                        : "Not scored"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ACTIVITY */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-cyan-600">
          Recent Activity
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActivityItem icon={<UserPlus />} text="New candidate added." />
          <ActivityItem icon={<Mail />} text="Interview email sent." />
          <ActivityItem icon={<TrendingUp />} text="Match score updated." />
        </div>
      </section>

      {/* MORE ACTIONS */}
      <section className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard/jobs"
          className="bg-cyan-600 px-6 py-3 rounded-xl text-white font-semibold hover:bg-cyan-700 transition text-center shadow-md hover:shadow-lg"
        >
          Manage Jobs
        </Link>
        <Link
          href="/dashboard/candidates"
          className="bg-white border-2 border-cyan-600 px-6 py-3 rounded-xl text-cyan-600 font-semibold hover:bg-cyan-50 transition text-center shadow-md hover:shadow-lg"
        >
          View All Candidates
        </Link>
        <Link
          href="/dashboard/analytics"
          className="bg-white border-2 border-cyan-600 px-6 py-3 rounded-xl text-cyan-600 font-semibold hover:bg-cyan-50 transition text-center shadow-md hover:shadow-lg"
        >
          View Analytics
        </Link>
      </section>

    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition hover:-translate-y-1">
      <div className="text-cyan-600 mb-4">{icon}</div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-cyan-600 mt-2">{value}</p>
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Shortlisted"
      ? "bg-green-100 text-green-600"
      : status === "Review"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}

function ActivityItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-2xl hover:shadow-lg transition">
      <div className="text-cyan-600">{icon}</div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  );
}