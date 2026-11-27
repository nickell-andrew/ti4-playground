import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';
import { referencePoints } from './pieceCoordinates';
import { getHexGeometry } from './boardGeometry';

export function commandSheetCenter(player: number) {
    const axial = [[1,-4], [4,-3], [4,-1], [1,3], [-3,4], [-3,-1]][player - 1];
    return getHexGeometry(axial[0], axial[1]);
}

export type CommandPool = 'tactics' | 'fleet' | 'strategy';
export const commandPools: CommandPool[] = ['tactics', 'fleet', 'strategy'];
export const poolLabels = { tactics: 'Tactics', fleet: 'Fleet', strategy: 'Strategy' };
export const sheetVertices = [{ x: 45, y: 0 }, { x: 135, y: 0 }, { x: 180, y: 80 }, { x: 135, y: 160 }, { x: 45, y: 160 }, { x: 0, y: 80 }];
export const sheetHub = [{ x: 84, y: 80 - 32 / 3 }, { x: 96, y: 80 - 32 / 3 }, { x: 102, y: 80 }, { x: 96, y: 80 + 32 / 3 }, { x: 84, y: 80 + 32 / 3 }, { x: 78, y: 80 }];
export const sheetAxes = [
    [{ x: 39, y: 32 / 3 }, { x: 123, y: 160 }], // Parallel to TL–BR and aligned with the hub's lower-left edge.
    [{ x: 123, y: 0 }, { x: 39, y: 160 - 32 / 3 }], // TR–BL aligned with the hub's upper-left edge.
    [{ x: 0, y: 80 }, { x: 180, y: 80 }],
];
type SheetPoint = { x: number; y: number };
function clipRegion(polygon: SheetPoint[], distance: (p: SheetPoint) => number): SheetPoint[] {
    const clipped: SheetPoint[] = [];
    polygon.forEach((a, index) => {
        const b = polygon[(index + 1) % polygon.length], da = distance(a), db = distance(b);
        if (da >= 0) clipped.push(a);
        if ((da >= 0) !== (db >= 0)) {
            const t = da / (da - db);
            clipped.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
        }
    });
    return clipped;
}
const axisDistances = [(p: SheetPoint) => p.x - p.y * 0.5625 - 33, (p: SheetPoint) => p.x + p.y * 0.5625 - 123, (p: SheetPoint) => p.y - 80];
// Both diagonals are translated in parallel, tangent to the hub's left edges.
export const sheetRegions = [[1,-1,-1], [1,1,-1], [1,1,1], [-1,1,1], [-1,-1,1], [-1,-1,-1]].map(signs =>
    signs.reduce((polygon, sign, index) => clipRegion(polygon, p => sign * axisDistances[index](p)), sheetVertices));
