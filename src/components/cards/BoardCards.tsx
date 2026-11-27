import React from 'react';
import { useDraggable, useDroppable, useDndContext } from '@dnd-kit/core';
import { Planet } from '../../assets/data/tiles';
import { CardArt } from './CardArt';
import { CardState, TabletopCards, cardPosition, playerCardArea, strategyCards } from '../utils/tabletopCards';
import { PIECE_INSET } from '../utils/boardGeometry';

export interface CardDragData { isCard: true; kind: keyof TabletopCards; cardId: string; fromDrawer?: boolean; planet?: Planet; state: CardState }
export function DrawerCard({ kind, id, state, planet, onFlip }: { kind: keyof TabletopCards; id: string; state: CardState; planet?: Planet; onFlip: () => void }) {
    const { attributes, listeners, setNodeRef } = useDraggable({ id: `drawer-card-${kind}-${id}`, data: { isCard: true, kind, cardId: id, state, planet, fromDrawer: true } as CardDragData });
    const name = kind === 'strategies' ? strategyCards.find(card => card.id === id)?.name : id;
    return <button ref={setNodeRef} {...attributes} {...listeners} className="card-face" aria-label={`${state.exhausted ? 'Ready' : kind === 'strategies' ? 'Use' : 'Exhaust'} ${name}`} aria-pressed={state.exhausted}
        onClick={() => { if (state.player !== null) onFlip(); }}>
        <CardArt kind={kind} id={id} planet={planet} exhausted={state.exhausted} />
    </button>;
}
function BoardCard({ kind, id, state, position, planet, onChange, selected, onSelect }: { kind: keyof TabletopCards; id: string; state: CardState; position: { x: number; y: number }; planet?: Planet; onChange: (kind: keyof TabletopCards, id: string, state: CardState) => void; selected: boolean; onSelect: (id: string, additive: boolean) => void }) {
    const name = kind === 'strategies' ? strategyCards.find(card => card.id === id)?.name : id;
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `board-card-${kind}-${id}`, data: { isCard: true, kind, cardId: id, state, planet } as CardDragData });
    const selectionId = `board-card-${kind}-${id}`;
    return <button ref={setNodeRef} {...attributes} {...listeners} className={`board-card ${kind}${selected ? ' selected' : ''}`} style={{ left: position.x + PIECE_INSET, top: position.y + PIECE_INSET, opacity: isDragging ? 0 : 1 }}
        aria-label={`Board card ${name}${state.player ? `, player ${state.player}` : ''}, ${state.exhausted ? 'exhausted' : 'ready'}`} aria-pressed={selected}
        title="Select and press F to flip; double-click to flip"
        onMouseDown={event => { if (!event.shiftKey) onSelect(selectionId, false); listeners?.onMouseDown?.(event); }}
        onClick={event => { event.stopPropagation(); onSelect(selectionId, event.shiftKey); }}
        onDoubleClick={event => { event.stopPropagation(); onChange(kind, id, { ...state, exhausted: !state.exhausted }); }}>
        <CardArt kind={kind} id={id} planet={planet} exhausted={state.exhausted} />
        <span className="board-card-state">{state.player ? `P${state.player}` : 'Unassigned'} · {state.exhausted ? 'Used' : 'Ready'}</span>
    </button>;
}
function PlayerCardArea({ player }: { player: number }) {
    const { active } = useDndContext();
    const { setNodeRef, isOver } = useDroppable({ id: `player-card-area-${player}`, disabled: !active?.data.current?.isCard, data: { isPlayerArea: true, player } });
    const area = playerCardArea(player);
    return <div ref={setNodeRef} className={`player-card-area${isOver ? ' over' : ''}`} style={{ left: area.x - 135 + PIECE_INSET, top: area.y - 85 + PIECE_INSET }}><span>Player {player} · Cards</span></div>;
}
export function BoardCards({ cards, planets, playerCount, onChange, selectedIds, onSelect }: { cards: TabletopCards; planets: Planet[]; playerCount: number; onChange: (kind: keyof TabletopCards, id: string, state: CardState) => void; selectedIds: string[]; onSelect: (id: string, additive: boolean) => void }) {
    return <>
        {Array.from({ length: playerCount }, (_, i) => <PlayerCardArea key={i} player={i + 1} />)}
        {(['strategies', 'planets'] as const).map(kind => Object.entries(cards[kind]).map(([id, state]) => {
            const position = cardPosition(kind, id, state, cards);
            const planet = planets.find(p => p.name === id);
            if (!position || (kind === 'planets' && !planet)) return null;
            return <BoardCard key={`${kind}-${id}`} kind={kind} id={id} state={state} position={position} planet={planet} onChange={onChange} selected={selectedIds.includes(`board-card-${kind}-${id}`)} onSelect={onSelect} />;
        }))}
    </>;
}
