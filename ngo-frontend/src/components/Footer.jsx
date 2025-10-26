// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f9fafb] border-t border-neutral-200 py-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 items-center justify-between">
        {/* Left Section */}
        <div className="flex items-start gap-3">
          <img
            src="/images/logo.png" // ✅ Correct public path
            alt="Nayan Foundation Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h2 className="text-lg font-semibold text-primary">Nurtura Foundation</h2>
            <p className="text-sm text-neutral900/70">Empowering communities</p>
            <p className="mt-2 text-sm text-neutral900/70 max-w-md">
              We run community projects focused on education, health camps, and
              livelihood training. Join us to make a difference.
            </p>
            <p className="mt-3 text-xs text-neutral900/60">
              © 2025 Nurtura Foundation. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Section (Social Links) */}
        <div className="flex justify-start md:justify-end items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral900/70 hover:text-primary transition"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral900/70 hover:text-primary transition"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral900/70 hover:text-primary transition"
          >
            <FaTwitter size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
