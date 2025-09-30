import { useState, useEffect, useCallback } from 'react';

interface CreationState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// This helper function calculates the dimensions, handling dragging in any direction
const calculateRect = (state: CreationState) => {
  const x = Math.min(state.startX, state.currentX);
  const y = Math.min(state.startY, state.currentY);
  const width = Math.abs(state.startX - state.currentX);
  const height = Math.abs(state.startY - state.currentY);
  return { x, y, width, height };
};

export const useNoteCreator = (
  createNote: (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void
) => {
  const [creationState, setCreationState] = useState<CreationState | null>(
    null
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only start creation if clicking directly on the canvas background
      if (e.target !== e.currentTarget) return;
      setCreationState({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    },
    []
  );

  useEffect(() => {
    if (!creationState) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCreationState((prev) =>
        prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
      );
    };

    const handleMouseUp = () => {
      const rect = calculateRect(creationState);
      // Only create a note if it has a minimum size
      if (rect.width > 100 && rect.height > 50) {
        createNote(rect);
      }
      setCreationState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // The 'once' option automatically removes the listener after it fires
    window.addEventListener('mouseup', handleMouseUp, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [creationState, createNote]);

  const creationBox = creationState ? calculateRect(creationState) : null;

  return { creationBox, handleCanvasMouseDown };
};
