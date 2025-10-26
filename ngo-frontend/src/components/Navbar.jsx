// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaDonate, FaBars } from "react-icons/fa";
import Logo from "../assets/logo.svg"; // ✅ Make sure file exists
import DonateModal from "./DonateModal"; // ✅ Reuse same modal component

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="NGO Logo" className="w-10 h-10" />
              <div>
                <span className="block text-sm font-medium text-primary font-heading">
                  Nurtura Foundation
                </span>
                <span className="block text-xs text-neutral900/60 -mt-0.5">
                  Empowering communities
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/volunteer"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              Volunteer
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-neutral900/80 hover:text-primary"
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            {/* ✅ Donate Button Opens Stripe Modal */}
            <button
              onClick={() => setDonateOpen(true)}
              className="hidden md:inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#09593f] focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            >
              <FaDonate aria-hidden /> <span>Donate</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-neutral900/80 hover:text-primary focus:outline-none focus:ring-2"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Donation Modal */}
      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        defaultAmount={25}
      />
    </header>
  );
}
