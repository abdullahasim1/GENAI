"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-cyan-100">

      {/* Floating Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-cyan-600 mb-6">
          HireGen AI
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Smart Hiring & Communication Automation powered by Artificial Intelligence.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/auth/login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden group"
          >
            {/* Gradient Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-[length:200%_200%] animate-gradient rounded-2xl"></span>

            {/* Glow */}
            <span className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition duration-500 bg-cyan-400"></span>

            {/* Shine */}
            <span className="absolute -left-10 top-0 h-full w-10 bg-white/20 skew-x-12 group-hover:animate-shine"></span>

            <span className="relative z-10 tracking-wide">
              Login →
            </span>
          </motion.a>

          <motion.a
            href="/auth/signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-cyan-600 bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden group border-2 border-cyan-500"
          >
            <span className="relative z-10 tracking-wide">
              Sign Up
            </span>
          </motion.a>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative z-10 grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
      >
        <FeatureCard
          title="AI Resume Matching"
          desc="Automatically analyze and score resumes."
        />

        <FeatureCard
          title="Email Automation"
          desc="Generate professional HR emails instantly."
        />

        <FeatureCard
          title="Skill Gap Insights"
          desc="Identify missing skills quickly."
        />
      </motion.div>

    </div>
  );
}

function FeatureCard({ title, desc }: any) {
  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2">
      <h3 className="text-lg font-semibold text-cyan-600 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {desc}
      </p>
    </div>
  );
}