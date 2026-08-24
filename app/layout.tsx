import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muni Kumar — Digital Marketing, AI & Data-Driven Growth',
  description: 'A research-led digital marketing portfolio covering AI marketing, deep learning, analytics, campaigns, interviews and practical growth systems.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'),
  openGraph: {
    title: 'Muni Kumar — Digital Marketing + AI',
    description: 'Digital marketing strategy, AI, ML, research and case studies.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
