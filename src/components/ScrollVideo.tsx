"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // iOS Safari requires video to play before it will allow scrubbing smoothly
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        videoRef.current?.pause();
      }).catch(() => {
        // Autoplay may be prevented initially, that's fine
      });
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && videoRef.current.readyState >= 1) {
      // Map scroll progress (0 to 1) to video duration
      const duration = videoRef.current.duration || 0;
      const targetTime = latest * duration;
      
      // We use requestAnimationFrame to prevent choppy playback
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = targetTime;
        }
      });
    }
  });

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/omar-scroll-video.mp4"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover scale-[1.15]"
        muted
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
