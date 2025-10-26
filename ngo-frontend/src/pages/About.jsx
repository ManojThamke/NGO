// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="bg-[#f9fafb] min-h-screen py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-heading text-primary font-bold mb-6">
          About Us
        </h1>

        <p className="text-lg text-neutral900/80 leading-relaxed">
          <strong>Nurtura Foundation</strong> is a non-profit organization
          dedicated to empowering under-resourced communities through education,
          healthcare, and sustainable development programs. Since our founding,
          we have worked tirelessly to uplift marginalized groups and create
          equal opportunities for all.
        </p>

        <p className="text-lg text-neutral900/80 leading-relaxed">
          Our mission is to create long-term impact by improving access to
          quality education, organizing health awareness camps, supporting
          women’s empowerment initiatives, and fostering livelihood
          opportunities for families in need. We believe that lasting change
          comes from within the community — when people are given the right
          tools, support, and confidence to thrive.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200">
          <h2 className="text-2xl font-semibold text-primary mb-3">
            🌍 Our Vision
          </h2>
          <p className="text-neutral900/80 leading-relaxed">
            To build a compassionate and inclusive society where every
            individual, regardless of their background, has access to education,
            health, and sustainable livelihoods — paving the way for a brighter
            and self-reliant future.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200">
          <h2 className="text-2xl font-semibold text-primary mb-3">
            🎯 Our Mission
          </h2>
          <ul className="list-disc list-inside text-neutral900/80 leading-relaxed space-y-2">
            <li>Provide quality education and skill-based training programs.</li>
            <li>Conduct free medical and wellness camps in rural areas.</li>
            <li>Promote gender equality and women’s empowerment.</li>
            <li>Support sustainable livelihood opportunities.</li>
            <li>Encourage youth engagement through volunteering and awareness campaigns.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200">
          <h2 className="text-2xl font-semibold text-primary mb-3">
            💚 What We Do
          </h2>
          <p className="text-neutral900/80 leading-relaxed mb-4">
            Through a dedicated network of volunteers, donors, and partners, we
            organize impactful initiatives that bring real change to
            communities:
          </p>
          <ul className="list-disc list-inside text-neutral900/80 leading-relaxed space-y-2">
            <li>Educational sponsorships for underprivileged children.</li>
            <li>Health awareness, blood donation, and vaccination drives.</li>
            <li>Environmental sustainability and clean water projects.</li>
            <li>Vocational training and entrepreneurship programs.</li>
          </ul>
        </div>

        <div className="text-center pt-10">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Join Our Mission
          </h3>
          <p className="text-neutral900/70 max-w-2xl mx-auto leading-relaxed">
            Together, we can make a difference. Whether it’s volunteering your
            time, contributing resources, or spreading awareness — every small
            effort counts toward building a better tomorrow.
          </p>
          <a
            href="/volunteer"
            className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-md font-medium shadow-md hover:bg-primary/90 transition"
          >
            Become a Volunteer
          </a>
        </div>
      </div>
    </div>
  );
}
