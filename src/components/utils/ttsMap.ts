import { isTileNumber, TILE_NUMBERS } from '../../assets/tiles';
import { allRotations } from '../tilePicker/rotations';
import { TTSStringHexOrder, TILE_NUMBER_AND_ROTATION } from './mapData';

export function parseTTSMap(value: string): Record<string, TILE_NUMBER_AND_ROTATION> {
    const tiles = value.trim() ? value.trim().split(/\s+/) : [];
    if (tiles.length !== TTSStringHexOrder.length) {
        throw new Error(`Enter ${TTSStringHexOrder.length} tile numbers (received ${tiles.length}). Use 0 for an empty space.`);
    }
    const invalid = tiles.find(tile => !isTileNumber(tile));
    if (invalid !== undefined) throw new Error(`Unknown tile: ${invalid}. Use 0 for an empty space.`);
    return TTSStringHexOrder.reduce((map, key, index) => {
        // An omitted tile exports as 0 and renders as an editable empty space.
        if (tiles[index] !== '0') map[key] = { number: tiles[index] as TILE_NUMBERS, rotation: allRotations[0] };
        return map;
    }, { '0,0,0': { number: '18', rotation: allRotations[0] } } as Record<string, TILE_NUMBER_AND_ROTATION>);
}
