import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';
import { pieceSize, ALL_PIECES } from '../consts';
import type { PlanetTarget } from './systemTargets';

// Ship artwork runs from upper left to lower right. Fan across the hull,
// perpendicular to its long axis, so every silhouette stays recognizable.
export const stackAxis = (name: ALL_PIECES) => {
    if (['carrier', 'cruiser', 'destroyer', 'dreadnought', 'flagship', 'fighter'].includes(name)) return { x: 1, y: -1 };
    if (name === 'spacedock') return { x: 0, y: 1 };
    return { x: 1, y: 0 };
};

// Saved piece positions use the original board's 20px inset.
export const PIECE_INSET = 20;
export const BOARD_MARGIN = 200;
export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1880;
export function getHexGeometry(q: number, r: number, boardSize = 1000) {
    const scale = Math.min(boardSize, 1000) / 1000;
    const width = 180 * scale, height = 160 * scale;
    const centerX = (q + 1.1) * width * 0.751 + boardSize / 2;
    const centerY = 240 + r * height * 0.995 + q * height * 0.995 * 0.5 + boardSize / 2;
    return { left: centerX - width / 2, top: centerY - height / 2, width, height,
        x: centerX - PIECE_INSET, y: centerY - PIECE_INSET };
}

export function containsPoint(point: { x: number; y: number }, hex: ReturnType<typeof getHexGeometry>) {
    const dx = Math.abs(point.x - hex.x), dy = Math.abs(point.y - hex.y);
    return dy <= hex.height / 2 && dx <= hex.width / 2 - dy * hex.width / (2 * hex.height);
}

export function fitsHexRectangle(point: { x: number; y: number }, width: number, height: number, hex: ReturnType<typeof getHexGeometry>) {
    return [-1, 1].every(sx => [-1, 1].every(sy => containsPoint({ x: point.x + sx * width / 2, y: point.y + sy * height / 2 }, hex)));
}

function availableSpaceRectangles(hex: ReturnType<typeof getHexGeometry>, planets: PlanetTarget[]) {
    const rectangles: { x: number; y: number; width: number; height: number; aspect: number }[] = [];
    const aspects = [0.4, 0.65, 1, 1.5, 2.5, 4];
    for (let dx = -60; dx <= 60; dx += 12) for (let dy = -60; dy <= 60; dy += 12) {
        const point = { x: hex.x + dx, y: hex.y + dy };
        for (const aspect of aspects) {
            const maxWidth = Math.min(132, 112 * aspect), maxHeight = maxWidth / aspect;
            let low = 0, high = 1;
            for (let attempt = 0; attempt < 10; attempt++) {
                const scale = (low + high) / 2, width = maxWidth * scale, height = maxHeight * scale;
                const clear = fitsHexRectangle(point, width + 10, height + 10, hex) && planets.every(planet =>
                    Math.hypot(Math.max(0, Math.abs(point.x - planet.x) - width / 2), Math.max(0, Math.abs(point.y - planet.y) - height / 2)) >= 25);
                if (clear) low = scale; else high = scale;
            }
            const width = maxWidth * low, height = maxHeight * low;
            if (width >= 10 && height >= 10) rectangles.push({ ...point, width, height, aspect });
        }
    }
    // Keep several shapes, since the largest area alone may make long ship
    // stacks smaller than a narrower, taller pocket of open space would.
    return aspects.flatMap(aspect => rectangles.filter(rect => rect.aspect === aspect).sort((a, b) => b.width * b.height - a.width * a.height).slice(0, 3));
}

function pieceBounds(pieces: DraggablePiecePropsByUid) {
    const entries = Object.values(pieces).filter(p => p.x !== undefined && p.y !== undefined);
    if (!entries.length) return null;
    const left = Math.min(...entries.map(p => p.x! - pieceSize[p.name][0] * (p.layoutScale ?? 1) / 2));
    const right = Math.max(...entries.map(p => p.x! + pieceSize[p.name][0] * (p.layoutScale ?? 1) / 2));
    const top = Math.min(...entries.map(p => p.y! - pieceSize[p.name][1] * (p.layoutScale ?? 1) / 2));
    const bottom = Math.max(...entries.map(p => p.y! + pieceSize[p.name][1] * (p.layoutScale ?? 1) / 2));
    return { x: (left + right) / 2, y: (top + bottom) / 2, width: right - left, height: bottom - top };
}

