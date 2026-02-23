"use client";

import { Github, Linkedin, Mail, Crown } from "lucide-react";
import { motion } from "framer-motion";

const team = [
  {
    name: "Maryam Amjad",
    role: "Team Leader • Frontend Developer • UI Designer",
    description:
      "Led the project, designed complete UI/UX, and developed frontend architecture of HireGen AI.",
    email: "maryamamjad621@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/maryam-amjad%E2%9C%8D%EF%B8%8F-3a235a315/",
    github: "https://github.com/maryamaliali",
    contribution: 35,
    leader: true,
  },
  {
    name: "Abdullah Bin Asim",
    role: "Backend Developer • API Integration",
    description:
      "Developed backend logic using Next.js API routes, integrated APIs, and co-created the core project idea.",
    email: "createfbid350@gmail.com",
    linkedin: "https://www.linkedin.com/in/abdullahasim1/",
    github: "https://github.com/abdullahasim1",
    contribution: 30,
  },
  {
    name: "Sehrish Maqbool",
    role: "Research & Presentation",
    description: "Prepared project slides and assisted in research planning.",
    email: "sehrmaqbool@gmail.com",
    linkedin: "https://www.linkedin.com/in/sehrish-maqbool-b5b00237a",
    github: "https://github.com/Sehrish-web209",
    contribution: 15,
  },
  {
    name: "Hadia Shahjahan",
    role: "Documentation & Demo Video",
    description:
      " Documentation structure & contributed to hackathon demonstration materials.",
    email: "hadiashah0505@gmail.com",
    linkedin: "https://www.linkedin.com/in/hadia-shahjahan",
    github: "https://github.com/hadiashah01",
    contribution: 10,
  },
  {
    name: "Muhammad Abdullah",
    role: "Research Support & Validation",
    description: "Supported research tasks and helped in concept validation.",
    email: "muhammed.abdullah.coder@gmail.com",
    linkedin: "https://www.linkedin.com/in/muhammad-abdullah-b422723a8/",
    github: "https://github.com/Abdullah-alt-hue-gif",
    contribution: 10,
  },
];

export default function About() {
  return (
    <div className="space-y-24">
      {/* INTRO */}
      <section>
        <h1 className="text-4xl font-bold text-cyan-600 mb-6">
          About HireGen AI
        </h1>

        <p className="text-gray-600 max-w-3xl leading-relaxed">
          HireGen AI was developed during the
          <span className="font-semibold text-cyan-600">
            {" "}
            HEC Generative AI Training Cohort 2 Hackathon
          </span>
          . The hackathon officially started on
          <span className="font-semibold"> Friday, 20 February at 8:00 PM</span>
          and ended on
          <span className="font-semibold">
            {" "}
            Monday, 23 February at 11:00 PM
          </span>
          — totaling{" "}
          <span className="font-semibold text-cyan-600">75 hours</span>.
          <br />
          <br />
          Our team successfully completed the full project by
          <span className="font-semibold text-green-600">
            {" "}
            Monday 3:00 PM (67 hours)
          </span>
          , finishing 8 hours before the official deadline.
        </p>
      </section>

      {/* TEAM */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-10">
          Meet Our Team
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className={`relative p-[2px] rounded-2xl ${
                member.leader
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-gradient"
                  : ""
              }`}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>

                  {member.leader && <Crown className="text-yellow-500" />}
                </div>

                <p className="text-sm text-cyan-600 font-medium">
                  {member.role}
                </p>

                {member.leader && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs bg-cyan-100 text-cyan-600 rounded-full">
                    Hackathon Team Leader
                  </span>
                )}

                <p className="text-gray-600 text-sm mt-4">
                  {member.description}
                </p>

                {/* Contribution Bar */}
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-1">
                    Contribution: {member.contribution}%
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${member.contribution}%` }}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 mt-6">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-cyan-600 hover:text-cyan-800 transition"
                  >
                    <Mail size={20} />
                  </a>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    className="group relative text-blue-600 hover:text-blue-800 transition"
                  >
                    <Linkedin size={20} />

                    <span className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap">
                      View LinkedIn Profile
                    </span>
                  </a>

                  <a
                    href={member.github}
                    target="_blank"
                    className="text-gray-700 hover:text-black transition"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-10">
          Technology Stack
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <TechCard
            title="Frontend"
            desc="Next.js + Tailwind CSS + Framer Motion"
          />
          <TechCard
            title="Backend"
            desc="Next.js API Routes (Server-side logic)"
          />
          <TechCard
            title="Database"
            desc="Mock Data (Local JSON files simulating database operations)"
          />
          <TechCard
            title="State Management"
            desc="React Hooks (useState, useEffect)"
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-10">
          Development Timeline
        </h2>

        <div className="relative pl-6 space-y-10 border-l-2 border-cyan-400">
          <TimelineItem
            time="Friday • 20 Feb • 8:00 PM"
            title="Hackathon Officially Started"
          />

          <TimelineItem
            time="Friday Night"
            title="Project Ideation & Planning"
          />

          <TimelineItem
            time="Saturday"
            title="Frontend Development (Next.js + Tailwind CSS)"
          />

          <TimelineItem
            time="Sunday"
            title="Backend API Routes & Mock Data Integration"
          />

          <TimelineItem
            time="Monday • 3:00 PM"
            title="Project Completed & Final Testing (67 Hours)"
            highlight
          />

          <TimelineItem
            time="Monday • 11:00 PM"
            title="Official Submission Deadline (Total 75 Hours)"
          />
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function TechCard({ title, desc }: any) {
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition">
      <h3 className="text-lg font-semibold text-cyan-600 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function TimelineItem({ time, title, highlight }: any) {
  return (
    <div className="pl-4">
      <p className="text-sm text-gray-500 mb-1">{time}</p>
      <h3
        className={`text-lg font-semibold ${
          highlight ? "text-green-600" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
    </div>
  );
}
