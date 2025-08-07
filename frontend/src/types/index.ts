// This file defines the shape of our API response, giving us type safety.

export interface Trend {
  trend: string;
  platform: string;
  volume: string;
}

export interface KeyInsights {
  identified_trends: Trend[];
  best_time_to_post: Record<string, string>;
  top_performing_formats: string[];
  hook_styles: string[];
}

export interface CompetitorSnapshot {
  name: string;
  key_themes: string[];
  posting_frequency: string;
}

export interface PostSuggestion {
  platform: string;
  title_suggestion: string;
  format: string;
  hook: string;
  cta: string;
}

export interface CalendarDay {
  day: number;
  theme_of_day: string;
  post_suggestions: PostSuggestion[];
}

export interface StrategyResponse {
  strategy_id: string;
  createdAt: string;
  request_summary: any;
  key_insights: KeyInsights;
  competitor_snapshot: CompetitorSnapshot[];
  content_calendar: CalendarDay[];
}