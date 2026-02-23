"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const initialData = [
  { name: "Jan", candidates: 30, jobs: 10 },
  { name: "Feb", candidates: 45, jobs: 15 },
  { name: "Mar", candidates: 60, jobs: 18 },
  { name: "Apr", candidates: 50, jobs: 12 },
  { name: "May", candidates: 75, jobs: 20 },
];

const statusData = [
  { name: "Shortlisted", value: 40 },
  { name: "Review", value: 25 },
  { name: "Rejected", value: 35 },
];

const COLORS = ["#06b6d4", "#facc15", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState(initialData);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  // Animated Numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalCandidates((prev) => (prev < 260 ? prev + 5 : 260));
      setTotalJobs((prev) => (prev < 75 ? prev + 2 : 75));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Real-time Update Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          candidates: item.candidates + Math.floor(Math.random() * 3),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const downloadCSV = () => {
    const csv = [
      ["Month", "Candidates", "Jobs"],
      ...data.map((d) => [d.name, d.candidates, d.jobs]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
  };

  const exportPDF = () => {
    window.print(); // simple hackathon export
  };

  return (
    <div className="space-y-16">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-bold text-cyan-600">
          Advanced Hiring Analytics
        </h2>

        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            Download CSV
          </button>

          <button
            onClick={exportPDF}
            className="border border-cyan-600 text-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-100 transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI */}
      <section className="grid sm:grid-cols-2 gap-6">
        <StatCard title="Total Candidates" value={totalCandidates} />
        <StatCard title="Total Jobs" value={totalJobs} />
      </section>

      {/* AREA CHART */}
      <section className="bg-white shadow-lg p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-cyan-600 mb-6">
          Candidate Growth (Area Chart)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="candidates"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorC)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* BAR + PIE */}
      <section className="grid lg:grid-cols-2 gap-10">

        {/* BAR */}
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-cyan-600 mb-6">
            Jobs vs Candidates
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="candidates" fill="#06b6d4" />
              <Bar dataKey="jobs" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-cyan-600 mb-6">
            Candidate Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </section>

    </div>
  );
}

/* KPI CARD */
function StatCard({ title, value }: any) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-cyan-600 mt-2">{value}</p>
    </div>
  );
}