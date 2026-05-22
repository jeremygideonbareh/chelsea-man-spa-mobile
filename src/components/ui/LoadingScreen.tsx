import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress simulation over 1.6 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment progress by randomized amounts for organic feel
        const diff = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + diff, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], // Custom cubic-bezier for luxury feel
      },
    },
  };

  const word = "CHELSEA";
  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.215, 0.610, 0.355, 1.000],
      },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      exit="exit"
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating dust particles or gold sparks */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-[#D4AF37] rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-[60%] right-[15%] w-1 h-1 bg-[#B8960F] rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-[#E5C76B] rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative flex flex-col items-center select-none z-10">
        {/* Monogram emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8 relative w-20 h-20 flex items-center justify-center border border-[#D4AF37]/20 rounded-full"
        >
          <div className="absolute inset-[4px] border border-[#D4AF37]/10 rounded-full" />
          {/* Animated SVG drawing of C */}
          <svg className="w-10 h-10 text-[#D4AF37]" viewBox="0 0 100 100">
            <motion.path
              d="M 65 30 C 55 15, 30 15, 30 50 C 30 85, 55 85, 65 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          {/* Small orbital glow dot */}
          <div className="absolute w-1 h-1 bg-[#D4AF37] rounded-full top-[10px] left-[10px] animate-ping" />
        </motion.div>

        {/* Title */}
        <div className="flex overflow-hidden mb-3">
          {word.split("").map((letter, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="font-cinzel text-3xl sm:text-4xl font-semibold tracking-[0.25em] text-white"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 0.6, letterSpacing: '0.45em' }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="text-[#A3A3A3] text-[9px] uppercase tracking-[0.45em] mb-12 mr-[-0.45em]"
        >
          Gentlemen's Spa
        </motion.p>

        {/* Loader bar and Wave */}
        <div className="w-48 sm:w-56 h-[3px] bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-gradient-to-r from-[#B8960F] via-[#D4AF37] to-[#E5C76B] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          />
        </div>

        {/* Loading percentage */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-white text-[10px] font-mono tracking-widest mt-3"
        >
          {progress}%
        </motion.span>
      </div>
    </motion.div>
  );
}
