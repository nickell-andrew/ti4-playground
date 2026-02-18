import { getDraggablePieceProps } from './draggablePieceFactory';

// Unit counts from draggablePieceFactory.ts:
// infantry:12, mech:4, spacedock:3, pds:6, fighter:10, destroyer:8,
// cruiser:8, carrier:4, dreadnought:5, warsun:2, flagship:1 = 63 units
// commandCounter:16 tokens
const UNITS_PER_PLAYER = 63;
const TOKENS_PER_PLAYER = 16;
const PIECES_PER_PLAYER = UNITS_PER_PLAYER + TOKENS_PER_PLAYER;

describe('getDraggablePieceProps', () => {
  describe('piece count', () => {
    it('creates the correct total number of pieces for a player', () => {
      const pieces = getDraggablePieceProps(1);
      expect(Object.keys(pieces)).toHaveLength(PIECES_PER_PLAYER);
    });

    it('all 6 players produce the same piece count', () => {
      for (let player = 1; player <= 6; player++) {
        const pieces = getDraggablePieceProps(player);
        expect(Object.keys(pieces)).toHaveLength(PIECES_PER_PLAYER);
      }
    });
  });

  describe('piece properties', () => {
    const pieces = getDraggablePieceProps(1);
    const pieceList = Object.values(pieces);

    it('every piece has a defined x coordinate', () => {
      pieceList.forEach(piece => {
        expect(piece.x).toBeDefined();
        expect(typeof piece.x).toBe('number');
      });
    });

    it('every piece has a defined y coordinate', () => {
      pieceList.forEach(piece => {
        expect(piece.y).toBeDefined();
        expect(typeof piece.y).toBe('number');
      });
    });

    it('every piece has the correct player number', () => {
      pieceList.forEach(piece => {
        expect(piece.player).toBe(1);
      });
    });

    it('assigns player-specific data to each player', () => {
      const p1 = getDraggablePieceProps(1);
      const p2 = getDraggablePieceProps(2);
      Object.values(p1).forEach(piece => expect(piece.player).toBe(1));
      Object.values(p2).forEach(piece => expect(piece.player).toBe(2));
    });
  });

  describe('UIDs', () => {
    it('UIDs follow the format ${player}-${name}-${pieceNumber}', () => {
      const pieces = getDraggablePieceProps(1);
      Object.entries(pieces).forEach(([uid, { player, name, pieceNumber }]) => {
        expect(uid).toBe(`${player}-${name}-${pieceNumber}`);
      });
    });

    it('all UIDs within a player are unique', () => {
      const pieces = getDraggablePieceProps(1);
      const uids = Object.keys(pieces);
      expect(new Set(uids).size).toBe(uids.length);
    });

    it('UIDs do not collide across different players', () => {
      const allUids: string[] = [];
      for (let player = 1; player <= 6; player++) {
        const pieces = getDraggablePieceProps(player);
        allUids.push(...Object.keys(pieces));
      }
      expect(new Set(allUids).size).toBe(allUids.length);
    });
  });

  describe('piece number sequences', () => {
    it('infantry pieces are numbered 1 through 12', () => {
      const pieces = getDraggablePieceProps(1);
      const infantryNums = Object.values(pieces)
        .filter(p => p.name === 'infantry')
        .map(p => p.pieceNumber)
        .sort((a, b) => a - b);
      expect(infantryNums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('flagship pieces are numbered 1 through 1', () => {
      const pieces = getDraggablePieceProps(1);
      const flagshipNums = Object.values(pieces)
        .filter(p => p.name === 'flagship')
        .map(p => p.pieceNumber);
      expect(flagshipNums).toEqual([1]);
    });

    it('command counters are numbered 1 through 16', () => {
      const pieces = getDraggablePieceProps(1);
      const ccNums = Object.values(pieces)
        .filter(p => p.name === 'commandCounter')
        .map(p => p.pieceNumber)
        .sort((a, b) => a - b);
      expect(ccNums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    });
  });
});
