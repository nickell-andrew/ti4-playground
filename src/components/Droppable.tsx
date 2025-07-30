import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props: { id: string, children: React.ReactNode, className?: string }) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className={`drappable-overlay ${props.className}`}>
      {props.children}
    </div>
  );
}