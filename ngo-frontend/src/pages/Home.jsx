// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-heading font-bold text-neutral900 mb-6">Featured Projects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium">Project Title</h3>
            <p className="text-sm text-neutral900/70 mt-2">Short description of the project and impact.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium">Project Title</h3>
            <p className="text-sm text-neutral900/70 mt-2">Short description of the project and impact.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium">Project Title</h3>
            <p className="text-sm text-neutral900/70 mt-2">Short description of the project and impact.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
