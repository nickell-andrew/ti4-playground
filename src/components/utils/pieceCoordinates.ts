import { Coordinates } from "@dnd-kit/utilities";
import { allPieces } from '../consts';
import type { DraggablePieceProps } from '../dragAndDrop/draggablePieceUtils';

export type CoordinateOffsets = {
    [allPieces.Carrier]: Coordinates;
    [allPieces.CommandCounter]: Coordinates;
    [allPieces.Cruiser]: Coordinates;
    [allPieces.Mech]: Coordinates;
    [allPieces.Infantry]: Coordinates;
    [allPieces.Dreadnought]: Coordinates;
    [allPieces.Destroyer]: Coordinates;
    [allPieces.Fighter]: Coordinates;
    [allPieces.Flagship]: Coordinates;
    [allPieces.Spacedock]: Coordinates;
    [allPieces.PDS]: Coordinates;
    [allPieces.Warsun]: Coordinates;
}

type columns = 'col-4' | 'col-3' | 'col-2' | 'col-1' | 'col0' | 'col1' | 'col3' | 'col4';
type rows = 'row-8' | 'row-7' | 'row-5' | 'row-4' | 'row-2' | 'row0' | 'row2' | 'row4' | 'row5' | 'row7' | 'row8';

export const measurements: Record<columns | rows, number> = {
    'col-4': 90,
    'col-3': 223,
    'col-2': 391,
    'col-1': 494,
    'col0': 627,
    'col1': 764,
    'col3': 1035,
    'col4': 1170,

    'row-8': 70,
    'row-7': 150,
    'row-5': 310,
    'row-4': 390,
    'row-2': 550,
    'row0': 710,
    'row2': 870,
    'row4': 1030,
    'row5': 1110,
    'row7': 1270,
    'row8': 1350,
};

export const referencePoints: Record<string, Coordinates> = {
    mecatol: { x: measurements['col0'], y: measurements['row0'] },
    p1h1: { x: measurements['col-1'], y: measurements['row-7'] },
    p1h2: { x: measurements['col0'], y: measurements['row-8'] },
    p1h3: { x: measurements['col1'], y: measurements['row-7'] },
    p2h1: { x: measurements['col3'], y: measurements['row-5'] },
    p2h2: { x: measurements['col4'], y: measurements['row-4'] },
    p2h3: { x: measurements['col4'], y: measurements['row-2'] },
    p3h1: { x: measurements['col3'], y: measurements['row5'] },
    p3h2: { x: measurements['col4'], y: measurements['row4'] },
    p3h3: { x: measurements['col4'], y: measurements['row2'] },
    p4h1: { x: measurements['col-1'], y: measurements['row7'] },
    p4h2: { x: measurements['col0'], y: measurements['row8'] },
    p4h3: { x: measurements['col1'], y: measurements['row7'] },
    p5h1: { x: measurements['col-4'], y: measurements['row2'] },
    p5h2: { x: measurements['col-4'], y: measurements['row4'] },
    p5h3: { x: measurements['col-3'], y: measurements['row5'] },
    p6h1: { x: measurements['col-4'], y: measurements['row-2'] },
    p6h2: { x: measurements['col-4'], y: measurements['row-4'] },
    p6h3: { x: measurements['col-3'], y: measurements['row-5'] },
};

// Token positions relative to hex center, in player-local space:
// "up" = away from board center, "right" = clockwise from up.
// 3 tokens at top, 3 at upper-right, 2 at lower-right.
// These are rotated per player using playerAngleDeg below.
const tokenLocalOffsets: Coordinates[] = [
    // top group (3) — spread left-to-right across the top edge
    { x: -25, y: -52 },
    { x:   0, y: -60 },
    { x:  25, y: -52 },
    // upper-right group (3) — along the upper-right face
    { x:  52, y: -25 },
    { x:  60, y:   0 },
    { x:  52, y:  25 },
    // lower-right group (2) — along the lower-right face
    { x:  25, y:  52 },
    { x:   0, y:  60 },
];

