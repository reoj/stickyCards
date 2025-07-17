import { BaseCard } from './BaseCard';

export interface NotesCard extends BaseCard {
  type: 'notes';
  content: string;
  isEditing?: boolean;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}
