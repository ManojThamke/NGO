// src/components/Hero.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FaHandsHelping } from "react-icons/fa";
import DonateModal from "./DonateModal";

export default function Hero({
  title = "We empower communities to thrive",
  subtitle = "Empowering under-resourced communities through education, health camps, and sustainable livelihoods.",
  image = "/images/hero-banner.jpg", // make sure this is in /public/images/
}) {
  const [donateOpen, setDonateOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "90vh",
        backgroundImage: `linear-gradient(to left, rgba(249,250,251,0.96) 35%, rgba(249,250,251,0.85) 60%, rgba(249,250,251,0.4) 80%, rgba(255,255,255,0)), url(${image})`,
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay blur for depth */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-neutral900 leading-tight">
            {title}
          </h1>

          <p className="text-lg text-neutral900/80 font-body leading-relaxed">
            {subtitle}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setDonateOpen(true)}
              variant="primary"
              icon={FaHandsHelping}
              className="w-full sm:w-auto"
            >
              Donate
            </Button>
            <Button
              onClick={() => navigate("/volunteer")}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Volunteer
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-lg">12k+</span>
              </div>
              <div>
                <div className="text-sm font-semibold">People helped</div>
                <div className="text-xs text-neutral900/60">in 5 years</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">120</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Programs</div>
                <div className="text-xs text-neutral900/60">last year</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-neutral900/10 flex items-center justify-center">
                <span className="text-neutral900 font-bold text-lg">50</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Volunteers</div>
                <div className="text-xs text-neutral900/60">active now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        defaultAmount={25}
      />
    </section>
  );
}
