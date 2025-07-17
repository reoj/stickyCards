import { BaseCard } from './BaseCard';

export interface NewsCard extends BaseCard {
  type: 'news';
  newsData: {
    headline: string;
    summary: string;
    author?: string;
    publishedAt: Date;
    source: string;
    url: string;
    imageUrl?: string;
    category?: string;
  };
}
