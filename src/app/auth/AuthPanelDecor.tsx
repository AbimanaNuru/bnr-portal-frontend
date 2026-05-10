"use client";

import { motion } from "framer-motion";

export function AuthPanelDecor() {
  return (
    <>
      {/* Subtle top-left light wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,_rgba(255,255,255,0.10)_0%,_transparent_100%)]" />

      {/* Subtle bottom-right darkening */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_100%,_rgba(0,0,0,0.12)_0%,_transparent_100%)]" />

      {/* Dot grid — very faint texture */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Large ambient orb — top right */}
      <motion.div
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-white/[0.06] border border-white/[0.08]"
        animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Medium orb — bottom left */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/[0.05] border border-white/[0.07]"
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Small accent orb — mid right */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -right-10 w-36 h-36 rounded-full bg-white/[0.06] border border-white/[0.1]"
        animate={{ y: ["-4%", "4%", "-4%"], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Bottom centre glow bloom */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-24 bg-white/[0.06] blur-3xl rounded-full"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
