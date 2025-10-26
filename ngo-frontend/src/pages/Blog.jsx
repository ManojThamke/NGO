// src/pages/Blog.jsx
import React from "react";

export default function Blog() {
  const blogPosts = [
    {
      title: "Education for All: Bridging the Learning Gap",
      date: "October 15, 2025",
      author: "Nayan Foundation Team",
      image: "/images/blog-education.jpg",
      excerpt:
        "Access to quality education remains one of the greatest challenges for children in under-resourced communities. Discover how our Rural Education Program is changing lives through scholarships, mentorship, and digital learning tools.",
      link: "#",
    },
    {
      title: "Health Camps: Bringing Care to Remote Areas",
      date: "September 30, 2025",
      author: "Dr. Aditi Sharma",
      image: "/images/blog-health.jpg",
      excerpt:
        "In areas where access to healthcare is limited, our mobile health camps ensure that no one is left behind. From free checkups to preventive awareness sessions, we’re making rural healthcare accessible and sustainable.",
      link: "#",
    },
    {
      title: "Empowering Women Through Skill Development",
      date: "August 22, 2025",
      author: "Anjali Mehta",
      image: "/images/blog-women.jpg",
      excerpt:
        "Empowerment begins with opportunity. Learn how our vocational training programs and micro-entrepreneurship workshops are helping women build confidence and secure financial independence.",
      link: "#",
    },
    {
      title: "Sustainability and Livelihood: A Greener Tomorrow",
      date: "July 10, 2025",
      author: "Ravi Kumar",
      image: "/images/blog-sustainability.jpg",
      excerpt:
        "Sustainability isn’t just about the environment — it’s about empowering communities to live in harmony with it. See how our eco-friendly livelihood programs are creating long-term impact.",
      link: "#",
    },
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-heading text-primary font-bold mb-6">
          Our Blog
        </h1>
        <p className="text-lg text-neutral900/80 mb-10 leading-relaxed max-w-3xl">
          Explore inspiring stories, impact updates, and insightful articles
          from <strong>Nayan Foundation</strong>. Learn how education, health,
          and sustainability initiatives are transforming lives every day.
        </p>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-neutral-200"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-primary mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral900/60 mb-1">
                  {post.date} • {post.author}
                </p>
                <p className="text-neutral900/80 mb-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <a
                  href={post.link}
                  className="text-primary font-medium hover:underline"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white p-10 rounded-xl shadow-lg border border-neutral-200">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Have a Story to Share?
          </h3>
          <p className="text-neutral900/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            We love hearing from our volunteers, donors, and community members.
            Share your experiences, reflections, or ideas with us and inspire
            others to get involved.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md font-medium shadow-md hover:bg-primary/90 transition"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </div>
  );
}
