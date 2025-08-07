// frontend/src/api/trendService.ts (Corrected Version)

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// These interfaces need to be exported so other files can use them.
export interface TrendDiscoveryRequest {
  topic: string;
  target_audience_description?: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: string;
}

// THE 'export' KEYWORD IS CRITICAL HERE
export interface GoogleTrendPoint {
  date: string;
  value: number;
}

// AND HERE
export interface GoogleTrendRisingQuery {
  query: string;
  value: number;
}

// AND HERE
export interface GoogleTrendData {
  interest_over_time: GoogleTrendPoint[];
  rising_queries: GoogleTrendRisingQuery[];
}

// AND HERE
export interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  upvotes: number;
}

// AND HERE
export interface RedditData {
  top_threads: RedditPost[];
}

// AND HERE
export interface TrendResults {
  google_trends?: GoogleTrendData;
  reddit?: RedditData;
  twitter?: any;
  youtube?: any;
}

// AND HERE
export interface TrendResultResponse {
  job_id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  results?: TrendResults;
}


// These functions are already correctly exported.
export const startTrendDiscovery = async (data: TrendDiscoveryRequest): Promise<JobStatusResponse> => {
  const response = await apiClient.post('/trends/discover', data);
  return response.data;
};

export const getTrendResults = async (jobId: string): Promise<TrendResultResponse> => {
  const response = await apiClient.get(`/trends/results/${jobId}`);
  return response.data;
};