function makeStacks(pieces: DraggablePiecePropsByUid) {
    const groups = new Map<string, string[]>();
    Object.entries(pieces).sort(([, a], [, b]) => a.player - b.player || a.name.localeCompare(b.name) || a.pieceNumber - b.pieceNumber).forEach(([id, piece]) => {
        const key = `${piece.player}-${piece.name}`;
        groups.set(key, [...(groups.get(key) ?? []), id]);
    });
    return Array.from(groups.values()).flatMap(group => Array.from({ length: Math.ceil(group.length / 4) }, (_, index) => group.slice(index * 4, index * 4 + 4))).map(ids => {
        const name = pieces[ids[0]].name, axis = stackAxis(name), step = 18;
        const span = step * (ids.length - 1), [width, height] = pieceSize[name];
        return { ids, axis, step, width: width + Math.abs(axis.x) * span, height: height + Math.abs(axis.y) * span };
    });
}

function fleetAroundGround(pieces: DraggablePiecePropsByUid, hex: ReturnType<typeof getHexGeometry>, obstacles: NonNullable<ReturnType<typeof pieceBounds>>[]) {
    const stacks = makeStacks(pieces).sort((a, b) => b.width * b.height - a.width * a.height);
    const points: { x: number; y: number }[] = [];
    for (let dx = -72; dx <= 72; dx += 8) for (let dy = -64; dy <= 64; dy += 8) points.push({ x: hex.x + dx, y: hex.y + dy });
    points.sort((a, b) => Math.hypot(a.x - hex.x, a.y - hex.y) - Math.hypot(b.x - hex.x, b.y - hex.y));
    for (let scale = 1; scale > 0.08; scale *= 0.92) {
        const occupied = obstacles.map(rect => ({ ...rect, width: rect.width * 0.65, height: rect.height * 0.65 })), result: DraggablePiecePropsByUid = {};
        for (const stack of stacks) {
            const width = stack.width * scale, height = stack.height * scale;
            // Sprite corners are mostly transparent. Let stacks share those
            // corners and overlap planet art, while leaving the ground groups'
            // centers clear. Ground art is also drawn above ships.
            const point = points.find(candidate => fitsHexRectangle(candidate, width + 8, height + 8, hex) && occupied.every(rect =>
                Math.abs(candidate.x - rect.x) >= (width * 0.7 + rect.width) / 2 + 2 || Math.abs(candidate.y - rect.y) >= (height * 0.7 + rect.height) / 2 + 2));
            if (!point) break;
            occupied.push({ ...point, width: width * 0.7, height: height * 0.7 });
            stack.ids.forEach((id, index) => {
                const fan = (index - (stack.ids.length - 1) / 2) * stack.step * scale;
                result[id] = { ...pieces[id], x: point.x + stack.axis.x * fan, y: point.y + stack.axis.y * fan, layoutScale: scale };
            });
        }
        if (Object.keys(result).length === Object.keys(pieces).length) return result;
    }
    return organizeOnHex(pieces, Object.values(pieces)[0]?.hexKey ?? '0,0,0', hex, undefined, { width: 40, height: 40 });
}

