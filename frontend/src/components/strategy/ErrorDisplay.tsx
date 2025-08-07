import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-red-500/50"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-red-400">Generation Failed</h2>
      <p className="mt-2 text-slate-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );
};