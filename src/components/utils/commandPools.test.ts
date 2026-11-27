import { getInitialPieces } from '../dragAndDrop/draggablePieceFactory';
import { closestPool, poolCenter, restoreCommandPools, sheetAxes, sheetHub } from './commandPools';
import { getHexGeometry, organizeOnHex } from './boardGeometry';
import { movePieces } from './movePieces';
import type { DragEndEvent } from '@dnd-kit/core';
import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';
import { referencePoints } from './pieceCoordinates';

it('starts each player with countable 3/3/2 pools', () => {
    const pieces = Object.values(getInitialPieces(6));
    for (let player = 1; player <= 6; player++) {
        const owned = pieces.filter(p => p.player === player);
        expect(owned.filter(p => p.commandPool === 'tactics')).toHaveLength(3);
        expect(owned.filter(p => p.commandPool === 'fleet')).toHaveLength(3);
        expect(owned.filter(p => p.commandPool === 'strategy')).toHaveLength(2);
        owned.forEach(piece => expect(closestPool(player, { x: piece.x!, y: piece.y! })).toBe(piece.commandPool));
        for (const pool of ['tactics', 'fleet', 'strategy'] as const) expect(closestPool(player, poolCenter(player, pool))).toBe(pool);
    }
});
it('keeps Fleet on screen-right for every player and uses loose, non-linear clusters', () => {
    const pieces = Object.values(getInitialPieces(6));
    for (let player = 1; player <= 6; player++) {
        const home = referencePoints[`p${player}h3`];
        const fleet = pieces.filter(p => p.player === player && p.commandPool === 'fleet');
        fleet.forEach(piece => expect(piece.x).toBeGreaterThan(home.x));
        const [a, b, c] = fleet;
        const cross = (b.x! - a.x!) * (c.y! - a.y!) - (b.y! - a.y!) * (c.x! - a.x!);
        expect(Math.abs(cross)).toBeGreaterThan(1);
    }
});
it('snaps selected counters to the nearest pool, updates totals, and leaves other players alone', () => {
    const pieces = getInitialPieces(6), point = poolCenter(1, 'strategy'), active = pieces['1-commandCounter-1'];
    const event = { active: { id: '1-commandCounter-1' }, over: { id: 'command-pools-1', data: { current: { isCommandPool: true, player: 1 } } }, delta: { x: point.x - active.x!, y: point.y - active.y! } } as unknown as DragEndEvent;
    const moved = movePieces(pieces, event, ['1-commandCounter-2', '1-commandCounter-1', '2-commandCounter-1'], 6);
    expect(Object.values(moved).filter(p => p.player === 1 && p.commandPool === 'strategy')).toHaveLength(4);
    expect(Object.values(moved).filter(p => p.player === 1 && p.commandPool === 'tactics')).toHaveLength(1);
    expect(moved['2-commandCounter-1']).toEqual(pieces['2-commandCounter-1']);
    expect(new Set(Object.values(moved).filter(p => p.player === 1).map(p => `${p.x},${p.y}`)).size).toBe(8);
});
it('removes a counter from its pool when moved to a system', () => {
    const pieces = getInitialPieces(6);
    const event = { active: { id: '1-commandCounter-1' }, over: { id: 'hex-0,0,0', data: { current: { isHex: true, hexKey: '0,0,0' } } }, delta: { x: 0, y: 0 } } as unknown as DragEndEvent;
    const moved = movePieces(pieces, event, [], 6);
    expect(moved['1-commandCounter-1'].commandPool).toBeUndefined();
    expect(moved['1-commandCounter-1'].hexKey).toBe('0,0,0');
});
it('migrates old saved command tokens by location without moving deployed tokens', () => {
    const center = poolCenter(2, 'fleet');
    const pieces: DraggablePiecePropsByUid = {
        home: { player: 2, name: 'commandCounter', pieceNumber: 1, ...center },
        deployed: { player: 2, name: 'commandCounter', pieceNumber: 2, x: 500, y: 500 },
    };
    const restored = restoreCommandPools(pieces);
    expect(restored.home.commandPool).toBe('fleet');
    expect(restored.deployed).toBe(pieces.deployed);
});
it('fans carriers across the narrow hull axis with visible spacing for every ship', () => {
    const pieces: DraggablePiecePropsByUid = {};
    for (let i = 1; i <= 4; i++) pieces[`1-carrier-${i}`] = { player: 1, name: 'carrier', pieceNumber: i, hexKey: '0,0,0' };
    const arranged = organizeOnHex(pieces, '0,0,0', getHexGeometry(0, 0));
    for (let i = 2; i <= 4; i++) {
        const current = arranged[`1-carrier-${i}`], previous = arranged[`1-carrier-${i - 1}`];
        expect(current.x! - previous.x!).toBeGreaterThan(14);
        expect(current.y! - previous.y!).toBeLessThan(-14);
        expect(current.x! - previous.x!).toBeCloseTo(-(current.y! - previous.y!));
    }
});


