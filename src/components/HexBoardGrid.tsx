import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { DraggableContainer } from './dragAndDrop/DraggableContainer';
import { Mallice } from './hexTile/Mallice';
import { HexTile } from './hexTile/HexTile';
import type { TILE_NUMBER_AND_ROTATION, PLAYER_COUNT } from './utils/mapData';
import type { DraggablePiecePropsByUid } from './dragAndDrop/draggablePieceUtils';
import type { CardDragData } from './cards/BoardCards';
import { BOARD_WIDTH, BOARD_HEIGHT } from './utils/boardGeometry';

interface HexBoardGridProps {
    boardSize: number;
    hexagons: { q: number; r: number; s: number; extraSystem?: boolean }[];
    hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>;
    activeHex: { q: number; r: number; s: number } | null;
    playerCount: PLAYER_COUNT;
    locked: boolean;
    onHexClick: (q: number, r: number, s: number, event: React.MouseEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    onDragOver?: (event: DragOverEvent) => void;
    draggableItems: React.ReactNode;
    containerItems: React.ReactNode;
    pieces?: DraggablePiecePropsByUid;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    boardOverlay?: React.ReactNode;
    onCardDrop?: (data: CardDragData, point: { x: number; y: number }, player?: number) => void;
    cardPositions?: Record<string, { x: number; y: number }>;
}
const WIDTH = BOARD_WIDTH, HEIGHT = BOARD_HEIGHT;
export const HexBoardGrid: React.FC<HexBoardGridProps> = React.memo(({
    boardSize, hexagons, hexTiles, activeHex, playerCount, locked, onHexClick, onDragEnd, onDragOver,
    draggableItems, containerItems, pieces, selectedIds = [], onSelectionChange, boardOverlay, onCardDrop, cardPositions,
}) => {
    const viewport = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [autoFit, setAutoFit] = useState(true);
    const [selectionMode, setSelectionMode] = useState(false);
    const [gesturing, setGesturing] = useState(false);
    const [panKey, setPanKey] = useState(false);
    const zoomRef = useRef(zoom);
    const pendingAnchor = useRef<{ worldX: number; worldY: number; clientX: number; clientY: number } | null>(null);
    const pan = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
    const suppressClick = useRef(false);
    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.code !== 'Space' || (event.target as Element)?.closest?.('input,textarea,select,button')) return;
            event.preventDefault(); setPanKey(true);
        };
        const up = (event: KeyboardEvent) => { if (event.code === 'Space') setPanKey(false); };
        const blur = () => setPanKey(false);
        window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
        return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); };
    }, []);
    const fit = useCallback(() => {
        const node = viewport.current;
        if (!node || !node.clientWidth || !node.clientHeight) return;
        setZoom(Math.max(0.15, Math.min((node.clientWidth - 24) / WIDTH, (node.clientHeight - 120) / HEIGHT, 1)));
        node.scrollTo?.({ left: 0, top: 0 });
    }, []);
    useEffect(() => {
        if (!autoFit) return;
        fit();
        if (typeof ResizeObserver === 'undefined' || !viewport.current) return;
        const observer = new ResizeObserver(fit);
        observer.observe(viewport.current);
        return () => observer.disconnect();
    }, [autoFit, fit]);
    const changeZoom = useCallback((next: number, anchor?: { x: number; y: number }, world?: { x: number; y: number }) => {
        const node = viewport.current;
        const value = Math.max(0.15, Math.min(2, next));
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const clientX = anchor ? anchor.x - rect.left : node.clientWidth / 2;
        const clientY = anchor ? anchor.y - rect.top : node.clientHeight / 2;
        const previous = zoomRef.current;
        pendingAnchor.current = {
            worldX: world?.x ?? (node.scrollLeft + clientX - Math.max(0, (node.clientWidth - WIDTH * previous) / 2)) / previous,
            worldY: world?.y ?? (node.scrollTop + clientY - Math.max(0, (node.clientHeight - HEIGHT * previous) / 2)) / previous,
            clientX, clientY,
        };
        setAutoFit(false); setZoom(value);
        // A pinch can pan at the same zoom, including at either zoom limit.
        if (value === previous) {
            const a = pendingAnchor.current;
            node.scrollLeft = a.worldX * value + Math.max(0, (node.clientWidth - WIDTH * value) / 2) - a.clientX;
            node.scrollTop = a.worldY * value + Math.max(0, (node.clientHeight - HEIGHT * value) / 2) - a.clientY;
            pendingAnchor.current = null;
        }
    }, []);
    useLayoutEffect(() => {
        zoomRef.current = zoom;
        const node = viewport.current, a = pendingAnchor.current;
        if (!node || !a) return;
        node.scrollLeft = a.worldX * zoom + Math.max(0, (node.clientWidth - WIDTH * zoom) / 2) - a.clientX;
        node.scrollTop = a.worldY * zoom + Math.max(0, (node.clientHeight - HEIGHT * zoom) / 2) - a.clientY;
        pendingAnchor.current = null;
    }, [zoom]);
    useEffect(() => {
        const node = viewport.current;
        if (!node) return;
        let pinch: { distance: number; zoom: number; world: { x: number; y: number } } | null = null;
        const touchPoints = (event: TouchEvent) => {
            const [a, b] = Array.from(event.touches);
            return { midpoint: { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }, distance: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY) };
        };
        const startPinch = (event: TouchEvent) => {
            if (event.touches.length !== 2) return;
            event.preventDefault(); event.stopPropagation();
            const { midpoint, distance } = touchPoints(event), rect = node.getBoundingClientRect(), z = zoomRef.current;
            pinch = { distance: Math.max(distance, 1), zoom: z, world: {
                x: (node.scrollLeft + midpoint.x - rect.left - Math.max(0, (node.clientWidth - WIDTH * z) / 2)) / z,
                y: (node.scrollTop + midpoint.y - rect.top - Math.max(0, (node.clientHeight - HEIGHT * z) / 2)) / z,
            } };
            pan.current = null; setGesturing(true);
        };
        const movePinch = (event: TouchEvent) => {
            if (!pinch || event.touches.length < 2) return;
            event.preventDefault(); event.stopPropagation();
            const { midpoint, distance } = touchPoints(event);
            changeZoom(pinch.zoom * distance / pinch.distance, midpoint, pinch.world);
        };
        const endPinch = (event: TouchEvent) => {
            if (!pinch || event.touches.length >= 2) return;
            pinch = null; setGesturing(false); suppressClick.current = true;
        };
        const wheel = (event: WheelEvent) => {
            event.preventDefault();
            const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1);
            changeZoom(zoomRef.current * Math.exp(-Math.max(-120, Math.min(120, pixels)) * (event.ctrlKey ? 0.01 : 0.002)), { x: event.clientX, y: event.clientY });
        };
        node.addEventListener('wheel', wheel, { passive: false });
        node.addEventListener('touchstart', startPinch, { passive: false, capture: true });
        node.addEventListener('touchmove', movePinch, { passive: false, capture: true });
        node.addEventListener('touchend', endPinch, { capture: true });
        node.addEventListener('touchcancel', endPinch, { capture: true });
        return () => {
            node.removeEventListener('wheel', wheel);
            node.removeEventListener('touchstart', startPinch, true);
            node.removeEventListener('touchmove', movePinch, true);
            node.removeEventListener('touchend', endPinch, true);
            node.removeEventListener('touchcancel', endPinch, true);
        };
    }, [changeZoom]);
    return <section className="board-grid-shell" aria-label="Map board">
        <div className="board-help" aria-live="polite">{selectedIds.length ? `${selectedIds.length} selected · Drag to move together` : 'Drag to select · Space / middle-drag to pan · Wheel / pinch to zoom'}</div>
        <div ref={viewport} className={`board-viewport${panKey ? ' panning' : ''}`} tabIndex={0} aria-label="Scrollable game board"
            onClickCapture={event => { if (suppressClick.current) { event.stopPropagation(); suppressClick.current = false; } }}
            onPointerDown={event => {
                if ((!panKey && event.button !== 1) || event.pointerType === 'touch' || (event.target as Element).closest('button, [data-piece-supply]')) return;
                event.preventDefault();
                pan.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop };
            }}
            onPointerMove={event => {
                if (!pan.current) return;
                const dx = event.clientX - pan.current.x, dy = event.clientY - pan.current.y;
                if (Math.hypot(dx, dy) > 4) { suppressClick.current = true; event.currentTarget.setPointerCapture?.(event.pointerId); }
                event.currentTarget.scrollLeft = pan.current.left - dx;
                event.currentTarget.scrollTop = pan.current.top - dy;
            }}
            onPointerUp={event => { pan.current = null; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={() => { pan.current = null; }}>
            <div className="board-scroll-content" style={{ width: WIDTH * zoom, height: HEIGHT * zoom }}>
                <div className="board-stage" style={{ width: WIDTH * zoom, height: HEIGHT * zoom }}>
                    <div className="hex-board" style={{ width: WIDTH, height: HEIGHT, transform: `scale(${zoom})` }}>
                        <DraggableContainer onDragEnd={onDragEnd} onDragOver={onDragOver} draggableItems={draggableItems} containerItems={containerItems}
                            zoom={zoom} pieces={pieces} selectedIds={selectedIds} onSelectionChange={onSelectionChange} selectionMode={selectionMode} gesturing={gesturing}
                            boardOverlay={boardOverlay} onCardDrop={onCardDrop} panKey={panKey} cardPositions={cardPositions}>
                            <Mallice boardSize={boardSize} />
                            {hexagons.map(hex => {
                                const hexKey = `${hex.q},${hex.r},${hex.s}`;
                                return <HexTile key={hexKey} {...hex} boardSize={boardSize} playerCount={playerCount}
                                    tile={hexTiles[hexKey] ?? null} isActive={activeHex?.q === hex.q && activeHex?.r === hex.r && activeHex?.s === hex.s}
                                    isLocked={locked} onHexClick={onHexClick} />;
                            })}
                        </DraggableContainer>
                    </div>
                </div>
            </div>
        </div>
        <nav className="board-navigation" aria-label="Board navigation">
            <button onClick={() => changeZoom(zoom / 1.25)} aria-label="Zoom out">−</button>
            <output aria-label="Board zoom">{Math.round(zoom * 100)}%</output>
            <button onClick={() => changeZoom(zoom * 1.25)} aria-label="Zoom in">+</button>
            <button onClick={() => { setAutoFit(true); fit(); }}>Fit</button>
            <button onClick={() => changeZoom(1)}>100%</button>
            <button aria-pressed={selectionMode} onClick={() => setSelectionMode(value => !value)}>Select</button>
            {selectedIds.length > 0 && <button onClick={() => onSelectionChange?.([])}>Deselect</button>}
        </nav>
    </section>;
});
