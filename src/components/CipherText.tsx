"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

interface CipherTextProps {
  text: string;
  className?: string;
  speed?: number;
  revealSpeed?: number;
  delay?: number;
}

const GLYPHS = "01!@#$%^&*<>~+=Δ✦_XYZ01";

export default function CipherText({
  text,
  className = "",
  speed = 40,
  revealSpeed = 0.28,
  delay = 100,
}: CipherTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [display, setDisplay] = useState(text);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredOnView = useRef(false);

  const scramble = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const totalIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= totalIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isScramblingRef.current = false;
        setDisplay(text);
      }

      iteration += revealSpeed;
    }, speed);
  }, [text, speed, revealSpeed]);

  // Automatically trigger once when scrolled into view without needing hover
  useEffect(() => {
    if (isInView && !hasTriggeredOnView.current) {
      hasTriggeredOnView.current = true;
      const timer = setTimeout(() => {
        scramble();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, scramble]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      ref={ref}
      onMouseEnter={scramble}
      data-interactive="true"
      className={`inline-block cursor-default select-none transition-colors duration-150 ${className}`}
    >
      {display}
    </span>
  );
}
