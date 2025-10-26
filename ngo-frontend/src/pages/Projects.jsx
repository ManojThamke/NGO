// src/pages/Projects.jsx
import React from "react";

export default function Projects() {
  const projects = [
    {
      title: "Rural Education Program",
      description:
        "Providing quality education and school supplies to underprivileged children in rural areas. Our goal is to reduce dropout rates and improve literacy.",
      impact: "Over 2,000 children enrolled in our education program.",
      image: "/images/education-project.jpg",
    },
    {
      title: "Health & Wellness Camps",
      description:
        "Organizing free health checkups, awareness drives, and vaccination campaigns for communities with limited access to healthcare.",
      impact: "Conducted 50+ health camps reaching 10,000+ people.",
      image: "/images/health-project.jpg",
    },
    {
      title: "Women Empowerment Initiative",
      description:
        "Offering vocational training, entrepreneurship workshops, and financial literacy sessions to support women in becoming self-reliant.",
      impact: "Empowered 500+ women with new livelihood opportunities.",
      image: "/images/women-empowerment.jpg",
    },
    {
      title: "Sustainable Livelihoods Program",
      description:
        "Helping families adopt sustainable income sources through small-scale farming, eco-friendly crafts, and micro-entrepreneurship.",
      impact: "Improved household income for 300+ families.",
      image: "/images/sustainable-project.jpg",
    },
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-heading text-primary font-bold mb-6">
          Our Projects
        </h1>
        <p className="text-lg text-neutral900/80 mb-10 leading-relaxed max-w-3xl">
          At <strong>Nayan Foundation</strong>, we work on multiple community
          initiatives that address education, healthcare, gender equality, and
          sustainability. Each project aims to bring measurable and lasting
          change to the lives of those in need.
        </p>

        {/* Project Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-neutral-200"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-primary mb-2">
                  {project.title}
                </h2>
                <p className="text-neutral900/80 mb-3 leading-relaxed">
                  {project.description}
                </p>
                <p className="text-sm font-medium text-accent">
                  🌟 Impact: {project.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white p-10 rounded-xl shadow-lg border border-neutral-200">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Want to Support Our Projects?
          </h3>
          <p className="text-neutral900/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Your contribution helps us expand our reach and continue to make a
            difference in the lives of people who need it most. Join us in
            building a better and more inclusive future for all.
          </p>
          <a
            href="/donate"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md font-medium shadow-md hover:bg-primary/90 transition"
          >
            Donate Now
          </a>
        </div>
      </div>
    </div>
  );
}
