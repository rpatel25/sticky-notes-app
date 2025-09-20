export interface Note {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  text: string;
  color: string;
  zIndex: number;
}

export type DragState = {
  type: 'move' | 'resize';
  noteId: string;
  initialMouse: { x: number; y: number };
  initialValue: { x: number; y: number } | { width: number; height: number };
} | null;