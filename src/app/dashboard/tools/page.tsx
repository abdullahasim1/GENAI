"use client";

import { motion } from "framer-motion";
import { Brain, Mail, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-3">
          AI Tools
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Resume Analysis, Email Generation, and Skill Gap Detection — powered by
          your configured AI provider (Hugging Face / other keys).
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard
          href="/dashboard/tools/resume-analysis"
          icon={<Brain size={32} />}
          title="Resume Analysis"
          desc="Upload or paste a resume, extract structured info, and get AI insights."
        />

        <ToolCard
          href="/dashboard/tools/email-generator"
          icon={<Mail size={32} />}
          title="Email Generation"
          desc="Generate professional invite/rejection/follow-up emails and send them."
        />

        <ToolCard
          href="/dashboard/tools/skill-gap"
          icon={<BarChart3 size={32} />}
          title="Skill Gap Detection"
          desc="Compare job skills vs candidate skills and get missing-skill insights."
        />
      </section>
    </div>
  );
}

function ToolCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="block bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition"
      >
        <div className="text-cyan-600 mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{desc}</p>
        <span className="text-cyan-600 text-sm font-semibold inline-flex items-center gap-2">
          Open Tool <ArrowRight size={16} />
        </span>
      </Link>
    </motion.div>
  );
}

