import { fitsHexRectangle, getHexGeometry, organizeOnHex } from './boardGeometry';
import { planetTargets } from './systemTargets';
import { allRotations } from '../tilePicker/rotations';
import { ALL_PIECES, pieceSize } from '../consts';
import type { DraggablePiecePropsByUid } from '../dragAndDrop/draggablePieceUtils';

it('keeps a large fleet inside a three-planet system while reserving ground-force centers', () => {
    const key = '0,0,0', hex = getHexGeometry(0, 0);
    const planets = planetTargets(key, { number: '75', rotation: allRotations[0] });
    const pieces: DraggablePiecePropsByUid = {};
    const counters: Record<string, number> = {};
    const add = (name: ALL_PIECES, count: number, planet?: string) => {
        for (let i = 0; i < count; i++) {
            const pieceNumber = counters[name] = (counters[name] ?? 0) + 1;
            pieces[`1-${name}-${pieceNumber}`] = { player: 1, name, pieceNumber, hexKey: key, planet };
        }
    };
    add('carrier', 3); add('dreadnought', 3); add('cruiser', 2); add('destroyer', 4); add('fighter', 4);
    add('infantry', 3); add('mech', 1);
    planets.forEach(planet => { add('infantry', 3, planet.name); add('mech', 1, planet.name); });
    const arranged = Object.values(organizeOnHex(pieces, key, hex, planets));
    arranged.forEach(piece => {
        const scale = piece.layoutScale ?? 1, [width, height] = pieceSize[piece.name];
        expect(fitsHexRectangle({ x: piece.x!, y: piece.y! }, width * scale, height * scale, hex)).toBe(true);
    });
    const ground = arranged.filter(p => p.name === 'infantry' || p.name === 'mech');
    const ships = arranged.filter(p => p.name !== 'infantry' && p.name !== 'mech');
    expect(Math.min(...ships.map(p => p.layoutScale!))).toBeGreaterThan(0.25);
    ships.forEach(ship => ground.forEach(unit => {
        const horizontal = Math.abs(ship.x! - unit.x!) >= pieceSize[unit.name][0] * unit.layoutScale! / 2;
        const vertical = Math.abs(ship.y! - unit.y!) >= pieceSize[unit.name][1] * unit.layoutScale! / 2;
        expect(horizontal || vertical).toBe(true);
    }));
    ground.filter(p => !p.planet).forEach(unit => planets.forEach(planet => expect(Math.hypot(unit.x! - planet.x, unit.y! - planet.y)).toBeGreaterThan(25)));
});