export const sheetLabelPositions = sheetRegions.map(points => {
    let area = 0, x = 0, y = 0;
    points.forEach((a, index) => {
        const b = points[(index + 1) % points.length], cross = a.x * b.y - b.x * a.y;
        area += cross; x += (a.x + b.x) * cross; y += (a.y + b.y) * cross;
    });
    return { x: x / (3 * area), y: y / (3 * area) };
});
export const sheetCountPositions = [{ x: 84, y: 8 }, { x: 150, y: 44 }, { x: 150, y: 116 }];
const triangleIndex = { tactics: 0, fleet: 1, strategy: 2 };
function fitInTriangle(point: SheetPoint, triangle: SheetPoint[]) {
    const center = { x: triangle.reduce((sum, p) => sum + p.x, 0) / triangle.length, y: triangle.reduce((sum, p) => sum + p.y, 0) / triangle.length };
    let result = point;
    for (let attempt = 0; attempt < 20; attempt++) {
        const candidate = result;
        const fits = triangle.every((a, index) => {
            const b = triangle[(index + 1) % triangle.length];
            const length = Math.hypot(b.x - a.x, b.y - a.y);
            return length < 0.001 || ((b.x - a.x) * (candidate.y - a.y) - (b.y - a.y) * (candidate.x - a.x)) / length >= 9;
        });
        if (fits) return result;
        result = { x: result.x * 0.82 + center.x * 0.18, y: result.y * 0.82 + center.y * 0.18 };
    }
    return result;
}
export function poolCenter(player: number, pool: CommandPool) {
    // Pools keep the same screen orientation for every seat: top/right/bottom.
    const base = commandSheetCenter(player), center = sheetLabelPositions[triangleIndex[pool]];
    return { x: base.x + center.x - 90, y: base.y + center.y - 80 };
}
export function closestPool(player: number, point: { x: number; y: number }): CommandPool {
    const home = commandSheetCenter(player), local = { x: point.x - home.x + 90, y: point.y - home.y + 80 };
    const region = sheetRegions.slice(0, 3).findIndex(polygon => polygon.every((a, index) => {
        const b = polygon[(index + 1) % polygon.length];
        return (b.x - a.x) * (local.y - a.y) - (b.y - a.y) * (local.x - a.x) >= -0.001;
    }));
    if (region >= 0) return commandPools[region];
    return commandPools.reduce((best, pool) => {
        const a = poolCenter(player, best), b = poolCenter(player, pool);
        return Math.hypot(point.x - b.x, point.y - b.y) < Math.hypot(point.x - a.x, point.y - a.y) ? pool : best;
    });
}
export function organizeCommandPools(pieces: DraggablePiecePropsByUid, player: number, pools: CommandPool[] = commandPools) {
    const result = { ...pieces };
    pools.forEach(pool => {
        const ids = Object.keys(pieces).filter(id => pieces[id].player === player && pieces[id].name === 'commandCounter' && pieces[id].commandPool === pool)
            .sort((a, b) => pieces[a].pieceNumber - pieces[b].pieceNumber);
        ids.forEach((id, index) => {
            // Stable loose clusters resemble tokens set down by hand. The
            // golden-angle fan exposes edges without rigid rows or randomness
            // that makes pieces jump on every render.
            const angle = index * 2.399963 + (player + commandPools.indexOf(pool)) * 0.37;
            const radius = Math.min(23, 12 * Math.sqrt(index));
            const offset = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.85 };
            const center = poolCenter(player, pool);
            const home = commandSheetCenter(player);
            const local = fitInTriangle({ x: center.x - home.x + offset.x + 90, y: center.y - home.y + offset.y + 80 }, sheetRegions[triangleIndex[pool]]);
            result[id] = { ...pieces[id], x: home.x + local.x - 90, y: home.y + local.y - 80 };
        });
    });
    return result;
}

export function organizeTradeGoods(pieces: DraggablePiecePropsByUid, player: number) {
    const result = { ...pieces }, home = commandSheetCenter(player);
    for (const name of ['tradeGood', 'tradeGoodBundle']) {
        const ids = Object.keys(pieces).filter(id => pieces[id].name === name && pieces[id].tradeGoodPlayer === player).sort((a, b) => pieces[a].pieceNumber - pieces[b].pieceNumber);
        ids.forEach((id, index) => {
            const angle = index * 2.399963 + 0.5, radius = Math.min(13, 8 * Math.sqrt(index));
            const local = fitInTriangle({ x: (name === 'tradeGood' ? 72 : 94) + Math.cos(angle) * radius, y: 129 + Math.sin(angle) * radius * 0.7 }, sheetRegions[3]);
            result[id] = { ...pieces[id], x: home.x + local.x - 90, y: home.y + local.y - 80 };
        });
    }
    return result;
}

// Old saves only record coordinates; recognize tokens that are still in their home pool hex.
export function restoreCommandPools(pieces: DraggablePiecePropsByUid) {
    const result = { ...pieces };
    Object.entries(pieces).forEach(([id, piece]) => {
        if (piece.name !== 'commandCounter' || piece.hexKey) return;
        const home = referencePoints[`p${piece.player}h3`];
        if (!home || piece.x === undefined || piece.y === undefined) return;
        if (!piece.commandPool && Math.hypot(piece.x - home.x, piece.y - home.y) > 90) return;
        const commandPool = commandPools.includes(piece.commandPool!) ? piece.commandPool! : closestPool(piece.player, { x: piece.x, y: piece.y });
        result[id] = { ...piece, commandPool };
    });
    return result;
}
