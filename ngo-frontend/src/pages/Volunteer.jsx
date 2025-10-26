// src/pages/Volunteer.jsx
import React from 'react';
import VolunteerForm from '../components/VolunteerForm';

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading text-primary mb-6">Volunteer with Us</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <VolunteerForm />
          <div>
            <h2 className="text-xl font-medium mb-2">How it works</h2>
            <ol className="list-decimal ml-5 text-neutral900/80">
              <li>Apply using the form.</li>
              <li>We review your skills and availability.</li>
              <li>Attend a short orientation.</li>
              <li>Join our field teams or remote-support roles.</li>
            </ol>
            <p className="mt-6 text-sm text-neutral900/80">We depend on volunteers for outreach, training, and community events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
