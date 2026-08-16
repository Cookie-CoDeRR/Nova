"use client";

import React from "react";

export function GlowBackground() {
  return (
    <div className="glow-mesh" aria-hidden="true">
      <div className="glow-orb-purple" />
      <div className="glow-orb-blue" />
      <div className="glow-orb-cyan" />
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
