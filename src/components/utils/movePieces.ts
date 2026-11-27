import type { DragEndEvent } from '@dnd-kit/core';
import type { DraggablePiecePropsByUid, DraggablePieceProps } from '../dragAndDrop/draggablePieceUtils';
import { getUidFromDraggablePieceProps } from '../dragAndDrop/draggablePieceUtils';
import { maxPieceCounts } from '../dragAndDrop/draggablePieceFactory';
import { getContainerCoordinates, tgContainerPositions } from './pieceCoordinates';
import { containsPoint, getHexGeometry, organizeOnHex } from './boardGeometry';
import { generateTiles } from './generateTiles';
import { ALL_PIECES, pieceSize } from '../consts';
import { closestPool, organizeCommandPools, organizeTradeGoods, CommandPool, commandSheetCenter } from './commandPools';
import { isGroundPiece, planetTargets } from './systemTargets';
import type { TILE_NUMBER_AND_ROTATION } from './mapData';

export function movePieces(previous: DraggablePiecePropsByUid, event: DragEndEvent, selection: string[], playerCount: number, hexTiles: Record<string, TILE_NUMBER_AND_ROTATION> = {}): DraggablePiecePropsByUid {
    const activeId = String(event.active.id);
    let overId = event.over ? String(event.over.id) : '';
    let targetData = event.over?.data.current;
    const pointer = event.active.data?.current?.pointerDrop as { x: number; y: number } | undefined;
    if (pointer) {
        const parts = activeId.split('-');
        const shared = activeId.startsWith('container-shared-');
        const active = previous[activeId] ?? { player: shared ? 1 : Number(parts[1]), name: parts[2] as ALL_PIECES };
        const isTG = active.name === 'tradeGood' || active.name === 'tradeGoodBundle';
        const supply = isTG ? tgContainerPositions[active.name] : getContainerCoordinates(active.player, active.name);
        const [width, height] = pieceSize[active.name];
        overId = ''; targetData = undefined;
        if (Math.abs(pointer.x - supply.x) <= width / 2 + 5 && Math.abs(pointer.y - supply.y) <= height / 2 + 5) {
            overId = isTG ? `container-shared-${active.name}` : `container-${active.player}-${active.name}`;
        } else {
            const sheetPlayer = (isTG ? Array.from({ length: playerCount }, (_, i) => i + 1) : active.name === 'commandCounter' ? [active.player] : [])
                .find(player => containsPoint(pointer, commandSheetCenter(player)));
            if (sheetPlayer) {
                overId = `command-pools-${sheetPlayer}`; targetData = { isCommandPool: true, player: sheetPlayer };
            } else {
                const hex = generateTiles(playerCount).filter(h => !h.extraSystem).find(h => containsPoint(pointer, getHexGeometry(h.q, h.r)));
                if (hex) {
                    const hexKey = `${hex.q},${hex.r},${hex.s}`;
                    const planet = isGroundPiece(active.name) ? planetTargets(hexKey, hexTiles[hexKey]).find(p => Math.hypot(pointer.x - p.x, pointer.y - p.y) <= 25) : undefined;
                    overId = planet ? `planet-${hexKey}-${planet.name}` : `hex-${hexKey}`;
                    targetData = { isHex: true, hexKey, isPlanet: !!planet, planetName: planet?.name };
                }
            }
        }
    }
    if (activeId === overId) return previous;
    const result = { ...previous };
    let ids: string[];
    if (activeId.startsWith('container-')) {
        const shared = activeId.startsWith('container-shared-');
        const [, playerText, nameText] = activeId.split('-');
        const name = (shared ? activeId.replace('container-shared-', '') : nameText) as ALL_PIECES;
        const player = shared ? 1 : Number(playerText);
        const existing = Object.values(previous).filter(p => p.name === name && (shared || p.player === player));
        const max = maxPieceCounts[name];
        if (!max || existing.length >= max) return previous;
        const used = new Set(existing.map(p => p.pieceNumber));
        let pieceNumber = 1;
        while (used.has(pieceNumber)) pieceNumber++;
        const origin = shared ? tgContainerPositions[name] : getContainerCoordinates(player, name);
        const piece: DraggablePieceProps = { player, name, pieceNumber, ...origin };
        const uid = String(getUidFromDraggablePieceProps(piece));
        result[uid] = piece;
        ids = [uid];
    } else {
        if (!previous[activeId]) return previous;
        ids = selection.includes(activeId) ? selection.filter(id => previous[id]) : [activeId];
    }
    if (pointer) {
        const origin = result[activeId] ?? result[ids[0]];
        event = { ...event, delta: { x: pointer.x - (origin.x ?? 0), y: pointer.y - (origin.y ?? 0) } };
    }
    const affected = new Set<string>();
    const destinationPools = new Map<number, Set<CommandPool>>();
    const destinationTradeGoods = new Set<number>();
    const arrangePool = (player: number, pool: CommandPool) => {
        const pools = destinationPools.get(player) ?? new Set<CommandPool>();
        pools.add(pool);
        destinationPools.set(player, pools);
    };
    ids.forEach(id => { if (result[id].hexKey) affected.add(result[id].hexKey!); });
    if (overId.startsWith('container-')) {
        // A supply accepts only its own kind. Other selected pieces stay put.
        if (activeId.startsWith('container-')) return previous;
        const shared = overId.startsWith('container-shared-');
        const [, playerText, name] = overId.split('-');
        const targetName = shared ? overId.replace('container-shared-', '') : name;
        ids.forEach(id => {
            if (result[id].name === targetName && (shared || result[id].player === Number(playerText))) delete result[id];
        });
    } else if (targetData?.isCommandPool) {
        const player = Number(targetData.player);
        const active = result[activeId] ?? result[ids[0]];
        const pool = closestPool(player, { x: (active.x ?? 0) + event.delta.x, y: (active.y ?? 0) + event.delta.y });
        ids.forEach(id => {
            const piece = result[id];
            if (piece.name === 'commandCounter' && piece.player === player) result[id] = { ...piece, commandPool: pool, hexKey: undefined, layoutScale: undefined };
            if (piece.name === 'tradeGood' || piece.name === 'tradeGoodBundle') {
                result[id] = { ...piece, tradeGoodPlayer: player, hexKey: undefined, layoutScale: undefined };
                destinationTradeGoods.add(player);
            }
        });
        if (active.name === 'commandCounter') arrangePool(player, pool);
    } else {
        const target = targetData;
        const targetKey: string | undefined = target?.isHex ? target.hexKey : undefined;
        const hexagons = generateTiles(playerCount).filter(hex => !hex.extraSystem);
        // Include legacy pieces already in the destination system in its layout.
        if (targetKey) {
            const [q, r] = targetKey.split(',').map(Number);
            const geometry = getHexGeometry(q, r);
            Object.entries(result).forEach(([id, p]) => {
                if (!ids.includes(id) && !p.hexKey && p.x !== undefined && p.y !== undefined && containsPoint({ x: p.x, y: p.y }, geometry)) result[id] = { ...p, hexKey: targetKey };
            });
        }
        ids.forEach(id => {
            const piece = result[id];
            const x = (piece.x ?? 0) + event.delta.x, y = (piece.y ?? 0) + event.delta.y;
            const home = commandSheetCenter(piece.player);
            if (!targetKey && piece.name === 'commandCounter' && home && Math.hypot(x - home.x, y - home.y) <= 85) {
                result[id] = { ...piece, commandPool: closestPool(piece.player, { x, y }), hexKey: undefined, layoutScale: undefined };
                arrangePool(piece.player, result[id].commandPool!);
                return;
            }
            const hex = targetKey ? null : hexagons.find(h => containsPoint({ x, y }, getHexGeometry(h.q, h.r)));
            const hexKey = targetKey ?? (hex ? `${hex.q},${hex.r},${hex.s}` : undefined);
            result[id] = { ...piece, x, y, hexKey, commandPool: undefined, layoutScale: undefined, tradeGoodPlayer: undefined,
                planet: targetKey && target?.isPlanet && isGroundPiece(piece.name) ? target.planetName : undefined };
            if (hexKey) affected.add(hexKey);
        });
    }
    let organized = result;
    affected.forEach(key => {
        const [q, r] = key.split(',').map(Number);
        organized = organizeOnHex(organized, key, getHexGeometry(q, r), planetTargets(key, hexTiles[key]));
    });
    destinationPools.forEach((pools, player) => { organized = organizeCommandPools(organized, player, Array.from(pools)); });
    destinationTradeGoods.forEach(player => { organized = organizeTradeGoods(organized, player); });
    return organized;
}
