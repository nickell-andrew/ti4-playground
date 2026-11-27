import { parseTTSMap } from './ttsMap';
import { TTSStringHexOrder } from './mapData';

it('accepts spaces, tabs, Windows line breaks and outer whitespace', () => {
    const value = '\n  ' + Array(36).fill('19').join('  \r\n\t') + ' \n';
    const map = parseTTSMap(value);
    expect(Object.keys(map)).toHaveLength(37);
    TTSStringHexOrder.forEach(key => expect(map[key].number).toBe('19'));
    expect(map['0,0,0'].number).toBe('18');
});
it('imports 0 as an empty space and round-trips empty slots', () => {
    const tiles = Array(36).fill('0'); tiles[7] = '26';
    const map = parseTTSMap(tiles.join(' '));
    expect(map[TTSStringHexOrder[0]]).toBeUndefined();
    expect(TTSStringHexOrder.map(key => map[key]?.number ?? '0').join(' ')).toBe(tiles.join(' '));
});
it.each(['', '19', Array(35).fill('19').join(' '), Array(37).fill('19').join(' ')])('rejects the wrong count: %s', value => {
    expect(() => parseTTSMap(value)).toThrow('Enter 36 tile numbers');
});
it('rejects unknown tile numbers before applying any map', () => {
    expect(() => parseTTSMap([...Array(35).fill('19'), '999'].join(' '))).toThrow('Unknown tile: 999');
});
