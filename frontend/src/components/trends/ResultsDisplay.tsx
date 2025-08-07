import React from 'react';
import type { TrendResultResponse } from '../../api/trendService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TrendChart } from './TrendChart'; // Assumes you have this component

interface Props {
  isLoading: boolean;
  error: string | null;
  data: TrendResultResponse | null;
  topic: string; // Added for chart and context
}

export const ResultsDisplay: React.FC<Props> = ({ isLoading, error, data, topic }) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-600">Analyzing trends... This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
  }

  if (!data || data.status !== 'COMPLETED') {
    return (
      <div className="text-center p-8 text-gray-500">
        Your results will appear here once analysis is complete.
      </div>
    );
  }

  const { google_trends, reddit } = data.results || {};

  return (
    <div className="space-y-8">
      {/* Google Trends Section */}
      {google_trends && google_trends.interest_over_time.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <TrendChart data={google_trends.interest_over_time} topic={topic} />
          <h3 className="text-xl font-bold mt-6 mb-2">Rising Queries</h3>
          <ul className="list-disc list-inside text-gray-700">
            {google_trends.rising_queries.map(q => (
              <li key={q.query}>
                {q.query}{' '}
                <span className="text-sm text-green-600">(+{q.value}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reddit Section */}
      {reddit && reddit.top_threads.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-2">Top Reddit Mentions</h3>
          <div className="space-y-3">
            {reddit.top_threads.map(post => (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                key={post.url}
                className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <p className="font-semibold text-blue-700">{post.title}</p>
                <p className="text-sm text-gray-500">r/{post.subreddit} • {post.upvotes} upvotes</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
