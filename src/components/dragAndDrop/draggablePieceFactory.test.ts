import { getDraggablePieceProps, COMMAND_COUNTERS_PRE_PLACED } from './draggablePieceFactory';

describe('getDraggablePieceProps', () => {
  describe('piece count', () => {
    it('creates only the pre-placed command counter pieces (no units)', () => {
      const pieces = getDraggablePieceProps(1);
      expect(Object.keys(pieces)).toHaveLength(COMMAND_COUNTERS_PRE_PLACED);
    });

    it('all 6 players produce the same piece count', () => {
      for (let player = 1; player <= 6; player++) {
        const pieces = getDraggablePieceProps(player);
        expect(Object.keys(pieces)).toHaveLength(COMMAND_COUNTERS_PRE_PLACED);
      }
    });

    it('does not pre-place any unit pieces', () => {
      const pieces = getDraggablePieceProps(1);
      const unitNames = ['infantry', 'mech', 'spacedock', 'pds', 'fighter',
        'destroyer', 'cruiser', 'carrier', 'dreadnought', 'warsun', 'flagship'];
      Object.values(pieces).forEach(piece => {
        expect(unitNames).not.toContain(piece.name);
      });
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
    it('pre-placed command counters are numbered 1 through COMMAND_COUNTERS_PRE_PLACED', () => {
      const pieces = getDraggablePieceProps(1);
      const ccNums = Object.values(pieces)
        .filter(p => p.name === 'commandCounter')
        .map(p => p.pieceNumber)
        .sort((a, b) => a - b);
      const expected = Array.from({ length: COMMAND_COUNTERS_PRE_PLACED }, (_, i) => i + 1);
      expect(ccNums).toEqual(expected);
    });
  });
});
