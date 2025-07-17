import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { NewsCard } from "../models/NewsCard";

@Injectable({
  providedIn: "root",
})
export class NewsService {
  // Mock news data - in a real app, you'd call an RSS feed or news API
  getNewsData(): Observable<NewsCard[]> {
    const mockNewsCards: NewsCard[] = [
      {
        id: 2001,
        title: "No News Service Detected",
        color: "#ff9800",
        type: "news",
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        newsData: {
          headline: "No News service Detected",
          summary: "No News service Detected",
          author: "REOJ",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          source: "Github",
          url: "https://github.com/reoj/",
        },
      },
    ];
    return of(mockNewsCards);
  }

  
}
