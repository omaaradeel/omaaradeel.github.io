"use client";

import { motion } from "framer-motion";
import CipherText from "@/components/CipherText";

interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  highlight: string;
}

const STATS: StatItem[] = [
  {
    id: "01",
    value: "10+",
    label: "YEARS EXPERIENCE",
    description: "Architecting, engineering, and scaling mission-critical web applications and distributed systems.",
    highlight: "EST. 2016",
  },
  {
    id: "02",
    value: "100+",
    label: "PROJECTS DELIVERED",
    description: "Successfully shipped web applications, enterprise platforms, and interactive digital experiences.",
    highlight: "GLOBAL CLIENTS",
  },
  {
    id: "03",
    value: "99.9%",
    label: "UPTIME & SCALE",
    description: "Designing fault-tolerant backends, cloud-native deployments, and sub-millisecond response systems.",
    highlight: "HIGH RELIABILITY",
  },
  {
    id: "04",
    value: "50M+",
    label: "REQUESTS HANDLED",
    description: "High-throughput APIs and data pipelines built for high concurrency and zero downtime.",
    highlight: "PERFORMANCE FIRST",
  },
];

const CAPABILITIES = [
  "End-to-End System Architecture",
  "High-Throughput Distributed Backends",
  "Reactive Modern Web Frontends",
  "Performance & Core Web Vitals Optimization",
  "Cloud Infrastructure & Containerization",
  "Technical Leadership & Code Craftsmanship",
];

export default function ExperienceStats() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-black/70 mb-2 block">
          /// 04 — TRACK RECORD & IMPACT
        </span>
        <h2 className="font-space-grotesk text-4xl sm:text-6xl font-bold tracking-tight text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
          <CipherText text="DECADE OF EXCELLENCE" />
        </h2>
        <p className="mt-3 text-base sm:text-lg text-black/80 font-medium max-w-xl mx-auto [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)]">
          Over a decade of solving complex engineering problems and delivering high-velocity digital products.
        </p>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            data-interactive="true"
            className="relative p-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 hover:border-red-500/60 shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col justify-between"
          >
            {/* Top Tag */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[10px] text-red-400 font-semibold tracking-wider">
                {stat.highlight}
              </span>
              <span className="font-mono text-[10px] text-white/40">#{stat.id}</span>
            </div>

            {/* Main Metric */}
            <div>
              <div className="font-space-grotesk text-5xl sm:text-6xl font-bold text-white tracking-tight group-hover:text-red-300 transition-colors drop-shadow-md">
                {stat.value}
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-red-400 tracking-wider mt-1 mb-3 uppercase">
                {stat.label}
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                {stat.description}
              </p>
            </div>

            {/* Subtle bottom glow indicator */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-shadow" />
              <span className="font-mono text-[10px] text-white/50 tracking-wider">VERIFIED MILESTONE</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Capabilities Ticker / Pills Strip */}
      <div className="p-4 sm:p-5 rounded-xl bg-black/60 backdrop-blur-lg border border-white/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="font-mono text-xs text-red-400 font-semibold tracking-wider uppercase mr-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          KEY COMPETENCIES:
        </span>
        {CAPABILITIES.map((cap) => (
          <span
            key={cap}
            className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-red-400/50 transition-colors"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}
