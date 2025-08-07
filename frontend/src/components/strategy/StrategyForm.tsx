import { SparklesIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface StrategyFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;
    onSubmit(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
          Content Strategy Engine
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Transform a single prompt into a complete, data-driven 30-day content plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-2xl shadow-black/20">
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Describe Your Content Goal
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            placeholder="e.g., Targeting Gen Z for a new sustainable skincare brand. Focus on engagement and building an authentic community."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <SparklesIcon className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180" />
          Generate Strategy
        </button>
      </form>
    </motion.div>
  );
};