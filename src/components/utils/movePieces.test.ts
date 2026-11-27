import type { DragEndEvent } from '@dnd-kit/core';
import { movePieces } from './movePieces';
import { getHexGeometry, selectInRectangle } from './boardGeometry';
import { getInitialPieces, COMMAND_COUNTERS_PRE_PLACED } from '../dragAndDrop/draggablePieceFactory';
import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';

function drop(active: string, over?: string, delta = { x: 30, y: 20 }): DragEndEvent {
    return { active: { id: active }, over: over ? { id: over, data: { current: over.startsWith('hex-') ? { isHex: true, hexKey: over.slice(4) } : {} } } : null, delta } as DragEndEvent;
}
const pieces: DraggablePiecePropsByUid = {
    '1-cruiser-1': { player: 1, name: 'cruiser', pieceNumber: 1, x: 10, y: 10 },
    '1-cruiser-2': { player: 1, name: 'cruiser', pieceNumber: 2, x: 20, y: 10 },
    '2-infantry-1': { player: 2, name: 'infantry', pieceNumber: 1, x: 30, y: 10 },
};
it('initializes fresh pieces with finite distinct coordinates for every player', () => {
    const first = getInitialPieces(6), second = getInitialPieces(6);
    expect(Object.keys(first)).toHaveLength(6 * COMMAND_COUNTERS_PRE_PLACED);
    for (let player = 1; player <= 6; player++) {
        const group = Object.values(first).filter(p => p.player === player);
        expect(group).toHaveLength(COMMAND_COUNTERS_PRE_PLACED);
        group.forEach(p => { expect(Number.isFinite(p.x)).toBe(true); expect(Number.isFinite(p.y)).toBe(true); });
        expect(new Set(group.map(p => `${p.x},${p.y}`)).size).toBe(COMMAND_COUNTERS_PRE_PLACED);
    }
    first['1-commandCounter-1'].x = -1;
    expect(second['1-commandCounter-1'].x).not.toBe(-1);
});
it('moves all selected pieces together in free space and leaves others alone', () => {
    const result = movePieces(pieces, drop('1-cruiser-1'), ['1-cruiser-1', '1-cruiser-2'], 6);
    expect(result['1-cruiser-1']).toMatchObject({ x: 40, y: 30 });
    expect(result['1-cruiser-2']).toMatchObject({ x: 50, y: 30 });
    expect(result['2-infantry-1']).toBe(pieces['2-infantry-1']);
    expect(pieces['1-cruiser-1'].x).toBe(10);
});
it('organizes a dropped group with existing pieces on a tile', () => {
    const center = getHexGeometry(0, 0);
    const result = movePieces({ ...pieces, '2-infantry-1': { ...pieces['2-infantry-1'], x: center.x, y: center.y } },
        drop('1-cruiser-1', 'hex-0,0,0'), ['1-cruiser-1', '1-cruiser-2'], 6);
    Object.values(result).forEach(p => {
        expect(p.hexKey).toBe('0,0,0');
        expect(Math.abs(p.x! - center.x)).toBeLessThan(70);
        expect(Math.abs(p.y! - center.y)).toBeLessThan(70);
    });
    expect(result['1-cruiser-1'].x).not.toBe(result['1-cruiser-2'].x);
});
it('returns only compatible selected pieces to a supply', () => {
    const result = movePieces(pieces, drop('1-cruiser-1', 'container-1-cruiser'), Object.keys(pieces), 6);
    expect(Object.keys(result)).toEqual(['2-infantry-1']);
});
it('spawns from a supply and respects the piece limit', () => {
    const result = movePieces({}, drop('container-1-flagship', 'hex-0,0,0'), [], 6);
    expect(result['1-flagship-1'].hexKey).toBe('0,0,0');
    expect(movePieces(result, drop('container-1-flagship', 'hex-1,0,-1'), [], 6)).toBe(result);
});
it('does not spawn when dropped back on the same supply', () => {
    expect(movePieces(pieces, drop('container-shared-tradeGood', 'container-shared-tradeGood'), [], 6)).toBe(pieces);
});
it('selects a rectangle in either drag direction', () => {
    expect(selectInRectangle(pieces, { x: 25, y: 15 }, { x: 5, y: 5 })).toEqual(['1-cruiser-1', '1-cruiser-2']);
});

it('uses the final board pointer position for TG drops even when collision data is stale', () => {
  const { commandSheetCenter } = require('./commandPools');
  const sheet = commandSheetCenter(1);
  const event = drop('container-shared-tradeGood', undefined, {x:999,y:999});
  event.active.data = { current: { pointerDrop: { x: sheet.x - 8, y: sheet.y + 50 } } };
  const result = movePieces({}, event, [], 6);
  expect(result['1-tradeGood-1'].tradeGoodPlayer).toBe(1);
  expect(result['1-tradeGood-1'].y).toBeGreaterThan(sheet.y);
  expect(Math.abs(result['1-tradeGood-1'].x! - sheet.x)).toBeLessThan(35);
});

it('centers a freely dropped selected group at the pointer rather than a scaled drag delta', () => {
  const event = drop('1-cruiser-1', undefined, {x:999,y:999});
  event.active.data = { current: { pointerDrop: { x: 50, y: 70 } } };
  const result = movePieces(pieces, event, ['1-cruiser-1','1-cruiser-2'], 6);
  expect(result['1-cruiser-1']).toMatchObject({x:50,y:70});
  expect(result['1-cruiser-2']).toMatchObject({x:60,y:70});
});

