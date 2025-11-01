import { allRotations, ROTATION } from '../tilePicker/rotations';
import { tileNumbers, TILE_NUMBERS } from '../../assets/tiles';
import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';

export type PLAYER_COUNT = 3 | 4 | 5 | 6 | 7 | 8;

export interface TILE_NUMBER_AND_ROTATION {
    number: TILE_NUMBERS;
    rotation: ROTATION;
}

export const TTSStringHexOrder = [
    // Central Ring
    "0,-1,1",
    "1,-1,0",
    "1,0,-1",
    "0,1,-1",
    "-1,1,0",
    "-1,0,1",
    // Inner Ring
    "0,-2,2",
    "1,-2,1",
    "2,-2,0",
    "2,-1,-1",
    "2,0,-2",
    "1,1,-2",
    "0,2,-2",
    "-1,2,-1",
    "-2,2,0",
    "-2,1,1",
    "-2,0,2",
    "-1,-1,2",
    // Outer Ring
    "0,-3,3",
    "1,-3,2",
    "2,-3,1",
    "3,-3,0",
    "3,-2,-1",
    "3,-1,-2",
    "3,0,-3",
    "2,1,-3",
    "1,2,-3",
    "0,3,-3",
    "-1,3,-2",
    "-2,3,-1",
    "-3,3,0",
    "-3,2,1",
    "-3,1,2",
    "-3,0,3",
    "-2,-1,3",
    "-1,-2,3"
];

// Initialize corner tiles with Green Tile if no saved map exists
export const initialTiles: Record<string, TILE_NUMBER_AND_ROTATION> = {
    // Set First Tile for each corner
    '-3,3,0': { number: tileNumbers.tile0, rotation: allRotations[0] },
    '-3,0,3': { number: tileNumbers.tile0, rotation: allRotations[0] },
    '0,-3,3': { number: tileNumbers.tile0, rotation: allRotations[0] },
    '3,-3,0': { number: tileNumbers.tile0, rotation: allRotations[0] },
    '3,0,-3': { number: tileNumbers.tile0, rotation: allRotations[0] },
    '0,3,-3': { number: tileNumbers.tile0, rotation: allRotations[0] },
    // Set the central tile to Tile 18 (Mecatol Rex)
    '0,0,0': { number: tileNumbers.tile18, rotation: allRotations[0] },
} as const;

// Define the corner coordinates based on the grid size
// The grid is generated with q and r from -3 to 3, with s = -q - r
export const cornerCoordinates = [
    { q: -3, r: 3, s: 0 },   // Bottom-left
    { q: -3, r: 0, s: 3 },   // Top-left
    { q: 0, r: -3, s: 3 },   // Top
    { q: 3, r: -3, s: 0 },   // Top-right
    { q: 3, r: 0, s: -3 },   // Bottom-right
    { q: 0, r: 3, s: -3 }    // Bottom
];

// Define a type for the map data
export interface MapDataV1 {
    hexTiles: Record<string, TILE_NUMBERS>;
    playerCount: PLAYER_COUNT;
    allDraggablesByUid: DraggablePiecePropsByUid;
    timestamp: number;
}

export interface MapDataV2 {
    hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>;
    playerCount: PLAYER_COUNT;
    allDraggablesByUid: DraggablePiecePropsByUid;
    timestamp: number;
}

