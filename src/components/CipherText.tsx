"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface CipherTextProps {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
}

const GLYPHS = "01!@#$%^&*<>~+=Δ✦_XYZ01";

export default function CipherText({
  text,
  className = "",
  triggerOnMount = true,
}: CipherTextProps) {
  const [display, setDisplay] = useState(text);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

      iteration += 1 / 2;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (triggerOnMount) {
      scramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerOnMount, scramble]);

  return (
    <span
      onMouseEnter={scramble}
      data-interactive="true"
      className={`inline-block cursor-default select-none transition-colors duration-150 ${className}`}
    >
      {display}
    </span>
  );
}
