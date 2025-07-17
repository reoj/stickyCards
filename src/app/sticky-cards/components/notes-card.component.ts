import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
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
    MatChipsModule,
  ],
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
