// src/components/Button.jsx
import React from 'react';

export default function Button({ children, icon: Icon, variant = 'primary', className = '', ...props }) {
  const base = "inline-flex items-center gap-2 font-medium rounded-md px-4 py-2 focus:outline-none focus:ring-2";
  const styles = {
    primary: "bg-primary text-white hover:bg-[#09593f] focus:ring-primary/40",
    secondary: "bg-white text-primary border border-primary hover:bg-primary/5 focus:ring-primary/30",
    ghost: "bg-transparent text-neutral900 hover:underline"
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {Icon && <Icon aria-hidden className="text-lg" />}
      <span>{children}</span>
    </button>
  );
}
