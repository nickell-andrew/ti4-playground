import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

export function Draggable(props: {id: string, children: React.ReactNode}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div className="draggable-container">
        <button className="draggable-element" ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    </div>
  );
}