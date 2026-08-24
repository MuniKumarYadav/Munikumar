'use client';

import { motion } from 'framer-motion';

const updates = [
  'AI × Digital Marketing Research',
  'Data-driven campaign systems',
  '100 original marketing guides',
  'Deep learning for marketers',
  'Portfolio + experience library',
  'Interview questions & answers',
];

export function Marquee() {
  return (
    <div className="marquee" aria-label="Latest updates">
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...updates, ...updates].map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            <span className="marquee-dot" aria-hidden="true" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
