"use client";

import { Github, Linkedin, Mail, Crown } from "lucide-react";
import { motion } from "framer-motion";

/* ================= TEAM DATA ================= */

const team = [
  {
    name: "Maryam Amjad",
    role: "Team Leader • Frontend Developer • UI Designer",
    description:
      "Led the project, designed UI/UX, and developed frontend architecture of HireGen AI.",
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
      "Developed backend using Next.js API routes and integrated MongoDB database.",
    email: "createfbid350@gmail.com",
    linkedin: "https://www.linkedin.com/in/abdullahasim1/",
    github: "https://github.com/abdullahasim1",
    contribution: 30,
  },
  {
    name: "Sehrish Maqbool",
    role: "Presentation & Demo",
    description: "Prepared slides and demo video.",
    email: "sehrmaqbool@gmail.com",
    linkedin: "https://www.linkedin.com/in/sehrish-maqbool-b5b00237a",
    github: "https://github.com/Sehrish-web209",
    contribution: 15,
  },
  {
    name: "Hadia Shahjahan",
    role: "Research & Documentation",
    description: "Handled research and documentation tasks.",
    email: "hadiashah0505@gmail.com",
    linkedin: "https://www.linkedin.com/in/hadia-shahjahan",
    github: "https://github.com/hadiashah01",
    contribution: 10,
  },
  {
    name: "Muhammad Abdullah",
    role: "Research & Support",
    description: "Supported research and concept validation.",
    email: "muhammed.abdullah.coder@gmail.com",
    linkedin:
      "https://www.linkedin.com/in/muhammad-abdullah-b422723a8/",
    github: "https://github.com/Abdullah-dev-codes",
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
            {" "}HEC Generative AI Training Cohort 2 Hackathon
          </span>.
          The hackathon started on
          <span className="font-semibold"> Friday, 20 February at 8:00 PM</span>
            <tr/>  and ended on
          <span className="font-semibold"> Monday, 23 February at 11:00 PM</span>
         <br/> — totaling <span className="font-semibold text-cyan-600">75 hours</span>.
          <br /><br />
          Our team completed the full project by
          <span className="font-semibold text-green-600"> Monday 3:00 PM (67 hours)</span>,
          finishing 8 hours before the deadline.
        </p>
      </section>

      {/* TEAM SECTION */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-10">
          Meet Our Team
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className={`relative 'p-0.5' rounded-2xl ${
                member.leader
                  ? "bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500"
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

                <p className="text-gray-600 text-sm mt-4">
                  {member.description}
                </p>

                {/* Contribution */}
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

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH STACK SECTION (NOW BEFORE TIMELINE) */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-8">
          Technology Stack
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <TechCard title="Frontend" desc="Next.js + Tailwind CSS + Framer Motion" />
          <TechCard title="Backend" desc="Next.js API Routes (Server Logic)" />
          <TechCard title="Database" desc="MongoDB (Data Storage & Management)" />
        </div>
      </section>

      {/* DEVELOPMENT TIMELINE */}
      <section>
        <h2 className="text-3xl font-semibold text-cyan-600 mb-10">
          Development Timeline
        </h2>

        <div className="relative pl-6 space-y-10 border-l-2 border-cyan-400">

          <TimelineItem
            time="Friday • 20 Feb • 8:00 PM"
            title="Hackathon Started"
          />

          <TimelineItem
            time="Friday Night"
            title="Ideation & Planning"
          />

          <TimelineItem
            time="Saturday"
            title="Frontend Development"
          />

          <TimelineItem
            time="Sunday"
            title="Backend API + MongoDB Integration"
          />

          <TimelineItem
            time="Monday • 3:00 PM"
            title="Project Completed (67 Hours)"
            highlight
          />

          <TimelineItem
            time="Monday • 11:00 PM"
            title="Final Submission Deadline (75 Hours)"
          />

        </div>
      </section>

    </div>
  );
}

/* COMPONENTS */

function TechCard({ title, desc }: any) {
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition">
      <h3 className="text-lg font-semibold text-cyan-600 mb-2">
        {title}
      </h3>
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