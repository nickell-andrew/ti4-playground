import { Planet, tilesInfo } from '../../assets/data/tiles';
import { TILE_NUMBER_AND_ROTATION } from './mapData';
import { referencePoints } from './pieceCoordinates';

export interface CardState { player: number | null; exhausted: boolean; x?: number; y?: number }
export interface TabletopCards {
    strategies: Record<string, CardState>;
    planets: Record<string, CardState>;
}
export const emptyCards = (): TabletopCards => ({ strategies: {}, planets: {} });
export function playerCardArea(player: number) {
    const home = referencePoints[`p${player}h2`], center = referencePoints.mecatol;
    const dx = home.x - center.x, dy = home.y - center.y, length = Math.hypot(dx, dy);
    return { x: home.x + dx / length * 145, y: home.y + dy / length * 145 };
}
export function playerAtCardPosition(point: { x: number; y: number }, playerCount: number) {
    return Array.from({ length: playerCount }, (_, i) => i + 1).find(player => {
        const area = playerCardArea(player);
        return Math.abs(point.x - area.x) <= 135 && point.y >= area.y - 85 && point.y <= area.y + 200;
    });
}
export function cardPosition(kind: keyof TabletopCards, id: string, state: CardState, cards: TabletopCards) {
    if (state.x !== undefined && state.y !== undefined) return { x: state.x, y: state.y };
    if (state.player === null) return null;
    const area = playerCardArea(state.player);
    const owned = Object.keys(cards[kind]).filter(key => cards[kind][key].player === state.player).sort();
    const index = Math.max(0, owned.indexOf(id));
    return kind === 'strategies' ? { x: area.x - 55 + index % 2 * 105, y: area.y - 15 + Math.floor(index / 2) * 125 }
        : { x: area.x - 105 + index % 6 * 44, y: area.y + 110 + Math.floor(index / 6) * 130 };
}
export const strategyCards = [
    { id: '1', name: 'Leadership', color: '#bc3b40' },
    { id: '2', name: 'Diplomacy', color: '#c36a30' },
    { id: '3', name: 'Politics', color: '#ba9b25' },
    { id: '4', name: 'Construction', color: '#36845c' },
    { id: '5', name: 'Trade', color: '#359eac' },
    { id: '6', name: 'Warfare', color: '#377ac0' },
    { id: '7', name: 'Technology', color: '#474cba' },
    { id: '8', name: 'Imperial', color: '#8c4bb1' },
];

export function getMapPlanets(hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>): Planet[] {
    const planets = new Map<string, Planet>();
    Object.values(hexTiles).forEach(tile => {
        tilesInfo[tile.number]?.planets.forEach(planet => planets.set(planet.name, planet));
    });
    return Array.from(planets.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Older saves have no card state. Discard malformed entries without affecting the map.
export function restoreCards(value: unknown, playerCount: number): TabletopCards {
    const restored = emptyCards();
    if (!value || typeof value !== 'object') return restored;
    for (const kind of ['strategies', 'planets'] as const) {
        const entries = (value as TabletopCards)[kind];
        if (!entries || typeof entries !== 'object') continue;
        Object.entries(entries).forEach(([id, state]) => {
            if (!state || typeof state !== 'object') return;
            if (kind === 'strategies' && !strategyCards.some(card => card.id === id)) return;
            if (state.player !== null && (!Number.isInteger(state.player) || state.player < 1 || state.player > playerCount)) return;
            restored[kind][id] = { player: state.player, exhausted: state.exhausted === true,
                ...(Number.isFinite(state.x) && Number.isFinite(state.y) ? { x: state.x, y: state.y } : {}) };
        });
    }
    return restored;
}
