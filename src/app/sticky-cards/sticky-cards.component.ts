import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Card, WeatherCard, NotesCard, NewsCard } from './models';
import { WeatherService } from './services/weather.service';
import { NewsService } from './services/news.service';
import { NotesService } from './services/notes.service';
import { WeatherCardComponent } from './components/weather-card.component';
import { NotesCardComponent } from './components/notes-card.component';
import { NewsCardComponent } from './components/news-card.component';

@Component({
  selector: 'app-sticky-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    WeatherCardComponent,
    NotesCardComponent,
    NewsCardComponent
  ],
  templateUrl: './sticky-cards.component.html',
  styleUrl: './sticky-cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyCardsComponent implements OnInit {
  cards = signal<Card[]>([]);

  constructor(
    private weatherService: WeatherService,
    private newsService: NewsService,
    private notesService: NotesService
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    
  }

  

  addNotesCard() {
    this.notesService.createNote({
      title: `Note ${this.cards().filter(c => c.type === 'notes').length + 1}`,
      content: 'New note content...',
      color: this.getRandomColor(),
      tags: [],
      priority: 'medium'
    }).subscribe(newNote => {
      this.cards.update(cards => [...cards, newNote]);
    });
  }

  updateNotesCard(card: NotesCard) {
    this.notesService.updateNote(card).subscribe(updatedCard => {
      this.cards.update(cards => 
        cards.map(c => c.id === updatedCard.id ? updatedCard : c)
      );
    });
  }

  removeCard(cardId: number) {
    const card = this.cards().find(c => c.id === cardId);
    if (card?.type === 'notes') {
      this.notesService.deleteNote(cardId).subscribe(() => {
        this.cards.update(cards => cards.filter(c => c.id !== cardId));
      });
    } else {
      this.cards.update(cards => cards.filter(c => c.id !== cardId));
    }
  }

  trackByCardId(index: number, card: Card): number {
    return card.id;
  }

  private getRandomColor(): string {
    const colors = [
      '#ccb75c',
      '#4caf50',
      '#2196f3',
      '#ff9800',
      '#9c27b0',
      '#f44336',
      '#00bcd4',
      '#ff5722',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
