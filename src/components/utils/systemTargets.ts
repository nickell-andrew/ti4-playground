import rawPlanets from '../../assets/data/async-planets.json';
import { tilesInfo } from '../../assets/data/tiles';
import type { TILE_NUMBER_AND_ROTATION } from './mapData';
import { getHexGeometry } from './boardGeometry';

const metadata = rawPlanets as Record<string, { position?: { x: number; y: number } }>;
export const isGroundPiece = (name: string) => ['infantry', 'mech', 'spacedock', 'pds'].includes(name);
export interface PlanetTarget { name: string; x: number; y: number }
export function planetTargets(hexKey: string, tile?: TILE_NUMBER_AND_ROTATION | null): PlanetTarget[] {
    if (!tile || tile.number === '0') return [];
    const [q, r] = hexKey.split(',').map(Number), geometry = getHexGeometry(q, r);
    const planets = tilesInfo[tile.number]?.planets ?? [];
    const radians = tile.rotation.deg * Math.PI / 180;
    return planets.map((planet, index) => {
        const point = metadata[planet.name]?.position;
        // Async coordinates use the 345×299 tile interior; the existing images
        // include a 10px rim and render at 180×160 on the board.
        const dx = point ? (point.x - 172) * geometry.width / 364 : planets.length === 1 ? 0 : Math.cos(index / planets.length * Math.PI * 2) * 35;
        const dy = point ? (point.y - 148.5) * geometry.height / 317 : planets.length === 1 ? 0 : Math.sin(index / planets.length * Math.PI * 2) * 35;
        return { name: planet.name, x: geometry.x + dx * Math.cos(radians) - dy * Math.sin(radians), y: geometry.y + dx * Math.sin(radians) + dy * Math.cos(radians) };
    });
}
