"use client";

import { useState } from "react";
import CipherText from "@/components/CipherText";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16M4 20L20 4"></path>
  </svg>
);

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h.01M15 12h.01M7.5 4.5A14.99 14.99 0 0 0 2.5 9s1 8.5 4.5 10.5c0 0 3-1.5 4.5-2.5h1c1.5 1 4.5 2.5 4.5 2.5 3.5-2 4.5-10.5 4.5-10.5a14.99 14.99 0 0 0-5-4.5"></path>
    <path d="M7 4.5l-1.5-1.5M17 4.5l1.5-1.5"></path>
  </svg>
);

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "info@omar-adel.me";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <footer className="w-full bg-black/90 backdrop-blur-2xl border-t border-white/10 flex flex-col items-center justify-center p-8 sm:p-14 text-white pointer-events-auto">
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        
        {/* Availability Beacon */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>AVAILABLE FOR NEW PROJECTS // 2026</span>
        </div>

        {/* Section Heading with Decryption */}
        <h2 className="font-space-grotesk text-3xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
          <CipherText text="INIT_CONTACT" />
        </h2>

        <p className="font-sans text-sm sm:text-base text-white/70 max-w-md mb-8">
          Have an ambitious product, high-scale system, or next-generation web experience in mind? Let’s connect.
        </p>

        {/* Interactive Copy Email Pill */}
        <div className="relative mb-8">
          <button
            onClick={handleCopy}
            data-interactive="true"
            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <span className="font-mono text-base sm:text-xl text-white group-hover:text-cyan-300 transition-colors">
              {email}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 group-hover:bg-cyan-500/20 text-xs font-mono text-white/80 group-hover:text-cyan-300 transition-colors">
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-400 font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>COPY</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6 sm:space-x-8 mb-10">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            data-interactive="true"
            aria-label="X Profile"
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-200"
          >
            <XIcon />
          </a>
          <a
            href="https://github.com/omaaradeel"
            target="_blank"
            rel="noopener noreferrer"
            data-interactive="true"
            aria-label="GitHub Profile"
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-200"
          >
            <GithubIcon />
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            data-interactive="true"
            aria-label="Discord Profile"
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-200"
          >
            <DiscordIcon />
          </a>
        </div>

        {/* Terminal Status / Footer Meta */}
        <div className="w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SYSTEM STATUS: OPERATIONAL</span>
          </div>
          <div>
            © 2026 OMAR ADEL. ENGINEERED WITH PRECISION.
          </div>
        </div>

      </div>
    </footer>
  );
}
