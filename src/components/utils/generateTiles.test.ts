import { generateTiles } from './generateTiles';

describe('generateTiles', () => {
  describe('6-player board', () => {
    const hexes = generateTiles(6);

    it('returns 55 hexes total (37 board + 18 extra systems)', () => {
      expect(hexes).toHaveLength(55);
    });

    it('has exactly 18 extra system hexes', () => {
      expect(hexes.filter(h => h.extraSystem)).toHaveLength(18);
    });

    it('has exactly 37 board hexes', () => {
      expect(hexes.filter(h => !h.extraSystem)).toHaveLength(37);
    });

    it('satisfies cube coordinate constraint for all board hexes', () => {
      hexes.filter(h => !h.extraSystem).forEach(({ q, r, s }) => {
        expect(q + r + s).toBe(0);
      });
    });

    it('has no duplicate coordinates', () => {
      const keys = hexes.map(({ q, r, s }) => `${q},${r},${s}`);
      expect(new Set(keys).size).toBe(hexes.length);
    });
  });

  describe('5-player board', () => {
    const hexes = generateTiles(5);

    it('returns 46 hexes total (31 board + 15 extra systems, minus 6th player slice)', () => {
      expect(hexes).toHaveLength(46);
    });

    it('has exactly 15 extra system hexes', () => {
      expect(hexes.filter(h => h.extraSystem)).toHaveLength(15);
    });

    it('has exactly 31 board hexes (37 minus the 6 removed for 6th player)', () => {
      expect(hexes.filter(h => !h.extraSystem)).toHaveLength(31);
    });

    it('satisfies cube coordinate constraint for all board hexes', () => {
      hexes.filter(h => !h.extraSystem).forEach(({ q, r, s }) => {
        expect(q + r + s).toBe(0);
      });
    });

    it('excludes the 6th player slice hexes from board', () => {
      const sixthPlayerSlice = [
        { q: -3, r: 0, s: 3 },
        { q: -3, r: 1, s: 2 },
        { q: -2, r: -1, s: 3 },
        { q: -2, r: 0, s: 2 },
        { q: -1, r: -1, s: 2 },
        { q: -1, r: 0, s: 1 },
      ];
      const boardHexKeys = new Set(
        hexes.filter(h => !h.extraSystem).map(({ q, r, s }) => `${q},${r},${s}`)
      );
      sixthPlayerSlice.forEach(({ q, r, s }) => {
        expect(boardHexKeys.has(`${q},${r},${s}`)).toBe(false);
      });
    });

    it('has no duplicate coordinates', () => {
      const keys = hexes.map(({ q, r, s }) => `${q},${r},${s}`);
      expect(new Set(keys).size).toBe(hexes.length);
    });
  });

  describe('unknown player counts', () => {
    it('falls through to 6-player board for count > 6', () => {
      const hexes = generateTiles(8);
      expect(hexes).toHaveLength(55);
    });

    it('falls through to 6-player board for count < 5', () => {
      const hexes = generateTiles(3);
      expect(hexes).toHaveLength(55);
    });

    it('falls through to 6-player board for count 0', () => {
      const hexes = generateTiles(0);
      expect(hexes).toHaveLength(55);
    });
  });

  describe('center hex', () => {
    it('includes origin hex (0,0,0) for 6-player board', () => {
      const hexes = generateTiles(6);
      const center = hexes.find(h => h.q === 0 && h.r === 0 && h.s === 0);
      expect(center).toBeDefined();
    });

    it('includes origin hex (0,0,0) for 5-player board', () => {
      const hexes = generateTiles(5);
      const center = hexes.find(h => h.q === 0 && h.r === 0 && h.s === 0);
      expect(center).toBeDefined();
    });
  });
});
