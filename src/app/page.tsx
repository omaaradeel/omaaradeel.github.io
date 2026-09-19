"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollVideo from "@/components/ScrollVideo";
import CustomCursor from "@/components/CustomCursor";
import CipherText from "@/components/CipherText";
import TechStackHUD from "@/components/TechStackHUD";
import FloatingInfo from "@/components/FloatingInfo";
import ScrollProgressHUD from "@/components/ScrollProgressHUD";
import ContactSection from "@/components/ContactSection";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero scale down on scroll (slowed down and smoothed)
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85], { clamp: true });
  // Fade out much slower on scroll so the name lingers gracefully
  const heroOpacity = useTransform(scrollYProgress, [0.04, 0.18], [1, 0], { clamp: true });
  // Gently glide up out of view
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0vh", "-40vh"], { clamp: true });

  // Section 1: Reveal (Right side text - ARCHITECTURE)
  const section1Y = useTransform(scrollYProgress, [0.08, 0.2, 0.3, 0.4], ["40%", "0%", "0%", "-30%"], { clamp: true });
  const section1Scale = useTransform(scrollYProgress, [0.08, 0.2, 0.3, 0.4], [0.88, 1, 1, 0.92], { clamp: true });
  const section1Opacity = useTransform(scrollYProgress, [0.08, 0.18, 0.28, 0.38], [0, 1, 1, 0], { clamp: true });

  // Section 2: Reveal (Left side text - ENGINEERING & TECH STACK)
  const section2Y = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.62], ["40%", "0%", "0%", "-30%"], { clamp: true });
  const section2Scale = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.62], [0.88, 1, 1, 0.92], { clamp: true });
  const section2Opacity = useTransform(scrollYProgress, [0.32, 0.4, 0.5, 0.6], [0, 1, 1, 0], { clamp: true });

  return (
    <div ref={containerRef} className="relative w-full h-[520vh] text-black bg-transparent">
      {/* Dark Splash Loading Screen (Zero Blue Colors) */}
      <SplashScreen />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Vertical Scrollytelling Progress HUD */}
      <ScrollProgressHUD />

      {/* Fixed Background Video Scrubber */}
      <ScrollVideo />

      {/* Fixed Header Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 sm:p-8 flex justify-between items-center pointer-events-none drop-shadow-md mix-blend-difference text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-space-grotesk text-xl sm:text-2xl font-bold tracking-tighter pointer-events-auto"
        >
          <CipherText text="OMAR.ADEL" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-mono text-xs uppercase tracking-widest text-right pointer-events-auto"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Software<br />Engineer
          </motion.div>
        </motion.div>
      </nav>

      {/* Chapter 01: Hero Section - MIDDLE */}
      <motion.section
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none px-4"
        style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
      >
        <motion.h1
          initial={{ y: 80, opacity: 0, filter: "blur(16px)", scale: 0.92 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-space-grotesk text-5xl sm:text-7xl md:text-[12rem] font-bold uppercase tracking-tighter text-center z-10 leading-[0.8] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]"
        >
          <CipherText text="OMAR ADEL" speed={55} revealSpeed={0.16} />
        </motion.h1>
        <motion.p
          initial={{ y: 25, opacity: 0, letterSpacing: "0em" }}
          animate={{ y: 0, opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 2.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-2xl md:text-4xl font-mono text-black/80 font-bold [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)] text-center"
        >
          FULL STACK ENGINEER
        </motion.p>
      </motion.section>

      {/* Chapter 02: Sticky Split Section 1 - RIGHT SIDE (ARCHITECTURE) */}
      <section className="absolute top-[100vh] w-full h-[100vh] pointer-events-none">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row">
          {/* Empty left side to show classical video bust */}
          <div className="hidden md:block w-full md:w-1/2 h-full"></div>

          {/* Text on right side */}
          <motion.div
            className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-14 text-center md:text-right items-center md:items-end"
            style={{ y: section1Y, scale: section1Scale, opacity: section1Opacity }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-black/70 mb-3 block">
              /// 02 — ARCHITECTURE & VISION
            </span>
            <h2 className="font-space-grotesk text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-[0.9] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
              <CipherText text="ARCHITECTING" /> <br /> <CipherText text="THE FUTURE" />
            </h2>
            <p className="text-xl sm:text-2xl md:text-4xl text-black/90 font-bold max-w-lg leading-tight [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)]">
              Building scalable, high-performance web applications and immersive digital experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter 03: Sticky Split Section 2 - LEFT SIDE (ENGINEERING & TECH STACK) */}
      <section className="absolute top-[200vh] w-full h-[110vh] pointer-events-none">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row">
          {/* Text & Tech Stack on left side */}
          <motion.div
            className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-14 text-center md:text-left items-center md:items-start"
            style={{ y: section2Y, scale: section2Scale, opacity: section2Opacity }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-black/70 mb-3 block">
              /// 03 — ENGINEERING & SYSTEMS
            </span>
            <h2 className="font-space-grotesk text-4xl sm:text-6xl md:text-8xl font-bold mb-4 leading-[0.9] text-black [text-shadow:_0_20px_50px_rgb(0_0_0_/_30%)]">
              <CipherText text="ENGINEERING" /> <br /> <CipherText text="EXCELLENCE" />
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-black/90 font-bold max-w-lg leading-tight [text-shadow:_0_10px_20px_rgb(0_0_0_/_20%)]">
              Crafting resilient distributed backends and reactive, modern interfaces built for global scale.
            </p>

            {/* Interactive Floating Tech Stack Badges */}
            <TechStackHUD />
          </motion.div>

          {/* Empty right side to show cyber wireframe avatar */}
          <div className="hidden md:block w-full md:w-1/2 h-full"></div>
        </div>
      </section>

      {/* Chapter 04: Spatial Floating Telemetry - 10+ Years & 100+ Projects */}
      <section className="absolute top-[300vh] w-full h-[140vh] pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <FloatingInfo scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* Chapter 05: Final Section - CONTACT & TERMINAL FOOTER */}
      <section className="absolute bottom-0 w-full pointer-events-none z-10">
        <ContactSection />
      </section>
    </div>
  );
}
