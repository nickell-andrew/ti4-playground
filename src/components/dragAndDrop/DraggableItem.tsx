import React, { CSSProperties } from 'react';
import { useDraggable, useDndContext, UniqueIdentifier } from '@dnd-kit/core';
import { PIECE_INSET } from '../utils/boardGeometry';
import './PieceInteraction.css';
interface Props {
  uid: UniqueIdentifier;
  top?: number;
  left?: number;
  style?: CSSProperties;
  children?: React.ReactNode;
  selected?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string, additive: boolean) => void;
  inPool?: boolean;
  groundPiece?: boolean;
}
export const DraggableItem = ({ uid, top = 0, left = 0, style, children, selected, selectedIds = [], onSelect, inPool, groundPiece }: Props) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: uid });
  const { active } = useDndContext();
  const moving = active?.id === uid || (selected && selectedIds.includes(String(active?.id)));
  return <button ref={setNodeRef} {...attributes} {...listeners}
    className={`board-piece${selected ? ' selected' : ''}${inPool ? ' pool-piece' : ''}${groundPiece ? ' ground-piece' : ''}`}
    data-piece-id={uid} aria-label={String(uid)} aria-pressed={!!selected}
    style={{ ...style, left: left + PIECE_INSET, top: top + PIECE_INSET, opacity: moving ? 0 : 1 }}
    onMouseDown={event => {
      if (!event.shiftKey) onSelect?.(String(uid), false);
      listeners?.onMouseDown?.(event);
    }}
    onTouchStart={event => { onSelect?.(String(uid), false); listeners?.onTouchStart?.(event); }}
    onClick={event => { event.stopPropagation(); if (event.shiftKey) onSelect?.(String(uid), true); }}
    onKeyDown={event => {
      if (event.key === ' ' && event.shiftKey) { event.preventDefault(); onSelect?.(String(uid), true); }
      else { if (event.code === 'Space') onSelect?.(String(uid), false); listeners?.onKeyDown?.(event); }
    }}>{children}</button>;
};
