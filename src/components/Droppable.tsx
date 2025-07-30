import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props: {id: string, children: React.ReactNode, className?: string}) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    // opacity: isOver ? 0.5 : .4,
  };

  return (
    <div ref={setNodeRef} style={style} className={`drappable-overlay ${props.className}`}>
      {props.children}
    </div>
  );
}