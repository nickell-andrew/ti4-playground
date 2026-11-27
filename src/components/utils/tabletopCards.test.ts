import { emptyCards, getMapPlanets, restoreCards, strategyCards, playerCardArea, playerAtCardPosition, cardPosition } from './tabletopCards';
import { allRotations } from '../tilePicker/rotations';

it('has all eight strategy cards in initiative order', () => {
    expect(strategyCards.map(card => card.id)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    expect(new Set(strategyCards.map(card => card.name)).size).toBe(8);
});
it('lists planets from the current map once, ignoring empty spaces', () => {
    const planets = getMapPlanets({
        '0,0,0': { number: '18', rotation: allRotations[0] },
        '1,0,-1': { number: '18', rotation: allRotations[0] },
        '0,1,-1': { number: '0', rotation: allRotations[0] },
    });
    expect(planets.map(planet => planet.name)).toEqual(['Mecatol Rex']);
});
it('supports old saves without cards and restores ownership and exhaustion', () => {
    expect(restoreCards(undefined, 6)).toEqual(emptyCards());
    const cards = { strategies: { '1': { player: 2, exhausted: true } }, planets: { Jord: { player: 1, exhausted: false } } };
    expect(restoreCards(cards, 6)).toEqual(cards);
});
it('discards malformed entries and preserves flipped unassigned cards', () => {
    expect(restoreCards({ strategies: { '1': { player: 9 }, '2': { player: null, exhausted: true }, '99': { player: 1 }, '3': null }, planets: null }, 6))
        .toEqual({ strategies: { '2': { player: null, exhausted: true } }, planets: {} });
});
it('places assigned strategy cards in the right play area and recognizes card drops there', () => {
    for (let player = 1; player <= 6; player++) {
        const state = { player, exhausted: false };
        const cards = { strategies: { '1': state }, planets: {} };
        const position = cardPosition('strategies', '1', state, cards)!;
        expect(playerAtCardPosition(position, 6)).toBe(player);
        expect(playerAtCardPosition(playerCardArea(player), 6)).toBe(player);
    }
    expect(playerAtCardPosition({ x: 627, y: 710 }, 6)).toBeUndefined();
});
it('preserves freely positioned cards across JSON round trips', () => {
    const cards = { strategies: { '2': { player: 3, exhausted: true, x: 900, y: 600 } }, planets: {} };
    expect(restoreCards(JSON.parse(JSON.stringify(cards)), 6)).toEqual(cards);
    expect(cardPosition('strategies', '2', cards.strategies['2'], cards)).toEqual({ x: 900, y: 600 });
});
