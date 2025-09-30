import React from 'react';
import { Note } from '../../types';
import styles from './StickyNote.module.css';

const COLORS = ['#ffeb3b', '#ffc107', '#8bc34a', '#03a9f4', '#e91e63'];

interface StickyNoteProps {
  note: Note;
  onMouseDown: (
    e: React.MouseEvent,
    note: Note,
    type: 'move' | 'resize'
  ) => void;
  onUpdateText: (id: string, text: string) => void;
  onColorChange: (id: string, color: string) => void;
  onBringToFront: (id: string) => void;
}

const StickyNote = React.forwardRef<HTMLDivElement, StickyNoteProps>(
  (props, ref) => {
    const { note, onMouseDown, onUpdateText, onColorChange, onBringToFront } =
      props;

    return (
      <div
        className={styles.note}
        ref={ref}
        style={{
          transform: `translate(${note.position.x}px, ${note.position.y}px)`,
          width: `${note.size.width}px`,
          height: `${note.size.height}px`,
          zIndex: note.zIndex,
          backgroundColor: note.color,
        }}
        onMouseDown={(e) => onMouseDown(e, note, 'move')} // Click anywhere on note to bring to front
      >
        <div
          className={styles.header}
          onMouseDown={(e) => onMouseDown(e, note, 'move')}
        >
          <div className={styles.colors}>
            {COLORS.map((color) => (
              <button
                key={color}
                className={styles.colorSwatch}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag from starting
                  onColorChange(note.id, color);
                }}
              />
            ))}
          </div>
        </div>
        <textarea
          className={styles.textarea}
          defaultValue={note.text}
          onBlur={(e) => onUpdateText(note.id, e.target.value)}
          onClick={(e) => e.stopPropagation()} // Prevent drag on text area click
          onMouseDown={(e) => {
            onBringToFront(note.id);
            e.stopPropagation();
          }}
        />
        <div
          className={styles.resizer}
          onMouseDown={(e) => onMouseDown(e, note, 'resize')}
        ></div>
      </div>
    );
  }
);

export default React.memo(StickyNote);
