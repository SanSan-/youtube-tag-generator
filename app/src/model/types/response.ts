import { DefaultNumberState } from '~types/state';

export interface AnyResponse {
  [key: string]: string | unknown;

  responseStatus?: string;
  responseId?: string;
  responseTitle?: string;
  responseMessage?: string;
}

type QuerySharesObj = { [key: string]: number };

export interface KeywordStatistic {
  competition: number;
  volume: number;
  overall: number;
  estimated_monthly_search: number;
}

export interface KeywordItem extends KeywordStatistic {
  keyword: string;
  related_score: number;
  updated_at: string;
  query_shares: QuerySharesObj;
  wc_bonus?: number;
}

export interface CountItem extends DefaultNumberState {
  min: number;
  max: number;
  mean: number;
}

export type CompvolObj = { [key: string]: KeywordStatistic };

export interface SearchStats {
  views_count: CountItem;
  likes_count: CountItem;
  dislikes_count: CountItem;
  comments_count: CountItem;
  hd_count: number;
  cc_count: number;
  three_d_count: number;
  videos_found: number;
  seven_days_count: number;
  age: CountItem;
  compvol: CompvolObj;
}

export interface VidIqHotterSearchResponse {
  keywords: KeywordItem[];
  search_stats: SearchStats;
  omitted: number;
}
