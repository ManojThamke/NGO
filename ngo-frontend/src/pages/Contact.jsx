// src/pages/Contact.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';
import Navbar from '../components/Navbar'; // optional if App already includes Navbar
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* If Navbar/Footer already in App, you can remove these */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-heading text-primary mb-6">Contact Us</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <ContactForm />
          <div>
            <h2 className="text-xl font-medium mb-2">Our Office</h2>
            <p className="text-sm text-neutral900/80">Address line 1<br/>City, State, ZIP</p>
            <h3 className="mt-6 font-medium">Email</h3>
            <p className="text-sm text-neutral900/80">contact@example.org</p>
            <h3 className="mt-6 font-medium">Phone</h3>
            <p className="text-sm text-neutral900/80">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
}
