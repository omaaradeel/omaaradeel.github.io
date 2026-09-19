"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Project {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  metrics: string;
  link: string;
  github: string;
}

const PROJECTS: Project[] = [
  {
    id: "01",
    tag: "DISTRIBUTED // REAL-TIME",
    title: "NEURA_STREAM",
    subtitle: "High-Throughput Ingestion Engine",
    description: "Sub-millisecond event streaming infrastructure processing high-concurrency data pipelines with reactive telemetry dashboards.",
    stack: ["Next.js 16", "TypeScript", "Kafka", "Go"],
    metrics: "2.1M ops/sec",
    link: "https://github.com/omaaradeel",
    github: "https://github.com/omaaradeel",
  },
  {
    id: "02",
    tag: "GRAPHICS // WEBGL",
    title: "AETHER_SPATIAL",
    subtitle: "3D Audio-Visual Canvas",
    description: "Immersive browser-based spatial environment with reactive particle shaders, WebAudio synthesis, and physics simulation.",
    stack: ["Three.js", "React 19", "GLSL", "Tailwind"],
    metrics: "60 FPS Locked",
    link: "https://github.com/omaaradeel",
    github: "https://github.com/omaaradeel",
  },
  {
    id: "03",
    tag: "CLOUD // ORCHESTRATION",
    title: "SYNTH_OS",
    subtitle: "Autonomous Cloud Control Plane",
    description: "Developer workspace bridging container orchestration, intelligent agents, and cryptographic distributed state management.",
    stack: ["Rust", "Docker", "GraphQL", "PostgreSQL"],
    metrics: "Zero-Trust",
    link: "https://github.com/omaaradeel",
    github: "https://github.com/omaaradeel",
  },
];

function TiltCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      data-interactive="true"
      className="relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 hover:border-red-500/50 shadow-2xl transition-colors duration-300 text-left overflow-hidden group min-h-[360px]"
    >
      {/* Dynamic Cursor Spotlight Glare */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${smoothMouseX.get() * 100}% ${smoothMouseY.get() * 100}%, rgba(6, 182, 212, 0.18), transparent 70%)`,
          }}
        />
      )}

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-xs tracking-widest text-red-400 font-semibold">
            {project.tag}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-red-500/10 text-red-300 border border-red-500/20">
            {project.metrics}
          </span>
        </div>

        <h3 className="font-space-grotesk text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight group-hover:text-red-300 transition-colors">
          {project.title}
        </h3>
        <p className="font-mono text-xs text-white/60 mb-3 tracking-wide">
          {project.subtitle}
        </p>
        <p className="text-sm text-white/80 leading-relaxed font-sans">
          {project.description}
        </p>
      </div>

      {/* Card Footer: Tech Tags & Action */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-white/70 border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors pointer-events-auto"
          >
            <span>VIEW REPOSITORY</span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <span className="font-mono text-[10px] text-white/40">#{project.id}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectCards() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-auto perspective-1000">
      <div className="text-center mb-8 sm:mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-white/70 mb-2 block">
          /// SELECTED WORKS & ARCHITECTURE
        </span>
        <h2 className="font-space-grotesk text-4xl sm:text-6xl font-bold tracking-tight text-white [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
          FEATURED PROJECTS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <TiltCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
