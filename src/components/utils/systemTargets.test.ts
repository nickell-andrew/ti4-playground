import { planetTargets } from './systemTargets';
import { allRotations } from '../tilePicker/rotations';
import { movePieces } from './movePieces';
import type { DragEndEvent } from '@dnd-kit/core';
import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';

const map = { '0,0,0': { number: '18' as const, rotation: allRotations[0] } };
const onPlanet = (isPlanet: boolean) => ({ active: { id: '1-infantry-1' }, over: { id: isPlanet ? 'planet-mr' : 'hex-0,0,0', data: { current: { isHex: true, isPlanet, hexKey: '0,0,0', planetName: 'Mecatol Rex' } } }, delta: { x: 0, y: 0 } } as unknown as DragEndEvent);
it('keeps ground forces on a planet separate from units in space', () => {
    const pieces: DraggablePiecePropsByUid = {
        '1-infantry-1': { player: 1, name: 'infantry', pieceNumber: 1, x: 0, y: 0 },
        '1-carrier-1': { player: 1, name: 'carrier', pieceNumber: 1, hexKey: '0,0,0' },
    };
    const landed = movePieces(pieces, onPlanet(true), [], 6, map);
    const planet = planetTargets('0,0,0', map['0,0,0'])[0];
    expect(landed['1-infantry-1'].planet).toBe('Mecatol Rex');
    expect(landed['1-infantry-1'].x).toBeCloseTo(planet.x);
    expect(landed['1-infantry-1'].y).toBeCloseTo(planet.y);
    expect(landed['1-carrier-1'].planet).toBeUndefined();
    // Ships may overlap planet artwork, while the ground-force center stays clear.
    expect(Math.hypot(landed['1-carrier-1'].x! - planet.x, landed['1-carrier-1'].y! - planet.y)).toBeGreaterThan(20);
    const lifted = movePieces(landed, onPlanet(false), [], 6, map);
    expect(lifted['1-infantry-1'].planet).toBeUndefined();
});
it('does not land ships when a mixed group drops on a planet', () => {
    const pieces: DraggablePiecePropsByUid = { '1-infantry-1': { player: 1, name: 'infantry', pieceNumber: 1 }, '1-carrier-1': { player: 1, name: 'carrier', pieceNumber: 1 } };
    const result = movePieces(pieces, onPlanet(true), Object.keys(pieces), 6, map);
    expect(result['1-infantry-1'].planet).toBe('Mecatol Rex');
    expect(result['1-carrier-1'].planet).toBeUndefined();
});
it('rotates planet targets with the artwork and exposes every planet in a multi-planet system', () => {
    const initial = planetTargets('0,0,0', { number: '1', rotation: allRotations[0] })[0];
    const rotated = planetTargets('0,0,0', { number: '1', rotation: allRotations[60] })[0];
    expect(rotated.name).toBe('Jord');
    expect(rotated.x).not.toBeCloseTo(initial.x);
    expect(planetTargets('0,0,0', { number: '27', rotation: allRotations[0] })).toHaveLength(2);
    expect(planetTargets('0,0,0', { number: '0', rotation: allRotations[0] })).toEqual([]);
});
