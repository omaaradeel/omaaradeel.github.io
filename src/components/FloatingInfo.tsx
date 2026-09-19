"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import CipherText from "@/components/CipherText";

interface FloatingInfoProps {
  scrollYProgress: MotionValue<number>;
}

export default function FloatingInfo({ scrollYProgress }: FloatingInfoProps) {
  // Stage 1: 10+ Years Experience (Completely isolated scroll window - No overlap)
  const stage1Opacity = useTransform(scrollYProgress, [0.64, 0.69, 0.76, 0.80], [0, 1, 1, 0], { clamp: true });
  const stage1Y = useTransform(scrollYProgress, [0.64, 0.69, 0.76, 0.80], [50, 0, 0, -40], { clamp: true });
  const stage1Scale = useTransform(scrollYProgress, [0.64, 0.69, 0.76, 0.80], [0.92, 1, 1, 0.95], { clamp: true });

  // Stage 2: 100+ Projects Shipped (Appears ONLY after Stage 1 has cleanly exited)
  const stage2Opacity = useTransform(scrollYProgress, [0.81, 0.85, 0.92, 0.96], [0, 1, 1, 0], { clamp: true });
  const stage2Y = useTransform(scrollYProgress, [0.81, 0.85, 0.92, 0.96], [50, 0, 0, -40], { clamp: true });
  const stage2Scale = useTransform(scrollYProgress, [0.81, 0.85, 0.92, 0.96], [0.92, 1, 1, 0.95], { clamp: true });

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center">
      {/* Milestone 01: 10+ Years of Experience (Dark Nocturnal Aesthetic) */}
      <motion.div
        style={{ opacity: stage1Opacity, y: stage1Y, scale: stage1Scale }}
        className="absolute left-6 sm:left-[10%] md:left-[14%] max-w-xl text-left pointer-events-auto"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-red-500 font-bold tracking-widest uppercase mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>/// 04 — TRACK RECORD</span>
          <span className="text-white/40">• EST. 2016</span>
        </div>

        <div className="font-space-grotesk text-7xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-white leading-[0.85] [text-shadow:_0_0_60px_rgba(255,255,255,0.35),_0_10px_35px_rgba(0,0,0,0.8)]">
          10<span className="text-red-500">+</span>
        </div>

        <h3 className="font-space-grotesk text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]">
          <CipherText text="YEARS OF EXPERIENCE" />
        </h3>

        <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 font-medium leading-relaxed mt-2 max-w-md [text-shadow:_0_2px_15px_rgba(0,0,0,0.9)]">
          A decade architecting high-availability distributed systems, resilient cloud infrastructures, and modern web applications.
        </p>
      </motion.div>

      {/* Milestone 02: 100+ Projects Completed (Dark Nocturnal Aesthetic) */}
      <motion.div
        style={{ opacity: stage2Opacity, y: stage2Y, scale: stage2Scale }}
        className="absolute right-6 sm:right-[10%] md:right-[14%] max-w-xl text-right pointer-events-auto"
      >
        <div className="flex items-center justify-end gap-2 font-mono text-xs text-red-500 font-bold tracking-widest uppercase mb-2">
          <span className="text-white/40">WORLDWIDE DELIVERY •</span>
          <span>/// 05 — GLOBAL IMPACT</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        <div className="font-space-grotesk text-7xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-white leading-[0.85] [text-shadow:_0_0_60px_rgba(255,255,255,0.35),_0_10px_35px_rgba(0,0,0,0.8)]">
          100<span className="text-red-500">+</span>
        </div>

        <h3 className="font-space-grotesk text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-3 [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]">
          <CipherText text="PROJECTS COMPLETED" />
        </h3>

        <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 font-medium leading-relaxed mt-2 max-w-md ml-auto [text-shadow:_0_2px_15px_rgba(0,0,0,0.9)]">
          High-concurrency portals, enterprise platforms, and interactive digital products engineered and shipped globally.
        </p>
      </motion.div>
    </div>
  );
}
