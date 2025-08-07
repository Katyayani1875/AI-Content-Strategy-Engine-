import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const analysisSteps = [
  "Connecting to data streams...",
  "Analyzing competitor patterns...",
  "Identifying emerging trends...",
  "Deconstructing top content...",
  "Synthesizing insights...",
  "Building your strategic calendar...",
];

export const AnalysisAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <motion.div
        className="w-16 h-16"
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
        }}
      />
      <h2 className="mt-6 text-xl font-semibold text-white">Generating Your Strategy</h2>
      <p className="mt-2 text-slate-400">The AI is analyzing millions of data points...</p>
      <div className="mt-4 text-sm text-purple-400 h-6">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {analysisSteps[currentStep]}
        </motion.p>
      </div>
    </div>
  );
};