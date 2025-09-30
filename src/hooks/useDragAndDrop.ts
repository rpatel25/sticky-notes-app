import { useState, useEffect, useCallback, RefObject } from 'react';
import { Note, DragState } from '../types';

interface DragAndDropHandlers {
  updateNotePosition: (
    noteId: string,
    position: { x: number; y: number }
  ) => void;
  updateNoteSize: (
    noteId: string,
    size: { width: number; height: number }
  ) => void;
  deleteNote: (noteId: string) => void;
  bringToFront: (noteId: string) => void;
}

export const useDragAndDrop = (
  noteRefs: RefObject<Map<string, HTMLDivElement | null>>,
  handlers: DragAndDropHandlers
) => {
  const [dragState, setDragState] = useState<DragState>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const { updateNotePosition, updateNoteSize, deleteNote, bringToFront } =
    handlers;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, note: Note, type: 'move' | 'resize') => {
      e.stopPropagation();
      bringToFront(note.id);
      setDragState({
        type,
        noteId: note.id,
        initialMouse: { x: e.clientX, y: e.clientY },
        initialValue: type === 'move' ? note.position : note.size,
      });
    },
    [bringToFront]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState) return;

      // Get the DOM element from the ref map
      const noteElement = noteRefs.current?.get(dragState.noteId);
      if (!noteElement) return;

      const dx = e.clientX - dragState.initialMouse.x;
      const dy = e.clientY - dragState.initialMouse.y;

      if (dragState.type === 'move') {
        const initialPos = dragState.initialValue as { x: number; y: number };
        const newX = initialPos.x + dx;
        const newY = initialPos.y + dy;

        // Directly manipulate the element's style.transform. NO state update!
        noteElement.style.transform = `translate(${newX}px, ${newY}px)`;
      } else if (dragState.type === 'resize') {
        const initialSize = dragState.initialValue as {
          width: number;
          height: number;
        };
        const newWidth = Math.max(150, initialSize.width + dx);
        const newHeight = Math.max(150, initialSize.height + dy);

        // Directly manipulate the element's style.size. NO state update!
        noteElement.style.width = `${newWidth}px`;
        noteElement.style.height = `${newHeight}px`;
      }
    },
    [dragState, noteRefs]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!dragState) return;

      if (dragState.type === 'move' && isOverTrash) {
        deleteNote(dragState.noteId);
      } else {
        // Finalize position/size in state
        const dx = e.clientX - dragState.initialMouse.x;
        const dy = e.clientY - dragState.initialMouse.y;

        if (dragState.type === 'move') {
          const initialPos = dragState.initialValue as { x: number; y: number };
          const finalPosition = { x: initialPos.x + dx, y: initialPos.y + dy };

          // Update the state ONCE with the final position
          updateNotePosition(dragState.noteId, finalPosition);
        }
        if (dragState.type === 'resize') {
          const initialSize = dragState.initialValue as {
            width: number;
            height: number;
          };
          const finalSize = {
            width: Math.max(150, initialSize.width + dx),
            height: Math.max(150, initialSize.height + dy),
          };

          // Update the state ONCE with the final size
          updateNoteSize(dragState.noteId, finalSize);
        }
      }
      setDragState(null);
      setIsOverTrash(false);
    },
    [dragState, isOverTrash, deleteNote, updateNotePosition, updateNoteSize]
  );

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  return {
    isDragging: !!dragState && dragState.type === 'move',
    handleMouseDown,
    setIsOverTrash,
  };
};
