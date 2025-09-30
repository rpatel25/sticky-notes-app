import React, { useRef } from 'react';
import StickyNote from './components/StickyNote';
import TrashZone from './components/TrashZone';
import { useNotes } from './hooks/useNotes';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useNoteCreator } from './hooks/useNoteCreator';

const App: React.FC = () => {
  const noteRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const {
    notes,
    createNote,
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

  const { creationBox, handleCanvasMouseDown } = useNoteCreator(createNote);

  return (
    <div className="app-canvas" onMouseDown={handleCanvasMouseDown}>
      {/* Change from double-click to click-drag-release with minimum required size for visibility purpose */}
      <h1 className="title">
        Click and drag mouse to add a new note (minimum - 100x50)
      </h1>
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
      {/* Conditionally render the preview box */}
      {creationBox && (
        <div
          className="creation-preview-box"
          style={{
            left: `${creationBox.x}px`,
            top: `${creationBox.y}px`,
            width: `${creationBox.width}px`,
            height: `${creationBox.height}px`,
          }}
        />
      )}
      <TrashZone isDragging={isDragging} onDragOver={setIsOverTrash} />
    </div>
  );
};

export default App;
