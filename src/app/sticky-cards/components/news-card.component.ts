import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewsCard } from '../models/NewsCard';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="news-card" [style.background-color]="card.color">
      <mat-card-header>
        <mat-card-title>{{ card.title }}</mat-card-title>
        <mat-card-subtitle>{{ card.newsData.source }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="news-image" *ngIf="card.newsData.imageUrl">
          <img [src]="card.newsData.imageUrl" [alt]="card.newsData.headline" />
        </div>
        <div class="headline">{{ card.newsData.headline }}</div>
        <div class="summary">{{ card.newsData.summary }}</div>
        <div class="meta">
          <div class="author" *ngIf="card.newsData.author">
            <mat-icon>person</mat-icon>
            <span>{{ card.newsData.author }}</span>
          </div>
          <div class="published">
            <mat-icon>schedule</mat-icon>
            <span>{{ card.newsData.publishedAt | date:'short' }}</span>
          </div>
          <div class="category" *ngIf="card.newsData.category">
            <mat-icon>category</mat-icon>
            <span>{{ card.newsData.category }}</span>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="openArticle(card.newsData.url)">
          <mat-icon>open_in_new</mat-icon>
          Read More
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .news-card {
      width: 280px;
      min-height: 300px;
      margin: 8px;
      cursor: move;
    }
    
    .news-image {
      margin-bottom: 12px;
    }
    
    .news-image img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .headline {
      font-size: 1.1em;
      font-weight: bold;
      margin-bottom: 8px;
      line-height: 1.3;
      color: #333;
    }
    
    .summary {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.8em;
      color: #888;
    }
    
    .meta > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    mat-card-actions {
      padding: 8px 16px;
    }
    
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsCardComponent {
  @Input() card!: NewsCard;

  openArticle(url: string) {
    window.open(url, '_blank');
  }
}
