import React, { useState, useEffect, useCallback } from 'react';
import { Note, DragState } from './types';
import StickyNote from './components/StickyNote';
import TrashZone from './components/TrashZone';

const COLORS = ['#ffeb3b', '#ffc107', '#8bc34a', '#03a9f4', '#e91e63'];

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('sticky-notes-app');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [dragState, setDragState] = useState<DragState>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  useEffect(() => {
    localStorage.setItem('sticky-notes-app', JSON.stringify(notes));
  }, [notes]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState) return;

      const dx = e.clientX - dragState.initialMouse.x;
      const dy = e.clientY - dragState.initialMouse.y;

      if (dragState.type === 'move') {
        const initialPos = dragState.initialValue as { x: number; y: number };
        setNotes((prev) =>
          prev.map((n) =>
            n.id === dragState.noteId
              ? {
                  ...n,
                  position: { x: initialPos.x + dx, y: initialPos.y + dy },
                }
              : n
          )
        );
      } else if (dragState.type === 'resize') {
        const initialSize = dragState.initialValue as {
          width: number;
          height: number;
        };
        setNotes((prev) =>
          prev.map((n) =>
            n.id === dragState.noteId
              ? {
                  ...n,
                  size: {
                    width: Math.max(150, initialSize.width + dx),
                    height: Math.max(100, initialSize.height + dy),
                  },
                }
              : n
          )
        );
      }
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState && dragState.type === 'move' && isOverTrash) {
      setNotes((prev) => prev.filter((n) => n.id !== dragState.noteId));
    }
    setDragState(null);
    setIsOverTrash(false);
  }, [dragState, isOverTrash]);

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

  const handleBringToFront = (noteId: string) => {
    const maxZIndex = Math.max(0, ...notes.map((n) => n.zIndex));
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, zIndex: maxZIndex + 1 } : n))
    );
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    note: Note,
    type: 'move' | 'resize'
  ) => {
    e.stopPropagation();
    handleBringToFront(note.id);
    setDragState({
      type,
      noteId: note.id,
      initialMouse: { x: e.clientX, y: e.clientY },
      initialValue: type === 'move' ? note.position : note.size,
    });
  };

  const handleUpdateText = (noteId: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, text } : n)));
  };

  const handleColorChange = (noteId: string, color: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, color } : n))
    );
  };

  const handleBoardDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const maxZIndex = Math.max(0, ...notes.map((n) => n.zIndex));
    const newNote: Note = {
      id: `note_${Date.now()}`,
      position: { x: e.clientX - 100, y: e.clientY - 50 },
      size: { width: 200, height: 200 },
      text: 'New Note',
      color: COLORS[0],
      zIndex: maxZIndex + 1,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  return (
    <div className="app-canvas" onDoubleClick={handleBoardDoubleClick}>
      <h1 className="title">Double click anywhere to add a new note</h1>
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onMouseDown={handleMouseDown}
          onUpdateText={handleUpdateText}
          onColorChange={handleColorChange}
          onBringToFront={handleBringToFront}
        />
      ))}
      <TrashZone
        isDragging={!!dragState && dragState.type === 'move'}
        onDragOver={setIsOverTrash}
      />
    </div>
  );
};

export default App;