export function organizeOnHex(pieces: DraggablePiecePropsByUid, hexKey: string, center: { x: number; y: number }, planets?: PlanetTarget[], size = { width: 126, height: 108 }): DraggablePiecePropsByUid {
    if (planets?.length) {
        let result = { ...pieces };
        const [q, r] = hexKey.split(',').map(Number), hex = getHexGeometry(q, r);
        const spacePieces = Object.fromEntries(Object.entries(pieces).filter(([, p]) => p.hexKey === hexKey && (!p.planet || !planets.some(planet => planet.name === p.planet))));
        Object.keys(spacePieces).forEach(id => { spacePieces[id] = { ...spacePieces[id], planet: undefined }; });
        const spaceGround = Object.fromEntries(Object.entries(spacePieces).filter(([, p]) => ['infantry', 'mech', 'pds', 'spacedock'].includes(p.name)));
        const spaceFleet = Object.fromEntries(Object.entries(spacePieces).filter(([, p]) => !['infantry', 'mech', 'pds', 'spacedock'].includes(p.name)));
        const obstacles: NonNullable<ReturnType<typeof pieceBounds>>[] = [];
        if (Object.keys(spaceGround).length) {
            const rectangles = availableSpaceRectangles(hex, planets);
            let best: DraggablePiecePropsByUid | null = null, bestScale = -1;
            rectangles.forEach(rectangle => {
                const arranged = organizeOnHex(spaceGround, hexKey, rectangle, undefined, rectangle);
                const scale = Math.min(...Object.values(arranged).map(piece => piece.layoutScale ?? 1));
                if (scale > bestScale) { best = arranged; bestScale = scale; }
            });
            const ground = best ?? organizeOnHex(spaceGround, hexKey, center, undefined, { width: 30, height: 30 });
            result = { ...result, ...ground };
            const bounds = pieceBounds(ground); if (bounds) obstacles.push(bounds);
        }
        planets.forEach(planet => {
            const ground = Object.fromEntries(Object.entries(pieces).filter(([, p]) => p.hexKey === hexKey && p.planet === planet.name));
            let scale = 1;
            while (scale > 0.1 && !fitsHexRectangle(planet, 48 * scale + 8, 42 * scale + 8, hex)) scale *= 0.9;
            const arranged = organizeOnHex(ground, hexKey, planet, undefined, { width: 48 * scale, height: 42 * scale });
            result = { ...result, ...arranged };
            const bounds = pieceBounds(arranged); if (bounds) obstacles.push(bounds);
        });
        if (Object.keys(spaceFleet).length) result = { ...result, ...fleetAroundGround(spaceFleet, hex, obstacles) };
        return result;
    }
    const result = { ...pieces };
    const stacks = makeStacks(Object.fromEntries(Object.entries(pieces).filter(([, p]) => p.hexKey === hexKey))).sort((a, b) => b.height - a.height || b.width - a.width);
    if (!stacks.length) return result;
    // Pack stacks in columns, choosing the arrangement that keeps their artwork
    // largest. A tall ship stack can sit beside several smaller ground stacks.
    const layouts = Array.from({ length: Math.min(4, stacks.length) }, (_, count) => {
        const columns = Array.from({ length: count + 1 }, () => ({ stacks: [] as typeof stacks, width: 0, height: 0 }));
        stacks.forEach(stack => {
            const column = columns.reduce((best, next) => next.height < best.height ? next : best);
            column.stacks.push(stack); column.width = Math.max(column.width, stack.width);
            column.height += stack.height + (column.stacks.length > 1 ? 8 : 0);
        });
        const width = columns.reduce((sum, column) => sum + column.width, 0) + 8 * (columns.length - 1);
        const height = Math.max(...columns.map(column => column.height));
        return { columns, width, height, scale: Math.min(1, size.width / width, size.height / height) };
    });
    const layout = layouts.reduce((best, next) => next.scale > best.scale ? next : best);
    let left = -layout.width / 2;
    layout.columns.forEach(column => {
        let top = -column.height / 2;
        column.stacks.forEach(stack => {
            stack.ids.forEach((id, index) => {
                const fan = (index - (stack.ids.length - 1) / 2) * stack.step;
                result[id] = { ...pieces[id], layoutScale: layout.scale,
                    x: center.x + (left + column.width / 2 + stack.axis.x * fan) * layout.scale,
                    y: center.y + (top + stack.height / 2 + stack.axis.y * fan) * layout.scale };
            });
            top += stack.height + 8;
        });
        left += column.width + 8;
    });
    return result;
}

export function selectInRectangle(pieces: Record<string, { x?: number; y?: number }>, start: { x: number; y: number }, end: { x: number; y: number }) {
    return Object.entries(pieces).filter(([, p]) => p.x !== undefined && p.y !== undefined &&
        p.x >= Math.min(start.x, end.x) && p.x <= Math.max(start.x, end.x) &&
        p.y >= Math.min(start.y, end.y) && p.y <= Math.max(start.y, end.y)).map(([id]) => id);
}
