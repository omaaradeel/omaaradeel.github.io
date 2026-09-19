"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      data-interactive="true"
      aria-label={isDark ? "Switch to Light Version" : "Switch to Dark Version"}
      className={`group relative p-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
        isDark
          ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-red-500 text-white hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          : "bg-black/5 hover:bg-black/10 border-black/20 hover:border-red-500 text-black hover:text-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          // Sun Icon (Shown in dark mode to switch to light version)
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-amber-300 group-hover:text-red-400 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </motion.div>
        ) : (
          // Moon Icon (Shown in light mode to switch to dark version)
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-red-600 group-hover:text-red-500 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Micro-Tooltip */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border ${
          isDark
            ? "bg-black/95 text-white border-white/10"
            : "bg-white text-black border-black/10"
        }`}
      >
        {isDark ? "LIGHT VERSION" : "DARK VERSION"}
      </div>
    </button>
  );
}
