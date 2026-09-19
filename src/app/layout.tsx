import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '600', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'Omar Adel | Cyberpunk Portfolio',
  description: 'Software Engineer specializing in Next-Gen Architectures',
};

import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans bg-[#030712] text-slate-100 antialiased overflow-x-hidden selection:bg-cyan-500/30`}
      >
        <SmoothScrollProvider>
          <main className="relative z-10 flex min-h-screen flex-col items-center">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
