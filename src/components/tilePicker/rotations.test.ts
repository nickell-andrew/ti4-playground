import { allRotations, degOptions, ALL_DEG_OPTIONS } from './rotations';

describe('allRotations', () => {
  const degrees = Object.values(degOptions) as ALL_DEG_OPTIONS[];

  it('defines all 6 rotation steps', () => {
    expect(degrees).toHaveLength(6);
    expect(degrees).toEqual(expect.arrayContaining([0, 60, 120, 180, 240, 300]));
  });

  it('has an entry for every degree option', () => {
    degrees.forEach(deg => {
      expect(allRotations[deg]).toBeDefined();
      expect(allRotations[deg].deg).toBe(deg);
    });
  });

  it('following .next 6 times returns to start (forward cycle)', () => {
    degrees.forEach(startDeg => {
      let current = startDeg;
      for (let i = 0; i < 6; i++) {
        current = allRotations[current].next;
      }
      expect(current).toBe(startDeg);
    });
  });

  it('following .prev 6 times returns to start (backward cycle)', () => {
    degrees.forEach(startDeg => {
      let current = startDeg;
      for (let i = 0; i < 6; i++) {
        current = allRotations[current].prev;
      }
      expect(current).toBe(startDeg);
    });
  });

  it('next and prev are inverses of each other', () => {
    degrees.forEach(deg => {
      const rotation = allRotations[deg];
      expect(allRotations[rotation.next].prev).toBe(deg);
      expect(allRotations[rotation.prev].next).toBe(deg);
    });
  });

  it('advances by exactly 60 degrees each step', () => {
    degrees.forEach(deg => {
      const rotation = allRotations[deg];
      const expectedNext = (deg + 60) % 360 as ALL_DEG_OPTIONS;
      expect(rotation.next).toBe(expectedNext);
    });
  });
});
