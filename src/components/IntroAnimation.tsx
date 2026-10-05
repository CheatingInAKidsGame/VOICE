import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2 } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Automatically transition after 3.2 seconds
    const timer = setTimeout(() => {
      handleFinish();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    setExiting(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle ambient soundwave pulses */}
          <div className="flex items-center gap-1.5 mb-8 h-10">
            {[40, 75, 55, 90, 60, 85, 45, 100, 65, 40].map((height, i) => (
              <motion.span
                key={i}
                initial={{ height: 6 }}
                animate={{
                  height: [8, height, 12, height * 0.7, 8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2 + (i % 4) * 0.2,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
                className="w-1 bg-amber-400/80 rounded-full"
              />
            ))}
          </div>

          {/* Main Title: VOICE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center space-y-3"
          >
            <h1 className="text-5xl sm:text-7xl font-black tracking-widest text-white">
              VOICE
            </h1>

            {/* Tagline Animation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg sm:text-2xl font-light text-slate-300 italic tracking-wide max-w-lg mx-auto"
            >
              “Speak freely. Be heard. Stay anonymous.”
            </motion.p>
          </motion.div>

          {/* Bottom subtle progress line */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
            <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-amber-400"
              />
            </div>

            <button
              onClick={handleFinish}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
