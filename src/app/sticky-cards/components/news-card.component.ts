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
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsCardComponent {
  @Input() card!: NewsCard;

  openArticle(url: string) {
    window.open(url, '_blank');
  }
}
