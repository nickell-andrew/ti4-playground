import React from 'react';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import type { DraggablePiecePropsByUid } from './draggablePieceUtils';
import { commandPools, poolLabels, sheetRegions, sheetAxes, sheetHub, sheetLabelPositions, sheetCountPositions, commandSheetCenter } from '../utils/commandPools';
import { PIECE_INSET, getHexGeometry, fitsHexRectangle } from '../utils/boardGeometry';

export function CommandPools({ player, pieces }: { player: number; pieces: DraggablePiecePropsByUid }) {
    const { active } = useDndContext();
    const activeId = String(active?.id ?? '');
    const accepts = activeId.startsWith(`${player}-commandCounter-`) || activeId === `container-${player}-commandCounter` || activeId.includes('tradeGood');
    const { isOver, setNodeRef } = useDroppable({ id: `command-pools-${player}`, disabled: !accepts,
        data: { isCommandPool: true, player } });
    const home = commandSheetCenter(player);
    const tradeGoods = Object.values(pieces).filter(piece => piece.x !== undefined && piece.y !== undefined && Math.abs(piece.x - home.x) <= 90 && Math.abs(piece.y - home.y) <= 90)
        .reduce((sum, piece) => sum + (piece.name === 'tradeGood' ? 1 : piece.name === 'tradeGoodBundle' ? 3 : 0), 0);
    return <>
        <div ref={setNodeRef} className={`command-pool-target${isOver ? ' over' : ''}`} style={{ left: home.x + PIECE_INSET - 90, top: home.y + PIECE_INSET - 80 }}>
            <svg viewBox="0 0 180 160" aria-hidden="true">
                {sheetRegions.map((points, index) => <polygon key={index} points={points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill={index <= 2 ? '#293e4ff2' : '#172735f2'} />)}
                {sheetAxes.map(([a, b], index) => <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8ab7ce" strokeWidth="1.2" />)}
                <polygon points={sheetHub.map(p => `${p.x},${p.y}`).join(' ')} fill="#102639" stroke="#8ab7ce" strokeWidth="1.2" />
                <polygon points={sheetHub.map(p => `${90 + (p.x - 90) * 0.52},${80 + (p.y - 80) * 0.52}`).join(' ')} fill="#07131f" stroke="#537a96" strokeWidth="0.8" />
            </svg>
        </div>
        {commandPools.map((pool, index) => {
            const label = sheetLabelPositions[index];
            const count = Object.values(pieces).filter(piece => piece.player === player && piece.name === 'commandCounter' && piece.commandPool === pool).length;
            const edge = sheetCountPositions[index];
            return <React.Fragment key={pool}><span className="command-pool-label"
                style={{ left: home.x + label.x - 90 + PIECE_INSET, top: home.y + label.y - 80 + PIECE_INSET }}>{poolLabels[pool]}</span>
                <b className="command-pool-count" aria-label={`Player ${player} ${poolLabels[pool]}: ${count} tokens`}
                    style={{ left: home.x + edge.x - 90 + PIECE_INSET, top: home.y + edge.y - 80 + PIECE_INSET }}>{count}</b></React.Fragment>;
        })}
        <span className="command-pool-label trade-goods-label" style={{ left: home.x + sheetLabelPositions[3].x - 90 + PIECE_INSET, top: home.y + sheetLabelPositions[3].y - 80 + PIECE_INSET }}>Trade Goods</span>
        <b className="command-pool-count" data-testid="trade-goods-total" aria-label={`Player ${player} Trade Goods: ${tradeGoods}`} style={{ left: home.x - 6 + PIECE_INSET, top: home.y + 72 + PIECE_INSET }}>{tradeGoods}</b>
    </>;
}

export function PieceGroupCounts({ pieces }: { pieces: DraggablePiecePropsByUid }) {
    const groups = new Map<string, { count: number; x: number; y: number; player: number; name: string }>();
    Object.values(pieces).forEach(piece => {
        if (!piece.hexKey || piece.x === undefined || piece.y === undefined) return;
        const key = `${piece.hexKey}:${piece.planet ?? 'space'}:${piece.player}:${piece.name}`, previous = groups.get(key);
        groups.set(key, { count: (previous?.count ?? 0) + 1, x: Math.max(previous?.x ?? -Infinity, piece.x), y: Math.min(previous?.y ?? Infinity, piece.y), player: piece.player, name: piece.name });
    });
    return <>{Array.from(groups.entries()).map(([id, group]) => {
        const [q, r] = id.split(':')[0].split(',').map(Number), hex = getHexGeometry(q, r);
        let x = group.x + 14, y = group.y - 18;
        for (let attempt = 0; attempt < 20 && !fitsHexRectangle({ x, y }, 20, 20, hex); attempt++) {
            x = x * 0.85 + hex.x * 0.15; y = y * 0.85 + hex.y * 0.15;
        }
        return <span key={id} className="piece-group-count" style={{ left: x + PIECE_INSET, top: y + PIECE_INSET }}
            aria-label={`Player ${group.player} ${group.name}: ${group.count}`}>{group.count}</span>;
    })}</>;
}
