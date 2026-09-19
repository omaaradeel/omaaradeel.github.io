"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import CipherText from "@/components/CipherText";

interface FloatingInfoProps {
  scrollYProgress: MotionValue<number>;
}

export default function FloatingInfo({ scrollYProgress }: FloatingInfoProps) {
  // Title / Center HUD Indicator
  const titleOpacity = useTransform(scrollYProgress, [0.65, 0.70, 0.88, 0.93], [0, 1, 1, 0], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0.65, 0.70, 0.88, 0.93], [30, 0, 0, -30], { clamp: true });

  // Node 1 (Top-Left): 10+ Years Experience
  const node1Opacity = useTransform(scrollYProgress, [0.66, 0.71, 0.77, 0.82], [0, 1, 1, 0], { clamp: true });
  const node1X = useTransform(scrollYProgress, [0.66, 0.71, 0.77, 0.82], [-30, 0, 0, -30], { clamp: true });

  // Node 2 (Bottom-Right): 100+ Shipped Solutions
  const node2Opacity = useTransform(scrollYProgress, [0.70, 0.75, 0.81, 0.86], [0, 1, 1, 0], { clamp: true });
  const node2X = useTransform(scrollYProgress, [0.70, 0.75, 0.81, 0.86], [30, 0, 0, 30], { clamp: true });

  // Node 3 (Top-Right): 99.9% Uptime & Cloud Resilience
  const node3Opacity = useTransform(scrollYProgress, [0.74, 0.79, 0.85, 0.89], [0, 1, 1, 0], { clamp: true });
  const node3X = useTransform(scrollYProgress, [0.74, 0.79, 0.85, 0.89], [30, 0, 0, 30], { clamp: true });

  // Node 4 (Bottom-Left): 50M+ Concurrent Operations
  const node4Opacity = useTransform(scrollYProgress, [0.78, 0.83, 0.88, 0.92], [0, 1, 1, 0], { clamp: true });
  const node4X = useTransform(scrollYProgress, [0.78, 0.83, 0.88, 0.92], [-30, 0, 0, -30], { clamp: true });

  return (
    <div className="relative w-full h-full pointer-events-none select-none">
      {/* Center Ambient HUD Header (No cards) */}
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 text-center pointer-events-auto px-4 z-10 w-full max-w-xl"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold mb-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          /// 04 — SPATIAL TELEMETRY & TRACK RECORD
        </span>
        <h2 className="font-space-grotesk text-3xl sm:text-6xl font-black tracking-tight text-black [text-shadow:_0_10px_30px_rgba(0,0,0,0.3)]">
          <CipherText text="DECADE OF IMPACT" />
        </h2>
        <p className="font-mono text-xs text-black/80 mt-2 tracking-widest uppercase font-semibold">
          Spatial telemetry // Real-world benchmarks
        </p>
      </motion.div>

      {/* Floating Spatial Stat 1: Top-Left (10+ Years) - CARD-FREE */}
      <motion.div
        style={{ opacity: node1Opacity, x: node1X }}
        className="absolute top-[20%] sm:top-[22%] left-6 sm:left-[8%] md:left-[10%] max-w-[340px] sm:max-w-[420px] pointer-events-auto"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-red-600 font-bold tracking-widest uppercase mb-1">
          <span>[ + ]</span>
          <span>SYS_ORIGIN // 01</span>
          <span className="text-black/50">EST. 2016</span>
        </div>

        <div className="font-space-grotesk text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-black [text-shadow:_0_10px_40px_rgba(0,0,0,0.25)] leading-none">
          10<span className="text-red-600">+</span>
        </div>

        <div className="font-space-grotesk text-lg sm:text-xl font-bold tracking-tight text-black mt-2">
          YEARS ARCHITECTURAL LEADERSHIP
        </div>

        <p className="font-sans text-xs sm:text-sm text-black/80 font-medium leading-relaxed mt-2 [text-shadow:_0_2px_10px_rgba(255,255,255,0.8)]">
          A decade of architecting mission-critical distributed backends, resilient APIs, and high-velocity web platforms engineered for global scale.
        </p>
      </motion.div>

      {/* Floating Spatial Stat 2: Bottom-Right (100+ Shipped) - CARD-FREE */}
      <motion.div
        style={{ opacity: node2Opacity, x: node2X }}
        className="absolute bottom-[20%] sm:bottom-[22%] right-6 sm:right-[8%] md:right-[10%] max-w-[340px] sm:max-w-[420px] pointer-events-auto text-right"
      >
        <div className="flex items-center justify-end gap-2 font-mono text-xs text-red-600 font-bold tracking-widest uppercase mb-1">
          <span className="text-black/50">GLOBAL PRODUCTION</span>
          <span>DEPLOYMENTS // 02</span>
          <span>[ + ]</span>
        </div>

        <div className="font-space-grotesk text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-black [text-shadow:_0_10px_40px_rgba(0,0,0,0.25)] leading-none">
          100<span className="text-red-600">+</span>
        </div>

        <div className="font-space-grotesk text-lg sm:text-xl font-bold tracking-tight text-black mt-2">
          SHIPPED PRODUCTION SYSTEMS
        </div>

        <p className="font-sans text-xs sm:text-sm text-black/80 font-medium leading-relaxed mt-2 [text-shadow:_0_2px_10px_rgba(255,255,255,0.8)]">
          Delivering high-concurrency web portals, enterprise cloud architectures, and interactive digital products for global brands and startups.
        </p>
      </motion.div>

      {/* Floating Spatial Stat 3: Top-Right (99.9% Uptime) - CARD-FREE */}
      <motion.div
        style={{ opacity: node3Opacity, x: node3X }}
        className="absolute top-[22%] sm:top-[24%] right-6 sm:right-[8%] md:right-[10%] max-w-[340px] sm:max-w-[420px] pointer-events-auto text-right"
      >
        <div className="flex items-center justify-end gap-2 font-mono text-xs text-red-600 font-bold tracking-widest uppercase mb-1">
          <span className="text-black/50">HIGH AVAILABILITY</span>
          <span>RESILIENCE // 03</span>
          <span>[ + ]</span>
        </div>

        <div className="font-space-grotesk text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-black [text-shadow:_0_10px_40px_rgba(0,0,0,0.25)] leading-none">
          99.9<span className="text-red-600">%</span>
        </div>

        <div className="font-space-grotesk text-lg sm:text-xl font-bold tracking-tight text-black mt-2">
          FAULT-TOLERANT CLOUD UPTIME
        </div>

        <p className="font-sans text-xs sm:text-sm text-black/80 font-medium leading-relaxed mt-2 [text-shadow:_0_2px_10px_rgba(255,255,255,0.8)]">
          Engineering bulletproof cloud infrastructures with automated failover, zero-downtime CI/CD pipelines, and microsecond API responsiveness.
        </p>
      </motion.div>

      {/* Floating Spatial Stat 4: Bottom-Left (50M+ Ops) - CARD-FREE */}
      <motion.div
        style={{ opacity: node4Opacity, x: node4X }}
        className="absolute bottom-[18%] sm:bottom-[20%] left-6 sm:left-[8%] md:left-[10%] max-w-[340px] sm:max-w-[420px] pointer-events-auto"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-red-600 font-bold tracking-widest uppercase mb-1">
          <span>[ + ]</span>
          <span>THROUGHPUT // 04</span>
          <span className="text-black/50">HIGH CONCURRENCY</span>
        </div>

        <div className="font-space-grotesk text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-black [text-shadow:_0_10px_40px_rgba(0,0,0,0.25)] leading-none">
          50M<span className="text-red-600">+</span>
        </div>

        <div className="font-space-grotesk text-lg sm:text-xl font-bold tracking-tight text-black mt-2">
          CONCURRENT DATA TRANSACTIONS
        </div>

        <p className="font-sans text-xs sm:text-sm text-black/80 font-medium leading-relaxed mt-2 [text-shadow:_0_2px_10px_rgba(255,255,255,0.8)]">
          Processing massive concurrent event streams with optimized database querying, distributed in-memory caching, and reactive clientside state.
        </p>
      </motion.div>
    </div>
  );
}
