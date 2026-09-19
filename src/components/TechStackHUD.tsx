"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface TechItem {
  name: string;
  category: string;
  level: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "Next.js 16", category: "Framework", level: "Core" },
  { name: "TypeScript", category: "Language", level: "Primary" },
  { name: "React 19", category: "Library", level: "Core" },
  { name: "Node.js", category: "Backend", level: "Expert" },
  { name: "Go / Rust", category: "Systems", level: "High-Perf" },
  { name: "Tailwind v4", category: "Styling", level: "Modern" },
  { name: "PostgreSQL", category: "Database", level: "Relational" },
  { name: "Docker", category: "DevOps", level: "Containers" },
  { name: "GraphQL & REST", category: "API", level: "Architecture" },
  { name: "System Design", category: "Architecture", level: "Scalability" },
];

export default function TechStackHUD() {
  const { isDark } = useTheme();

  return (
    <div className="mt-8 w-full max-w-xl pointer-events-auto">
      <div
        className={`flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${
          isDark ? "text-white/70" : "text-black/70"
        }`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span>/// CORE_STACK & TECHNOLOGIES</span>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {TECH_ITEMS.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -3, scale: 1.04 }}
            data-interactive="true"
            className={`group relative px-3 py-1.5 rounded-lg backdrop-blur-xl border transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] ${
              isDark
                ? "bg-white/5 hover:bg-white/10 border-white/15 hover:border-red-500"
                : "bg-black/5 hover:bg-black/10 border-black/15 hover:border-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full group-hover:bg-red-500 group-hover:shadow-[0_0_8px_#ef4444] transition-colors ${
                  isDark ? "bg-white/40" : "bg-black/40"
                }`}
              />
              <span
                className={`font-space-grotesk text-xs sm:text-sm font-bold tracking-tight group-hover:text-red-400 transition-colors ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {item.name}
              </span>
            </div>

            {/* Micro Category Pill */}
            <div
              className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border ${
                isDark
                  ? "bg-black/95 text-white border-white/15"
                  : "bg-white text-black border-black/15 shadow-black/20"
              }`}
            >
              {item.category} // {item.level}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
