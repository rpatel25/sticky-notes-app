import React, { useRef } from 'react';
import StickyNote from './components/StickyNote';
import TrashZone from './components/TrashZone';
import { useNotes } from './hooks/useNotes';
import { useDragAndDrop } from './hooks/useDragAndDrop';

const App: React.FC = () => {
  const noteRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const {
    notes,
    addNote,
    deleteNote,
    updateNotePosition,
    updateNoteSize,
    updateNoteText,
    updateNoteColor,
    bringToFront,
  } = useNotes();

  const { isDragging, handleMouseDown, setIsOverTrash } = useDragAndDrop(
    noteRefs,
    {
      updateNotePosition,
      updateNoteSize,
      deleteNote,
      bringToFront,
    }
  );

  return (
    <div className="app-canvas" onDoubleClick={addNote}>
      <h1 className="title">Double click anywhere to add a new note</h1>
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          ref={(element) => {
            if (element) {
              noteRefs.current.set(note.id, element);
            } else {
              noteRefs.current.delete(note.id);
            }
          }}
          note={note}
          onMouseDown={handleMouseDown}
          onUpdateText={updateNoteText}
          onColorChange={updateNoteColor}
          onBringToFront={bringToFront}
        />
      ))}
      <TrashZone isDragging={isDragging} onDragOver={setIsOverTrash} />
    </div>
  );
};

export default App;
