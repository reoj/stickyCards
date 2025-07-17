import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { NotesCard } from '../models/NotesCard';

@Component({
  selector: 'app-notes-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="notes-card" [style.background-color]="card.color">
      <mat-card-header>
        <mat-card-title>{{ card.title }}</mat-card-title>
        <div class="actions">
          <button mat-icon-button (click)="toggleEdit()" [attr.aria-label]="card.isEditing ? 'Save' : 'Edit'">
            <mat-icon>{{ card.isEditing ? 'save' : 'edit' }}</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteCard.emit(card.id)" aria-label="Delete">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="!card.isEditing" class="content">
          <p>{{ card.content }}</p>
        </div>
        <div *ngIf="card.isEditing" class="edit-content">
          <mat-form-field appearance="outline" class="full-width">
            <textarea 
              matInput 
              [(ngModel)]="card.content" 
              placeholder="Write your notes here..."
              rows="4"
              (keydown.enter)="$event.stopPropagation()"
            ></textarea>
          </mat-form-field>
        </div>
        <div class="tags" *ngIf="card.tags && card.tags.length > 0">
          <mat-chip-set>
            <mat-chip *ngFor="let tag of card.tags">{{ tag }}</mat-chip>
          </mat-chip-set>
        </div>
        <div class="priority" *ngIf="card.priority">
          <mat-icon [class]="'priority-' + card.priority">flag</mat-icon>
          <span>{{ card.priority | titlecase }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .notes-card {
      width: 250px;
      min-height: 200px;
      margin: 8px;
      cursor: move;
    }
    
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .actions {
      display: flex;
      gap: 4px;
    }
    
    .content {
      margin-bottom: 16px;
      min-height: 80px;
      white-space: pre-wrap;
    }
    
    .edit-content {
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .tags {
      margin-bottom: 8px;
    }
    
    .priority {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9em;
    }
    
    .priority-low {
      color: #4caf50;
    }
    
    .priority-medium {
      color: #ff9800;
    }
    
    .priority-high {
      color: #f44336;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesCardComponent {
  @Input() card!: NotesCard;
  @Output() updateCard = new EventEmitter<NotesCard>();
  @Output() deleteCard = new EventEmitter<number>();

  toggleEdit() {
    this.card.isEditing = !this.card.isEditing;
    if (!this.card.isEditing) {
      this.card.updatedAt = new Date();
      this.updateCard.emit(this.card);
    }
  }
}
