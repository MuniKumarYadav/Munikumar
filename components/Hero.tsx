'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const stats = [
  ['01', 'AI marketing'],
  ['02', 'Growth analytics'],
  ['03', '100+ guides'],
];

export function Hero() {
  return (
    <section className="hero shell">
      <div className="hero-copy">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
          MUNI KUMAR / DIGITAL MARKETING + AI
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Marketing that <span>thinks</span> in data.
        </motion.h1>
        <p className="hero-lede">
          A research-led digital marketing portfolio covering AI marketing, analytics, SEO, growth systems, experiments and practical learning.
        </p>
        <div className="hero-actions">
          <Link href="#work" className="button button-primary">Explore the work</Link>
          <Link href="#research" className="button button-ghost">Read the research</Link>
        </div>
        <div className="stat-row">
          {stats.map(([number, label]) => (
            <div key={number} className="stat-card">
              <span>{number}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="hero-orbit"
        initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      >
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit-core">MK<span>AI</span></div>
        <div className="orbital-label label-one">DATA</div>
        <div className="orbital-label label-two">CONTENT</div>
        <div className="orbital-label label-three">GROWTH</div>
      </motion.div>
    </section>
  );
}
