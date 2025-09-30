import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';

const COLORS = ['#ffeb3b', '#ffc107', '#8bc34a', '#03a9f4', '#e91e63'];

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('sticky-notes-app');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('sticky-notes-app', JSON.stringify(notes));
  }, [notes]);

  const createNote = useCallback(
    (rect: { x: number; y: number; width: number; height: number }) => {
      const maxZIndex = Math.max(0, ...notes.map((n) => n.zIndex));
      const newNote: Note = {
        id: `note_${Date.now()}`,
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
        text: 'New Note',
        color: COLORS[0],
        zIndex: maxZIndex + 1,
      };
      setNotes((prev) => [...prev, newNote]);
    },
    [notes]
  );

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, []);

  const updateNotePosition = useCallback(
    (noteId: string, position: { x: number; y: number }) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, position } : n))
      );
    },
    []
  );

  const updateNoteSize = useCallback(
    (noteId: string, size: { width: number; height: number }) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, size } : n))
      );
    },
    []
  );

  const updateNoteText = useCallback((noteId: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, text } : n)));
  }, []);

  const updateNoteColor = useCallback((noteId: string, color: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, color } : n))
    );
  }, []);

  const bringToFront = useCallback(
    (noteId: string) => {
      const maxZIndex = Math.max(0, ...notes.map((n) => n.zIndex));
      if (
        notes.find((n) => n.id === noteId)?.zIndex === maxZIndex &&
        maxZIndex > 0
      )
        return;
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, zIndex: maxZIndex + 1 } : n))
      );
    },
    [notes]
  );

  return {
    notes,
    setNotes,
    createNote,
    deleteNote,
    updateNotePosition,
    updateNoteSize,
    updateNoteText,
    updateNoteColor,
    bringToFront,
  };
};
