export interface BaseCard {
  id: number;
  title: string;
  color: string;
  type: 'weather' | 'notes' | 'news';
  position: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}
