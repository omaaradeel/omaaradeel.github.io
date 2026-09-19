"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth progress simulation that guarantees 100% within ~1.8s
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          onFinish?.();
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#070707] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Top Bar Telemetry */}
          <div className="flex justify-between items-center font-mono text-[11px] text-neutral-400 tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-300 animate-pulse" />
              <span>SYS_INIT // 2026</span>
            </div>
            <div className="hidden sm:block text-neutral-500">
              ARCHITECTURE_FRAMEWORK: NEXT_16
            </div>
            <div>
              LOC: 30.0444° N, 31.2357° E
            </div>
          </div>

          {/* Centerpiece: Monogram & Counter */}
          <div className="flex flex-col items-center justify-center my-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-space-grotesk text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase text-white [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]">
                OMAR ADEL
              </h1>
              <p className="font-mono text-xs sm:text-sm text-neutral-400 tracking-[0.25em] uppercase mt-2">
                FULL STACK SOFTWARE ENGINEER
              </p>
            </motion.div>

            {/* Numerical Progress */}
            <div className="mt-10 sm:mt-12 flex flex-col items-center">
              <div className="font-mono text-5xl sm:text-7xl font-bold text-white tracking-tight">
                {progress.toString().padStart(2, "0")}
                <span className="text-xl sm:text-2xl text-neutral-400 ml-1">%</span>
              </div>

              {/* Minimal Progress Bar */}
              <div className="w-48 sm:w-64 h-[2px] bg-neutral-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-white shadow-[0_0_10px_#ffffff]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status String */}
              <div className="font-mono text-[10px] text-neutral-400 tracking-widest mt-4 uppercase">
                {progress < 40 && "INITIALIZING SYSTEM THREADS..."}
                {progress >= 40 && progress < 80 && "MOUNTING 3D VISUAL SHADERS..."}
                {progress >= 80 && progress < 100 && "SYNCHRONIZING TELEMETRY..."}
                {progress >= 100 && "SYSTEM OPERATIONAL // READY"}
              </div>
            </div>
          </div>

          {/* Bottom Bar Telemetry */}
          <div className="flex justify-between items-center font-mono text-[11px] text-neutral-400 tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="text-neutral-300">CORE_ENGINE: ONLINE</span>
            </div>
            <div className="text-neutral-400">
              © 2026 OMAR ADEL
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
