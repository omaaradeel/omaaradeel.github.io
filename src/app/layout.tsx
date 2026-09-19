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
  metadataBase: new URL('https://omar-adel.me'),
  title: 'Omar Adel — Software Engineer',
  description:
    'Full Stack Software Engineer specializing in high-performance web applications, distributed systems, and next-generation digital architectures.',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/icon.png' }],
    shortcut: ['/icon.png'],
  },
  openGraph: {
    title: 'Omar Adel — Software Engineer',
    description:
      'Full Stack Software Engineer specializing in high-performance web applications, distributed systems, and next-generation digital architectures.',
    url: 'https://omar-adel.me',
    siteName: 'Omar Adel',
    images: [
      {
        url: '/me-art.png',
        width: 1140,
        height: 1775,
        alt: 'Omar Adel - Full Stack Software Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Adel — Software Engineer',
    description:
      'Full Stack Software Engineer specializing in high-performance web applications, distributed systems, and next-generation digital architectures.',
    images: ['/me-art.png'],
  },
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
