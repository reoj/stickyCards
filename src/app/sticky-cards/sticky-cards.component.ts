import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
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
import { CommonModule } from '@angular/common';

interface CardData {
  id: number;
  title: string;
  content: string;
  color: string;
}

@Component({
  selector: 'app-sticky-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './sticky-cards.component.html',
  styleUrl: './sticky-cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyCardsComponent {
  cards = signal<CardData[]>([
    {
      id: 1,
      title: 'Task 1',
      content: 'Complete project documentation',
      color: '#ffeb3b',
    },
    {
      id: 2,
      title: 'Task 2',
      content: 'Review code changes',
      color: '#4caf50',
    },
    {
      id: 3,
      title: 'Task 3',
      content: 'Update dependencies',
      color: '#2196f3',
    },
    {
      id: 4,
      title: 'Task 4',
      content: 'Fix reported bugs',
      color: '#ff9800',
    },
    {
      id: 5,
      title: 'Task 5',
      content: 'Prepare for release',
      color: '#9c27b0',
    },
    {
      id: 6,
      title: 'Task 6',
      content: 'Team meeting notes',
      color: '#f44336',
    },
  ]);

  drop(event: CdkDragDrop<CardData[]>) {
    const cards = this.cards();
    moveItemInArray(cards, event.previousIndex, event.currentIndex);
    this.cards.set([...cards]);
  }

  addCard() {
    const newCard: CardData = {
      id: Date.now(),
      title: `Task ${this.cards().length + 1}`,
      content: 'New task content',
      color: this.getRandomColor(),
    };
    this.cards.update((cards) => [...cards, newCard]);
  }

  removeCard(cardId: number) {
    this.cards.update((cards) => cards.filter((card) => card.id !== cardId));
  }

  trackByCardId(index: number, card: CardData): number {
    return card.id;
  }

  private getRandomColor(): string {
    const colors = [
      '#ffeb3b',
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
