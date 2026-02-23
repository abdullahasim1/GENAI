"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-16">

      {/* Page Header */}
      <div className="text-center mb-14 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          Have questions about HireGen AI? Reach out to us and our team will get back to you as soon as possible.
        </p>
      </div>

      {/* Main Contact Card */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-12">

        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-cyan-600">
            Get In Touch
          </h2>

          <div className="flex items-start gap-4">
            <Mail className="text-cyan-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-gray-600 text-sm">hiregenai@email.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-cyan-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Phone</p>
              <p className="text-gray-600 text-sm">+92 300 0000000</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-cyan-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Location</p>
              <p className="text-gray-600 text-sm">Pakistan</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-6">

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-4 rounded-xl font-semibold hover:bg-cyan-700 transition shadow-md hover:shadow-lg"
          >
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
}