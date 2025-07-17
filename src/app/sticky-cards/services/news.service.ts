import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewsCard } from '../models/NewsCard';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  
  // Mock news data - in a real app, you'd call an RSS feed or news API
  getNewsData(): Observable<NewsCard[]> {
    const mockNewsCards: NewsCard[] = [
      {
        id: 2001,
        title: 'Tech News',
        color: '#ff9800',
        type: 'news',
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        newsData: {
          headline: 'New AI Breakthrough in Language Models',
          summary: 'Researchers have developed a new approach to training language models that significantly improves performance while reducing computational requirements.',
          author: 'Sarah Johnson',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          source: 'Tech Daily',
          url: 'https://example.com/ai-breakthrough',
          imageUrl: 'https://via.placeholder.com/300x200/2196f3/ffffff?text=AI+News',
          category: 'Technology'
        }
      },
      {
        id: 2002,
        title: 'Science News',
        color: '#4caf50',
        type: 'news',
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        newsData: {
          headline: 'Climate Change Solutions Show Promise',
          summary: 'New research reveals innovative methods for carbon capture that could help address global warming challenges.',
          author: 'Dr. Michael Chen',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          source: 'Science Today',
          url: 'https://example.com/climate-solutions',
          imageUrl: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Climate+News',
          category: 'Environment'
        }
      },
      {
        id: 2003,
        title: 'Business News',
        color: '#9c27b0',
        type: 'news',
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        newsData: {
          headline: 'Market Reaches New Heights',
          summary: 'Stock markets around the world are experiencing significant growth as investors respond positively to economic indicators.',
          author: 'Lisa Wang',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          source: 'Financial Times',
          url: 'https://example.com/market-news',
          category: 'Business'
        }
      }
    ];

    return of(mockNewsCards);
  }
}
