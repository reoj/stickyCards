import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotesCard } from '../models/NotesCard';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  // Mock notes data - in a real app, you'd persist this to a database
  private notesStorage: NotesCard[] = [
    {
      id: 3001,
      title: 'Daily Tasks',
      color: '#ccb75c',
      type: 'notes',
      position: { x: 0, y: 0 },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(),
      content:
        'Review project documentation\nPrepare for team meeting\nUpdate task status',
      tags: ['work', 'tasks'],
      priority: 'high',
    },
  ];

  getNotesData(): Observable<NotesCard[]> {
    return of([...this.notesStorage]);
  }

  createNote(note: Partial<NotesCard>): Observable<NotesCard> {
    const newNote: NotesCard = {
      id: Date.now(),
      title: note.title || 'New Note',
      color: note.color || '#ccb75c',
      type: 'notes',
      position: note.position || { x: 0, y: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      content: note.content || '',
      tags: note.tags || [],
      priority: note.priority || 'medium',
    };

    this.notesStorage.push(newNote);
    return of(newNote);
  }

  updateNote(note: NotesCard): Observable<NotesCard> {
    const index = this.notesStorage.findIndex((n) => n.id === note.id);
    if (index !== -1) {
      this.notesStorage[index] = { ...note, updatedAt: new Date() };
      return of(this.notesStorage[index]);
    }
    return of(note);
  }

  deleteNote(noteId: number): Observable<boolean> {
    const index = this.notesStorage.findIndex((n) => n.id === noteId);
    if (index !== -1) {
      this.notesStorage.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
