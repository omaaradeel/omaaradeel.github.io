"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import CipherText from "@/components/CipherText";

interface FloatingInfoProps {
  scrollYProgress: MotionValue<number>;
}

export default function FloatingInfo({ scrollYProgress }: FloatingInfoProps) {
  // Title / Center HUD Indicator
  const titleOpacity = useTransform(scrollYProgress, [0.65, 0.71, 0.88, 0.93], [0, 1, 1, 0], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0.65, 0.71, 0.88, 0.93], [30, 0, 0, -30], { clamp: true });

  // Node 1 (Top-Left): 10+ Years Experience
  const node1Opacity = useTransform(scrollYProgress, [0.66, 0.72, 0.78, 0.83], [0, 1, 1, 0], { clamp: true });
  const node1Y = useTransform(scrollYProgress, [0.66, 0.72, 0.78, 0.83], [40, 0, 0, -40], { clamp: true });
  const node1Scale = useTransform(scrollYProgress, [0.66, 0.72, 0.78, 0.83], [0.9, 1, 1, 0.95], { clamp: true });

  // Node 2 (Bottom-Right): 100+ Projects
  const node2Opacity = useTransform(scrollYProgress, [0.70, 0.76, 0.82, 0.87], [0, 1, 1, 0], { clamp: true });
  const node2Y = useTransform(scrollYProgress, [0.70, 0.76, 0.82, 0.87], [40, 0, 0, -40], { clamp: true });
  const node2Scale = useTransform(scrollYProgress, [0.70, 0.76, 0.82, 0.87], [0.9, 1, 1, 0.95], { clamp: true });

  // Node 3 (Top-Right): 99.9% Uptime & Scale
  const node3Opacity = useTransform(scrollYProgress, [0.75, 0.80, 0.86, 0.90], [0, 1, 1, 0], { clamp: true });
  const node3Y = useTransform(scrollYProgress, [0.75, 0.80, 0.86, 0.90], [40, 0, 0, -40], { clamp: true });
  const node3Scale = useTransform(scrollYProgress, [0.75, 0.80, 0.86, 0.90], [0.9, 1, 1, 0.95], { clamp: true });

  // Node 4 (Bottom-Left): 50M+ High-Concurrency Ops
  const node4Opacity = useTransform(scrollYProgress, [0.79, 0.84, 0.89, 0.93], [0, 1, 1, 0], { clamp: true });
  const node4Y = useTransform(scrollYProgress, [0.79, 0.84, 0.89, 0.93], [40, 0, 0, -40], { clamp: true });
  const node4Scale = useTransform(scrollYProgress, [0.79, 0.84, 0.89, 0.93], [0.9, 1, 1, 0.95], { clamp: true });

  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Center Background HUD Title */}
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-auto px-4 z-10 w-full max-w-xl"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-black/70 mb-2 block">
          /// 04 — SPATIAL TELEMETRY & TRACK RECORD
        </span>
        <h2 className="font-space-grotesk text-3xl sm:text-5xl font-bold tracking-tight text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
          <CipherText text="DECADE OF IMPACT" />
        </h2>
        <p className="font-mono text-xs text-black/80 mt-2 tracking-wide font-semibold">
          Scroll to explore verified operational milestones
        </p>
      </motion.div>

      {/* Floating Node 1: Top-Left (10+ Years Experience) */}
      <motion.div
        style={{ opacity: node1Opacity, y: node1Y, scale: node1Scale }}
        data-interactive="true"
        className="absolute top-[18%] sm:top-[20%] left-4 sm:left-[8%] md:left-[12%] max-w-[320px] sm:max-w-[380px] p-5 sm:p-6 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-200 pointer-events-auto group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SYS_TELEMETRY // 01
          </span>
          <span className="font-mono text-[10px] text-white/40">EST. 2016</span>
        </div>

        <div className="font-space-grotesk text-4xl sm:text-5xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
          10+ YEARS
        </div>
        <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mt-1 mb-2 uppercase">
          ENGINEERING ARCHITECTURE & LEADERSHIP
        </div>
        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-sans">
          A decade of architecting mission-critical distributed backends, robust APIs, and ultra-responsive web applications from inception to global scale.
        </p>
      </motion.div>

      {/* Floating Node 2: Bottom-Right (100+ Projects) */}
      <motion.div
        style={{ opacity: node2Opacity, y: node2Y, scale: node2Scale }}
        data-interactive="true"
        className="absolute bottom-[20%] sm:bottom-[22%] right-4 sm:right-[8%] md:right-[12%] max-w-[320px] sm:max-w-[380px] p-5 sm:p-6 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-200 pointer-events-auto group text-right"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] text-white/40">GLOBAL CLIENTS</span>
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            DELIVERY // 02
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </span>
        </div>

        <div className="font-space-grotesk text-4xl sm:text-5xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
          100+ SHIPPED
        </div>
        <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mt-1 mb-2 uppercase">
          FULL-CYCLE DIGITAL SOLUTIONS
        </div>
        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-sans">
          Delivering high-concurrency web portals, enterprise platforms, and interactive digital experiences for startups and industry leaders worldwide.
        </p>
      </motion.div>

      {/* Floating Node 3: Top-Right (99.9% Uptime & Scale) */}
      <motion.div
        style={{ opacity: node3Opacity, y: node3Y, scale: node3Scale }}
        data-interactive="true"
        className="absolute top-[22%] sm:top-[25%] right-4 sm:right-[8%] md:right-[14%] max-w-[320px] sm:max-w-[380px] p-5 sm:p-6 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-200 pointer-events-auto group text-right"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] text-white/40">HIGH RELIABILITY</span>
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            RESILIENCE // 03
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </span>
        </div>

        <div className="font-space-grotesk text-4xl sm:text-5xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
          99.9% UPTIME
        </div>
        <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mt-1 mb-2 uppercase">
          FAULT-TOLERANT CLOUD SYSTEMS
        </div>
        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-sans">
          Engineering resilient cloud architectures with automated failover, zero-downtime CI/CD deployment pipelines, and sub-millisecond API responses.
        </p>
      </motion.div>

      {/* Floating Node 4: Bottom-Left (50M+ Requests) */}
      <motion.div
        style={{ opacity: node4Opacity, y: node4Y, scale: node4Scale }}
        data-interactive="true"
        className="absolute bottom-[18%] sm:bottom-[20%] left-4 sm:left-[8%] md:left-[12%] max-w-[320px] sm:max-w-[380px] p-5 sm:p-6 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-200 pointer-events-auto group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SCALE // 04
          </span>
          <span className="font-mono text-[10px] text-white/40">HIGH CONCURRENCY</span>
        </div>

        <div className="font-space-grotesk text-4xl sm:text-5xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors drop-shadow-md">
          50M+ OPS
        </div>
        <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mt-1 mb-2 uppercase">
          HIGH-VELOCITY PIPELINES
        </div>
        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-sans">
          Processing massive concurrent event streams with optimized database querying, in-memory caching, and reactive clientside state management.
        </p>
      </motion.div>
    </div>
  );
}
