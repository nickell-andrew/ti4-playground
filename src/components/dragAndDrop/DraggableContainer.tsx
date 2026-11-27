import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors, DragOverlay, Modifier, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { getEventCoordinates } from '@dnd-kit/utilities';
import { getImageFromDraggablePieceProps, DraggablePiecePropsByUid, DraggablePieceProps } from './draggablePieceUtils';
import { PIECE_INSET, BOARD_MARGIN, selectInRectangle } from '../utils/boardGeometry';
import { CardArt } from '../cards/CardArt';
import type { CardDragData } from '../cards/BoardCards';
import damageMarker from '../../assets/async/damage.png';
import type { PLAYERS, ALL_PIECES } from '../consts';
import './PieceInteraction.css';

export const centerOnCursor: Modifier = ({ activatorEvent, activeNodeRect, transform }) => {
    const point = activatorEvent && getEventCoordinates(activatorEvent);
    if (!point || !activeNodeRect) return transform;
    return { ...transform, x: transform.x + point.x - activeNodeRect.left - activeNodeRect.width / 2,
        y: transform.y + point.y - activeNodeRect.top - activeNodeRect.height / 2 };
};
interface Props {
    children: React.ReactNode;
    onDragEnd(event: DragEndEvent): void;
    onDragOver?(event: DragOverEvent): void;
    draggableItems: React.ReactNode;
    containerItems: React.ReactNode;
    pieces?: DraggablePiecePropsByUid;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    zoom?: number;
    selectionMode?: boolean;
    gesturing?: boolean;
    boardOverlay?: React.ReactNode;
    onCardDrop?: (data: CardDragData, point: { x: number; y: number }, player?: number) => void;
    panKey?: boolean;
    cardPositions?: Record<string, { x: number; y: number }>;
}
export const DraggableContainer: React.FC<Props> = ({ children, onDragEnd, onDragOver, draggableItems, containerItems,
    pieces = {}, selectedIds = [], onSelectionChange, zoom = 1, selectionMode = false, gesturing = false, boardOverlay, onCardDrop, panKey = false, cardPositions = {} }) => {
    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }), useSensor(KeyboardSensor));
    const [overlay, setOverlay] = useState<{ anchor: DraggablePieceProps; items: DraggablePieceProps[] } | null>(null);
    const [cardOverlay, setCardOverlay] = useState<CardDragData | null>(null);
    const surfaceRef = useRef<HTMLDivElement>(null);
    const [marquee, setMarquee] = useState<{ start: { x: number; y: number }; end: { x: number; y: number }; additive: boolean } | null>(null);
    const suppressClick = useRef(false);
    const lastPointer = useRef<{ x: number; y: number } | null>(null);
    useEffect(() => {
        const remember = (event: MouseEvent | TouchEvent) => {
            const point = 'touches' in event ? event.touches[0] ?? event.changedTouches[0] : event;
            if (point) lastPointer.current = { x: point.clientX, y: point.clientY };
        };
        document.addEventListener('mousemove', remember, true); document.addEventListener('mouseup', remember, true);
        document.addEventListener('touchmove', remember, true); document.addEventListener('touchend', remember, true);
        return () => {
            document.removeEventListener('mousemove', remember, true); document.removeEventListener('mouseup', remember, true);
            document.removeEventListener('touchmove', remember, true); document.removeEventListener('touchend', remember, true);
        };
    }, []);
    useEffect(() => { if (gesturing) { setOverlay(null); setCardOverlay(null); setMarquee(null); } }, [gesturing]);
    const boardPoint = (event: React.PointerEvent) => {
        const rect = surfaceRef.current!.getBoundingClientRect();
        return { x: (event.clientX - rect.left) / zoom - PIECE_INSET - BOARD_MARGIN, y: (event.clientY - rect.top) / zoom - PIECE_INSET - BOARD_MARGIN };
    };
    const handleDragStart = ({ active }: DragStartEvent) => {
        if (active.data.current?.isCard) { setCardOverlay(active.data.current as CardDragData); return; }
        const id = String(active.id);
        let anchor = pieces[id];
        if (id.startsWith('container-shared-')) anchor = { player: 1, name: id.replace('container-shared-', '') as ALL_PIECES, pieceNumber: 1 };
        else if (id.startsWith('container-')) {
            const [, player, name] = id.split('-');
            anchor = { player: Number(player) as PLAYERS, name: name as ALL_PIECES, pieceNumber: 1 };
        }
        if (!anchor) return;
        const items = selectedIds.includes(id) ? selectedIds.map(uid => pieces[uid]).filter(Boolean) : [anchor];
        setOverlay({ anchor, items });
        if (pieces[id] && !selectedIds.includes(id)) onSelectionChange?.([id]);
    };
    return <DndContext key={String(gesturing)} sensors={sensors} modifiers={[centerOnCursor]}
        measuring={{ draggable: { measure: node => node.getBoundingClientRect() }, droppable: { measure: node => node.getBoundingClientRect() } }}
        collisionDetection={args => {
            const hits = args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args);
            if (!args.pointerCoordinates) return hits;
            return hits.filter(hit => {
                const container = args.droppableContainers.find(item => item.id === hit.id);
                if (!container?.data.current?.isHex && !container?.data.current?.isCommandPool) return true;
                const rect = args.droppableRects.get(hit.id);
                if (!rect) return false;
                const dx = Math.abs(args.pointerCoordinates!.x - rect.left - rect.width / 2);
                const dy = Math.abs(args.pointerCoordinates!.y - rect.top - rect.height / 2);
                if (container.data.current?.isPlanet) return Math.hypot(dx / rect.width, dy / rect.height) <= 0.5;
                return dx <= rect.width / 2 - dy * rect.width / (2 * rect.height);
            }).sort((a, b) => {
                const priority = (id: typeof a.id) => {
                    const data = args.droppableContainers.find(item => item.id === id)?.data.current;
                    return String(id).startsWith('container-') ? 0 : data?.isPlanet || data?.isPlayerArea || data?.isCommandPool ? 1 : 2;
                };
                return priority(a.id) - priority(b.id);
            });
        }}
        onDragStart={handleDragStart} onDragCancel={() => { setOverlay(null); setCardOverlay(null); }}
        onDragEnd={event => {
            setOverlay(null);
            setCardOverlay(null);
            const surface = surfaceRef.current?.getBoundingClientRect();
            const pointer = event.activatorEvent.type.startsWith('key') ? null : lastPointer.current;
            const point = pointer && surface ? {
                x: (pointer.x - surface.left) / zoom - BOARD_MARGIN - PIECE_INSET,
                y: (pointer.y - surface.top) / zoom - BOARD_MARGIN - PIECE_INSET,
            } : null;
            if (event.active.data.current?.isCard) {
                const rect = event.active.rect.current.initial;
                const position = point ?? (rect && surface ? {
                    x: (rect.left + rect.width / 2 + event.delta.x - surface.left) / zoom - BOARD_MARGIN - PIECE_INSET,
                    y: (rect.top + rect.height / 2 + event.delta.y - surface.top) / zoom - BOARD_MARGIN - PIECE_INSET,
                } : null);
                if (position) onCardDrop?.(event.active.data.current as CardDragData, position, event.over?.data.current?.isPlayerArea ? event.over.data.current.player : undefined);
                return;
            }
            onDragEnd({ ...event,
                active: { ...event.active, data: { current: { ...event.active.data.current, ...(point ? { pointerDrop: point } : {}) } } },
                delta: { x: event.delta.x / zoom, y: event.delta.y / zoom },
            });
        }} onDragOver={onDragOver}>
        <div ref={surfaceRef} className="board-surface"
            onKeyDown={event => { if (event.key === 'Escape') { onSelectionChange?.([]); setMarquee(null); } }}
            onClickCapture={event => { if (suppressClick.current) { event.stopPropagation(); suppressClick.current = false; } }}
            onPointerDown={event => {
                if (event.button !== 0 || panKey || (event.pointerType === 'touch' && !selectionMode && !event.shiftKey) || (event.target as Element).closest('button, [data-piece-supply]')) return;
                event.preventDefault(); event.stopPropagation();
                const start = boardPoint(event);
                setMarquee({ start, end: start, additive: event.shiftKey });
            }}
            onPointerMove={event => { if (marquee) {
                const end = boardPoint(event);
                if (Math.hypot(end.x - marquee.start.x, end.y - marquee.start.y) * zoom > 4) event.currentTarget.setPointerCapture?.(event.pointerId);
                setMarquee({ ...marquee, end });
            } }}
            onPointerCancel={() => setMarquee(null)}
            onPointerUp={event => {
                if (!marquee) return;
                const end = boardPoint(event);
                const moved = Math.hypot(end.x - marquee.start.x, end.y - marquee.start.y) * zoom > 4;
                if (moved) {
                    const ids = selectInRectangle({ ...pieces, ...cardPositions }, marquee.start, end);
                    onSelectionChange?.(marquee.additive ? Array.from(new Set([...selectedIds, ...ids])) : ids);
                } else if (!marquee.additive) onSelectionChange?.([]);
                suppressClick.current = moved || marquee.additive;
                setMarquee(null);
                if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            }} style={{ touchAction: selectionMode ? 'none' : 'auto' }}>
            <div className="board-map">{children}{containerItems}{draggableItems}</div>
            {marquee && <div className="selection-rectangle" style={{
                left: Math.min(marquee.start.x, marquee.end.x) + PIECE_INSET + BOARD_MARGIN,
                top: Math.min(marquee.start.y, marquee.end.y) + PIECE_INSET + BOARD_MARGIN,
                width: Math.abs(marquee.start.x - marquee.end.x), height: Math.abs(marquee.start.y - marquee.end.y) }} />}
        </div>
        {boardOverlay && createPortal(boardOverlay, document.body)}
        {createPortal(<DragOverlay dropAnimation={null} zIndex={5000}>
            {overlay && <div className="drag-piece-overlay" style={{ width: '100%', height: '100%' }}>
                {overlay.items.map(piece => <div key={`${piece.player}-${piece.name}-${piece.pieceNumber}`} style={{ position: 'absolute',
                    left: `calc(50% + ${((piece.x ?? 0) - (overlay.anchor.x ?? 0)) * zoom}px)`,
                    top: `calc(50% + ${((piece.y ?? 0) - (overlay.anchor.y ?? 0)) * zoom}px)`,
                    transform: `translate(-50%, -50%) scale(${zoom})` }}>{getImageFromDraggablePieceProps(piece, piece.commandPool ? 0.65 : piece.tradeGoodPlayer ? 0.67 : piece.layoutScale ?? 1)}
                    {piece.damaged && <img className="ship-damage" src={damageMarker} alt="Damaged" draggable={false} />}</div>)}
            </div>}
            {cardOverlay && <div style={{ width: cardOverlay.kind === 'strategies' ? 96 : 54, position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${zoom})` }}>
                <CardArt kind={cardOverlay.kind} id={cardOverlay.cardId} planet={cardOverlay.planet} exhausted={cardOverlay.state.exhausted} />
            </div>}
        </DragOverlay>, document.body)}
    </DndContext>;
};