// Rotation angle (degrees, clockwise) for each player's home orientation.
// Player 1 is at the top (faces down), each subsequent player is +60°.
const playerAngleDeg: Record<number, number> = {
    1: 0,
    2: 60,
    3: 120,
    4: 180,
    5: 240,
    6: 300,
};

function rotateOffset(offset: Coordinates, angleDeg: number): Coordinates {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        x: Math.round(offset.x * cos - offset.y * sin),
        y: Math.round(offset.x * sin + offset.y * cos),
    };
}

// Build pieceOffsetInHex for command counters 1-8 × 6 players
// Key format: "commandCounter{n}_p{player}" for per-player, fallback to generic for p1
export const getPieceOffsetForPlayer = (name: string, pieceNumber: number, player: number): Coordinates => {
    if (name === 'commandCounter' && pieceNumber >= 1 && pieceNumber <= 8) {
        const localOffset = tokenLocalOffsets[pieceNumber - 1];
        const angle = playerAngleDeg[player] ?? 0;
        return rotateOffset(localOffset, angle);
    }
    return { x: 0, y: 0 };
};

// Legacy record kept for any code that still references it directly (player 1 only)
export const pieceOffsetInHex: Record<string, Coordinates> = Object.fromEntries(
    tokenLocalOffsets.map((offset, i) => [`commandCounter${i + 1}`, offset])
);

export const coordOffsetsAllPieces: CoordinateOffsets = {
    [allPieces.Carrier]: { x: 25, y: 40 },
    [allPieces.Cruiser]: { x: -45, y: 5 },
    [allPieces.Mech]: { x: 35, y: -35 },
    [allPieces.Infantry]: { x: 0, y: -45 },
    [allPieces.Dreadnought]: { x: -40, y: 50 },
    [allPieces.Destroyer]: { x: -35, y: -35 },
    [allPieces.Fighter]: { x: 55, y: 10 },
    [allPieces.Flagship]: { x: -40, y: 50 },
    [allPieces.Spacedock]: { x: -35, y: -35 },
    [allPieces.PDS]: { x: 0, y: -55 },
    [allPieces.Warsun]: { x: 30, y: 50 },
    [allPieces.CommandCounter]: { x: 40, y: -40 },
};

// Returns the position for a piece container (same as initial coordinates for units;
// for commandCounter uses the center grey hex h2 instead of the rightmost h3)
export const getContainerCoordinates = (
    player: number,
    name: string
): Coordinates => {
    // CommandCounter container lives in center grey hex (h2)
    if (name === 'commandCounter') {
        const base = referencePoints[`p${player}h2`];
        const offset = coordOffsetsAllPieces[allPieces.CommandCounter];
        return { x: base.x + offset.x, y: base.y + offset.y };
    }
    // All other pieces use the same logic as getInitialCoordinates with pieceNumber=1
    return getInitialCoordinates({ player, name: name as any, pieceNumber: 1 });
};

export const getInitialCoordinates = (
    { player, name, pieceNumber }: Pick<DraggablePieceProps, 'player' | 'name' | 'pieceNumber'>
): Coordinates => {
    let base: Coordinates, offset: Coordinates;
    if (name === 'commandCounter' && pieceNumber < 9) {
        base = referencePoints[`p${player}h3`];
        offset = pieceOffsetInHex[`${name}${pieceNumber}`];
        return { x: base.x + offset.x, y: base.y + offset.y };
    }
    switch (name) {
        case allPieces.Carrier:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Cruiser:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Destroyer:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Dreadnought:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Spacedock:
            base = referencePoints[`p${player}h2`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.PDS:
            base = referencePoints[`p${player}h2`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Flagship:
            base = referencePoints[`p${player}h2`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Infantry:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Mech:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Warsun:
            base = referencePoints[`p${player}h2`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.CommandCounter:
            base = referencePoints[`p${player}h2`];
            offset = coordOffsetsAllPieces[name];
            break;
        case allPieces.Fighter:
            base = referencePoints[`p${player}h1`];
            offset = coordOffsetsAllPieces[name];
            break;
        default:
            throw new Error(`Unknown piece type: ${name}`);
    }
    return { x: base.x + offset.x, y: base.y + offset.y };
};

