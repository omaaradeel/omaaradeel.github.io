"use client";

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {/* @ts-expect-error React 19 type mismatch */}
      {children}
    </ReactLenis>
  );
}
