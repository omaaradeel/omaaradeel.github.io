"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

interface Chapter {
  id: string;
  label: string;
  progress: number;
}

const CHAPTERS: Chapter[] = [
  { id: "01", label: "ORIGIN", progress: 0.0 },
  { id: "02", label: "VISION", progress: 0.25 },
  { id: "03", label: "STACK", progress: 0.50 },
  { id: "04", label: "IMPACT", progress: 0.75 },
  { id: "05", label: "CONTACT", progress: 1.0 },
];

export default function ScrollProgressHUD() {
  const { scrollYProgress } = useScroll();
  const [currentProgress, setCurrentProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setCurrentProgress(latest);
  });

  const handleJump = (targetProgress: number) => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = targetProgress * totalScrollable;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Find active chapter index
  const activeIndex = CHAPTERS.reduce((bestIndex, chapter, index) => {
    const diff = Math.abs(currentProgress - chapter.progress);
    const bestDiff = Math.abs(currentProgress - CHAPTERS[bestIndex].progress);
    return diff < bestDiff ? index : bestIndex;
  }, 0);

  return (
    <aside
      aria-label="Scroll Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-4 pointer-events-auto mix-blend-difference text-white select-none"
    >
      {/* Chapter Pips */}
      {CHAPTERS.map((chapter, index) => {
        const isActive = activeIndex === index;

        return (
          <button
            key={chapter.id}
            onClick={() => handleJump(chapter.progress)}
            data-interactive="true"
            className="group flex items-center gap-3 py-1 cursor-pointer focus:outline-none text-right"
          >
            {/* Label reveal on hover */}
            <span
              className={`font-mono text-[10px] tracking-widest transition-all duration-200 ${
                isActive
                  ? "opacity-100 font-bold text-red-500 translate-x-0"
                  : "opacity-0 group-hover:opacity-100 text-white/70 translate-x-2 group-hover:translate-x-0"
              }`}
            >
              {chapter.id} // {chapter.label}
            </span>

            {/* Glowing Reticle Dot */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-2.5 h-2.5 bg-red-500 shadow-[0_0_12px_#ef4444]"
                    : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white group-hover:scale-125"
                }`}
              />
              {isActive && (
                <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50" />
              )}
            </div>
          </button>
        );
      })}

      {/* Numerical Progress Readout */}
      <div className="font-mono text-[10px] text-white/50 pt-2 border-t border-white/20 tracking-wider">
        {Math.round(currentProgress * 100).toString().padStart(2, "0")}%
      </div>
    </aside>
  );
}