it('leaves source and unrelated pools exactly in place when tokens are removed', () => {
  const pieces = getInitialPieces(6);
  const point = poolCenter(1, 'strategy'), active = pieces['1-commandCounter-1'];
  const event = { active: { id: '1-commandCounter-1' }, over: { id: 'command-pools-1', data: { current: { isCommandPool: true, player: 1 } } }, delta: { x: point.x - active.x!, y: point.y - active.y! } } as unknown as DragEndEvent;
  const moved = movePieces(pieces, event, [], 6);
  Object.entries(pieces).forEach(([id, piece]) => {
    if (id !== '1-commandCounter-1' && !(piece.player === 1 && piece.commandPool === 'strategy')) expect(moved[id]).toEqual(piece);
  });
  const removed = movePieces(pieces, { ...event, over: { id: 'container-1-commandCounter', data: { current: {} } } } as DragEndEvent, [], 6);
  expect(removed['1-commandCounter-1']).toBeUndefined();
  Object.keys(removed).forEach(id => expect(removed[id]).toEqual(pieces[id]));
});

it('reserves only the bottom wedge for trade goods without moving command tokens', () => {
  const pieces = getInitialPieces(6);
  const event = { active: { id: 'container-shared-tradeGood' }, over: { id: 'command-pools-3', data: { current: { isCommandPool: true, player: 3 } } }, delta: { x: 0, y: 0 } } as unknown as DragEndEvent;
  const moved = movePieces(pieces, event, [], 6);
  expect(moved['1-tradeGood-1'].tradeGoodPlayer).toBe(3);
  expect(moved['1-tradeGood-1'].x).toBeLessThan(referencePoints.p3h3.x);
  expect(moved['1-tradeGood-1'].y).toBeGreaterThan(referencePoints.p3h3.y);
  Object.keys(pieces).forEach(id => expect(moved[id]).toBe(pieces[id]));
});

it('keeps a centered hexagonal hub and translates both diagonals onto its left edges', () => {
  expect(sheetHub.reduce((sum, p) => sum + p.x, 0) / 6).toBe(90);
  expect(sheetHub.reduce((sum, p) => sum + p.y, 0) / 6).toBe(80);
  const onLine = (point: {x:number;y:number}, line: {x:number;y:number}[]) => {
    const [a,b] = line;
    return (b.x-a.x)*(point.y-a.y)-(b.y-a.y)*(point.x-a.x);
  };
  expect(onLine(sheetHub[5], sheetAxes[0])).toBeCloseTo(0);
  expect(onLine(sheetHub[4], sheetAxes[0])).toBeCloseTo(0);
  expect(onLine(sheetHub[0], sheetAxes[1])).toBeCloseTo(0);
  expect(onLine(sheetHub[5], sheetAxes[1])).toBeCloseTo(0);
  expect(sheetAxes[2]).toEqual([{x:0,y:80},{x:180,y:80}]);
});
