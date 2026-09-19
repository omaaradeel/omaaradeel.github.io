"use client";

import { motion } from "framer-motion";

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
  return (
    <div className="mt-8 w-full max-w-xl pointer-events-auto">
      <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-widest text-black/70">
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
            className="group relative px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 backdrop-blur-md border border-black/20 hover:border-red-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_16px_rgba(239,68,68,0.35)]"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 group-hover:bg-red-500 group-hover:shadow-[0_0_6px_#ef4444] transition-colors" />
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black tracking-tight group-hover:text-red-600 transition-colors">
                {item.name}
              </span>
            </div>

            {/* Micro Category Pill */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
              {item.category} // {item.level}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
