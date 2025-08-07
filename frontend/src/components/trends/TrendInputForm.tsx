import React, { useState } from 'react';

interface Props {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export const TrendInputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
        placeholder="e.g., 'skincare for Gen Z'"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Discover Trends'}
      </button>
    </form>
  );
};