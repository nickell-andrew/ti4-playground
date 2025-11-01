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

export const pieceOffsetInHex: Record<string, Coordinates> = {
    "commandCounter1": { x: -25, y: -40 },
    "commandCounter2": { x: -5, y: -47 },
    "commandCounter3": { x: 15, y: -42 },

    "commandCounter4": { x: 60, y: -5 },
    "commandCounter5": { x: 25, y: -1 },
    "commandCounter6": { x: 51, y: 20 },

    "commandCounter7": { x: 5, y: 50 },
    "commandCounter8": { x: 25, y: 65 },
};

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

