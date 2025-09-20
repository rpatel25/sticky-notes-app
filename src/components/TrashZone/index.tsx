import React, { useRef, useEffect } from 'react';
import styles from './TrashZone.module.css';

interface TrashZoneProps {
  isDragging: boolean;
  onDragOver: (isOver: boolean) => void;
}

const TrashZone: React.FC<TrashZoneProps> = ({ isDragging, onDragOver }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const isOver =
        e.clientX > rect.left &&
        e.clientX < rect.right &&
        e.clientY > rect.top &&
        e.clientY < rect.bottom;
      onDragOver(isOver);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, onDragOver]);

  return (
    <div
      ref={ref}
      className={`${styles.trashZone} ${isDragging ? styles.visible : ''}`}
    >
      🗑️
    </div>
  );
};

export default TrashZone;
