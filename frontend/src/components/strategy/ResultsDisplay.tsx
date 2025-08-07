import type { StrategyResponse, CalendarDay } from '../../types';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import {
  LightBulbIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const ResultCard: React.FC<{
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon: Icon, title, children, className = '' }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block bg-slate-700 text-slate-300 text-xs font-medium mr-2 mb-2 px-3 py-1.5 rounded-full">
    {children}
  </span>
);

export const ResultsDisplay: React.FC<{ data: StrategyResponse; onReset: () => void }> = ({
  data,
  onReset,
}) => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Your AI-Generated Strategy</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          New Strategy
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ResultCard icon={LightBulbIcon} title="Key Insights">
            <div className="space-y-4 text-slate-300">
              <div>
                <h4 className="font-semibold text-slate-200">Identified Trends:</h4>
                <div className="mt-2">
                  {data.key_insights.identified_trends.map((t, i) => <Pill key={i}>{t.trend} ({t.platform})</Pill>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Top Performing Formats:</h4>
                <div className="mt-2">
                  {data.key_insights.top_performing_formats.map((f, i) => <Pill key={i}>{f}</Pill>)}
                </div>
              </div>
            </div>
          </ResultCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ResultCard icon={UserGroupIcon} title="Competitor Snapshot">
            <div className="space-y-4">
              {data.competitor_snapshot.map((c, i) => (
                <div key={i} className="text-slate-300">
                  <h4 className="font-semibold text-slate-200 capitalize">{c.name}</h4>
                  <p className="text-sm">Themes: {c.key_themes.join(', ')}</p>
                </div>
              ))}
            </div>
          </ResultCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-5">
          <ResultCard icon={CalendarDaysIcon} title="30-Day Content Calendar">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2 mt-4">
              {data.content_calendar.map((day) => (
                <motion.div
                  key={day.day}
                  className="h-24 flex flex-col justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-700 cursor-pointer hover:bg-purple-900/50 hover:border-purple-600 transition-all text-left"
                  onClick={() => setSelectedDay(day)}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  <span className="font-bold text-white">{day.day}</span>
                  <p className="text-xs text-slate-400 line-clamp-2">{day.theme_of_day}</p>
                </motion.div>
              ))}
            </div>
          </ResultCard>
        </motion.div>
      </div>

      {/* Day Detail Modal */}
      <Dialog open={!!selectedDay} onClose={() => setSelectedDay(null)} className="relative z-50">
        <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel as={motion.div} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-2xl">
            <Dialog.Title className="text-2xl font-bold text-white flex justify-between items-center">
              <span>Day {selectedDay?.day}: {selectedDay?.theme_of_day}</span>
              <button onClick={() => setSelectedDay(null)}><XMarkIcon className="w-6 h-6 text-slate-400 hover:text-white"/></button>
            </Dialog.Title>
            
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
              {selectedDay?.post_suggestions.map((post, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-purple-400 capitalize">{post.platform} - {post.format}</h4>
                  <p className="mt-2 text-white"><span className="font-semibold text-slate-400">Title:</span> {post.title_suggestion}</p>
                  <p className="mt-1 text-white"><span className="font-semibold text-slate-400">Hook:</span> {post.hook}</p>
                  <p className="mt-1 text-white"><span className="font-semibold text-slate-400">CTA:</span> {post.cta}</p>
                </div>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};