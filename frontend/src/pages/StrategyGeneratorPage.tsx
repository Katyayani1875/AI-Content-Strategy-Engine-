import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import type { StrategyResponse } from '../types';
import axios from 'axios'; // <-- ADD THIS IMPORT

// Import our new, beautifully designed components
import { StrategyForm } from '../components/strategy/StrategyForm';
import { AnalysisAnimation } from '../components/strategy/AnalysisAnimation';
import { ResultsDisplay } from '../components/strategy/ResultsDisplay';
import { ErrorDisplay } from '../components/strategy/ErrorDisplay';

const StrategyGeneratorPage: React.FC = () => {
  const [strategyData, setStrategyData] = useState<StrategyResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setStrategyData(null);

    const topic = prompt.match(/for (a|an|the) (.*?) brand/i)?.[2] || 'general content';
    const audience = prompt.match(/targeting (.*?)( for| with)/i)?.[1] || 'a general audience';

    const payload = {
      user_id: 'user-premium-123',
      topic: topic,
      target_audience: audience,
      focus: ['engagement', 'user-generated content (UGC)', 'brand awareness'],
      competitors: ['glossier', 'theordinary', 'curology'],
      platforms: ['twitter', 'youtube', 'tiktok', 'instagram'],
    };

    // --- THIS BLOCK IS THE FIX ---
    try {
      const res = await apiClient.post<StrategyResponse>('/strategy/generate', payload);
      setStrategyData(res.data);
    } catch (err: unknown) { // Use 'unknown' instead of 'any'
      if (axios.isAxiosError(err) && err.response) {
        // Handle errors from the backend API
        setError(err.response.data?.detail || 'An unexpected server error occurred.');
      } else if (err instanceof Error) {
        // Handle generic JavaScript errors (e.g., network issues)
        setError(err.message);
      } else {
        // Handle any other unexpected case
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
    // --- END OF FIX ---
  };

  const handleReset = () => {
    setStrategyData(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <AnalysisAnimation />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleReset} />;
    }
    if (strategyData) {
      return <ResultsDisplay data={strategyData} onReset={handleReset} />;
    }
    return <StrategyForm onSubmit={handleSubmit} isLoading={isLoading} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-tl from-indigo-600/20 to-purple-600/20 rounded-full filter blur-3xl opacity-40 animate-pulse [animation-delay:2s]"></div>
      <div className="z-10 w-full transition-all duration-500">
        {renderContent()}
      </div>
    </div>
  );
};

export default StrategyGeneratorPage;