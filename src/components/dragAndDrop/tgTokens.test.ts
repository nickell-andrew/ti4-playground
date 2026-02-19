import { maxPieceCounts, tgTokenTypes, unitTypes } from './draggablePieceFactory';
import { tokens } from '../consts';
import { H3_PROXIMITY_RADIUS, referencePoints, tgContainerPositions } from '../utils/pieceCoordinates';

describe('TG token constants', () => {
  describe('tgTokenTypes', () => {
    it('contains exactly tradeGood and tradeGoodBundle', () => {
      expect(tgTokenTypes).toEqual([tokens.TradeGood, tokens.TradeGoodBundle]);
    });

    it('has exactly 2 entries', () => {
      expect(tgTokenTypes).toHaveLength(2);
    });

    it('does not overlap with unitTypes', () => {
      tgTokenTypes.forEach(tg => {
        expect(unitTypes).not.toContain(tg);
      });
    });
  });

  describe('maxPieceCounts for TG tokens', () => {
    it('tradeGood has a positive max count', () => {
      expect(maxPieceCounts[tokens.TradeGood]).toBeGreaterThan(0);
    });

    it('tradeGoodBundle has a positive max count', () => {
      expect(maxPieceCounts[tokens.TradeGoodBundle]).toBeGreaterThan(0);
    });

    it('tradeGood max count is 12', () => {
      expect(maxPieceCounts[tokens.TradeGood]).toBe(12);
    });

    it('tradeGoodBundle max count is 4', () => {
      expect(maxPieceCounts[tokens.TradeGoodBundle]).toBe(4);
    });
  });
});

describe('TG container positions', () => {
  it('defines a position for tradeGood', () => {
    expect(tgContainerPositions[tokens.TradeGood]).toBeDefined();
    expect(typeof tgContainerPositions[tokens.TradeGood].x).toBe('number');
    expect(typeof tgContainerPositions[tokens.TradeGood].y).toBe('number');
  });

  it('defines a position for tradeGoodBundle', () => {
    expect(tgContainerPositions[tokens.TradeGoodBundle]).toBeDefined();
    expect(typeof tgContainerPositions[tokens.TradeGoodBundle].x).toBe('number');
    expect(typeof tgContainerPositions[tokens.TradeGoodBundle].y).toBe('number');
  });

  it('tradeGood and tradeGoodBundle containers are at different y positions', () => {
    expect(tgContainerPositions[tokens.TradeGood].y).not.toBe(
      tgContainerPositions[tokens.TradeGoodBundle].y
    );
  });

  it('both containers share the same x position (stacked vertically)', () => {
    expect(tgContainerPositions[tokens.TradeGood].x).toBe(
      tgContainerPositions[tokens.TradeGoodBundle].x
    );
  });
});

describe('H3 proximity radius', () => {
  it('is a positive number', () => {
    expect(H3_PROXIMITY_RADIUS).toBeGreaterThan(0);
  });

  it('is 90 pixels', () => {
    expect(H3_PROXIMITY_RADIUS).toBe(90);
  });

  it('a point exactly at h3 center is within radius', () => {
    const h3 = referencePoints['p1h3'];
    const dx = Math.abs(h3.x - h3.x);
    const dy = Math.abs(h3.y - h3.y);
    expect(dx).toBeLessThanOrEqual(H3_PROXIMITY_RADIUS);
    expect(dy).toBeLessThanOrEqual(H3_PROXIMITY_RADIUS);
  });

  it('a point at exactly the radius boundary is within range', () => {
    const h3 = referencePoints['p1h3'];
    const dx = Math.abs((h3.x + H3_PROXIMITY_RADIUS) - h3.x);
    expect(dx).toBeLessThanOrEqual(H3_PROXIMITY_RADIUS);
  });

  it('a point one pixel beyond the radius is outside range', () => {
    const h3 = referencePoints['p1h3'];
    const dx = Math.abs((h3.x + H3_PROXIMITY_RADIUS + 1) - h3.x);
    expect(dx).toBeGreaterThan(H3_PROXIMITY_RADIUS);
  });

  it('h3 reference points exist for all 6 players', () => {
    for (let player = 1; player <= 6; player++) {
      const h3 = referencePoints[`p${player}h3`];
      expect(h3).toBeDefined();
      expect(typeof h3.x).toBe('number');
      expect(typeof h3.y).toBe('number');
    }
  });

  it('no two players share the same h3 position', () => {
    const positions = Array.from({ length: 6 }, (_, i) => {
      const h3 = referencePoints[`p${i + 1}h3`];
      return `${h3.x},${h3.y}`;
    });
    expect(new Set(positions).size).toBe(6);
  });
});
