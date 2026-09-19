"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollVideo from "@/components/ScrollVideo";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16M4 20L20 4"></path>
  </svg>
);

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h.01M15 12h.01M7.5 4.5A14.99 14.99 0 0 0 2.5 9s1 8.5 4.5 10.5c0 0 3-1.5 4.5-2.5h1c1.5 1 4.5 2.5 4.5 2.5 3.5-2 4.5-10.5 4.5-10.5a14.99 14.99 0 0 0-5-4.5"></path>
    <path d="M7 4.5l-1.5-1.5M17 4.5l1.5-1.5"></path>
  </svg>
);


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero scale down on scroll
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.8], { clamp: true });
  // Fade out much faster on scroll (vanishes immediately as you scroll down)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0], { clamp: true });
  // Also physically slide it up out of the way just to be 100% sure!
  const heroY = useTransform(scrollYProgress, [0, 0.12], ["0vh", "-100vh"], { clamp: true });

  // Section 1: Reveal (Right side text) with 3D feel
  const section1Y = useTransform(scrollYProgress, [0.08, 0.28, 0.38, 0.50], ["50%", "0%", "0%", "-30%"], { clamp: true });
  const section1Scale = useTransform(scrollYProgress, [0.08, 0.28, 0.38, 0.50], [0.85, 1, 1, 0.9], { clamp: true });
  const section1Opacity = useTransform(scrollYProgress, [0.08, 0.22, 0.36, 0.48], [0, 1, 1, 0], { clamp: true });
  
  // Section 2: Reveal (Left side text) with 3D feel
  const section2Y = useTransform(scrollYProgress, [0.42, 0.62, 0.72, 0.84], ["50%", "0%", "0%", "-30%"], { clamp: true });
  const section2Scale = useTransform(scrollYProgress, [0.42, 0.62, 0.72, 0.84], [0.85, 1, 1, 0.9], { clamp: true });
  const section2Opacity = useTransform(scrollYProgress, [0.42, 0.56, 0.70, 0.82], [0, 1, 1, 0], { clamp: true });

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] text-black bg-transparent">
      
      <ScrollVideo />

      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center pointer-events-none drop-shadow-md mix-blend-difference text-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-space-grotesk text-2xl font-bold tracking-tighter"
        >
          OMAR.ADEL
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-mono text-xs uppercase tracking-widest text-right"
        >
          Software<br/>Engineer
        </motion.div>
      </nav>

      {/* Hero Section - MIDDLE */}
      <motion.section 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none px-4"
        style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
      >
        <motion.h1 
          initial={{ y: 100, opacity: 0, filter: "blur(20px)", scale: 0.9 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-space-grotesk text-5xl sm:text-7xl md:text-[12rem] font-bold uppercase tracking-tighter text-center z-10 leading-[0.8] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]"
        >
          OMAR ADEL
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0, letterSpacing: "0em" }}
          animate={{ y: 0, opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-2xl md:text-4xl font-mono text-black/80 font-bold [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)] text-center"
        >
          FULL STACK ENGINEER
        </motion.p>
      </motion.section>

      {/* Sticky Split Section 1 - RIGHT SIDE */}
      <section className="absolute top-[100vh] w-full h-[100vh] pointer-events-none">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row">
          
          {/* Empty left side to show video */}
          <div className="hidden md:block w-full md:w-1/2 h-full"></div>

          {/* Text on right side */}
          <motion.div 
            className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-12 text-center md:text-right items-center md:items-end"
            style={{ y: section1Y, scale: section1Scale, opacity: section1Opacity }}
          >
            <h2 className="font-space-grotesk text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-[0.9] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
              ARCHITECTING <br/> THE FUTURE
            </h2>
            <p className="text-xl sm:text-2xl md:text-4xl text-black/90 font-bold max-w-lg leading-tight [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)]">
              Building scalable, high-performance web applications and immersive digital experiences.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Sticky Split Section 2 - LEFT SIDE */}
      <section className="absolute top-[200vh] w-full h-[100vh] pointer-events-none">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row">
          
          {/* Text on left side */}
          <motion.div 
            className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-12 text-center md:text-left items-center md:items-start"
            style={{ y: section2Y, scale: section2Scale, opacity: section2Opacity }}
          >
            <h2 className="font-space-grotesk text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-[0.9] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
              ENGINEERING <br/> EXCELLENCE
            </h2>
            <p className="text-xl sm:text-2xl md:text-4xl text-black/90 font-bold max-w-lg leading-tight [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)]">
              Crafting resilient distributed backends and reactive, modern interfaces built for global scale.
            </p>
          </motion.div>

          {/* Empty right side to show video */}
          <div className="hidden md:block w-full md:w-1/2 h-full"></div>

        </div>
      </section>

      {/* Final Section - FOOTER */}
      <section className="absolute bottom-0 w-full h-[30vh] pointer-events-none z-10">
        <div 
          className="w-full h-full bg-black flex flex-col items-center justify-center p-8 text-white"
        >
          <h2 className="font-space-grotesk text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
            INIT_CONTACT
          </h2>
          
          <a href="mailto:info@omar-adel.me" className="text-xl md:text-2xl font-mono text-white border-b-2 border-white pb-1 mb-6 hover:text-white/60 transition-colors pointer-events-auto">
            info@omar-adel.me
          </a>

          <div className="flex space-x-8 pointer-events-auto">
            <a href="#" className="text-white hover:text-white/60 transition-colors"><XIcon /></a>
            <a href="#" className="text-white hover:text-white/60 transition-colors"><GithubIcon /></a>
            <a href="#" className="text-white hover:text-white/60 transition-colors"><DiscordIcon /></a>
          </div>
        </div>
      </section>

    </div>
  );
}
