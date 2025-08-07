import React, { useState, useEffect, useRef } from 'react';
import { TrendInputForm } from '../components/trends/TrendInputForm';
import { ResultsDisplay } from '../components/trends/ResultsDisplay';
import { startTrendDiscovery, getTrendResults, type TrendResultResponse } from '../api/trendService';

export const TrendDiscoveryPage: React.FC = () => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [results, setResults] = useState<TrendResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [submittedTopic, setSubmittedTopic] = useState<string>(''); // Track last submitted topic
  const pollingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (jobId) {
      pollingIntervalRef.current = window.setInterval(async () => {
        try {
          const data = await getTrendResults(jobId);
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            setIsLoading(false);
            setResults(data);
          }
        } catch (err) {
          setError('Failed to fetch results.');
          setIsLoading(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        }
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [jobId]);

  const handleSubmit = async (topic: string) => {
    setSubmittedTopic(topic); // Store the topic being analyzed
    setIsLoading(true);
    setResults(null);
    setError(null);
    setJobId(null);
    try {
      const { job_id } = await startTrendDiscovery({ topic });
      setJobId(job_id);
    } catch (err) {
      setError('Failed to start the discovery job.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Content Strategy Engine</h1>
      <p className="mb-8 text-gray-600">Enter a topic to discover cross-platform trends.</p>
      <TrendInputForm onSubmit={handleSubmit} isLoading={isLoading} />
      <div className="mt-12">
        {/* Pass the topic to ResultsDisplay */}
        <ResultsDisplay
          isLoading={isLoading}
          error={error}
          data={results}
          topic={submittedTopic}
        />
      </div>
    </div>
  );
};
