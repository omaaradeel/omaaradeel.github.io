"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionTemplate } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ScrollVideo() {
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const { isDark } = useTheme();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Prime both videos for instant smooth scrubbing
    [darkVideoRef.current, lightVideoRef.current].forEach((video) => {
      if (video) {
        video.play().then(() => {
          video.pause();
        }).catch(() => {});
      }
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Scrub both videos in perfect synchronization
    [darkVideoRef.current, lightVideoRef.current].forEach((video) => {
      if (video && video.readyState >= 1) {
        const duration = video.duration || 0;
        const targetTime = latest * duration;
        requestAnimationFrame(() => {
          if (video) video.currentTime = targetTime;
        });
      }
    });
  });

  const blurValue = useTransform(scrollYProgress, [0, 0.05], [8, 0], { clamp: true });
  const videoBlur = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <div
      className={`fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-black" : "bg-neutral-100"
      }`}
    >
      {/* Dark Version Video */}
      <motion.video
        ref={darkVideoRef}
        src="/Dark-Video.mp4"
        style={{ filter: videoBlur }}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover scale-[1.01] md:scale-[1.15]"
        muted
        playsInline
        autoPlay
        preload="auto"
      />

      {/* Light Version Video */}
      <motion.video
        ref={lightVideoRef}
        src="/omar-scroll-video.mp4"
        style={{ filter: videoBlur }}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover scale-[1.01] md:scale-[1.15]"
        muted
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
