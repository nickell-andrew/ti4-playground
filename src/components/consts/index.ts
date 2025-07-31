export const players = {
    One: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
}
export type PLAYERS = (typeof players)[keyof typeof players]

export const baseFactionColors = {
    Purple: 'ppl',
    Blue: 'blu',
    Green: 'grn',
    Yellow: 'ylw',
    Pink: 'pnk',
    Red: 'red',
    Orange: 'org',
    Black: 'blk',
    Gray: 'lgy',
} as const;
export type BASE_FACTION_COLORS = (typeof baseFactionColors)[keyof typeof baseFactionColors];

export const unitAbbreviations = {
    infantry: "gf",
    mech: "mf",
    spacedock: "sd",
    pds: "pd",
    fighter: "ff",
    destroyer: "dd",
    cruiser: "ca",
    carrier: "cv",
    dreadnought: "dn",
    flagship: "fs",
    warsun: "ws",
} as const;
export type UNIT_ABBREVIATIONS = (typeof unitAbbreviations)[keyof typeof unitAbbreviations]

export const pieceSize = {
    infantry: [25, 25],
    mech: [30, 30],
    spacedock: [30, 30],
    pds: [25, 25],
    fighter: [25, 25],
    destroyer: [35, 35],
    cruiser: [46, 46],
    carrier: [60, 60],
    dreadnought: [60, 60],
    flagship: [70, 70],
    warsun: [60, 60],
    commandCounter: [40, 40],
} as const;
export type UNIT_SIZE = (typeof pieceSize)[keyof typeof pieceSize]

export const units = {
    Infantry: "infantry",
    Mech: "mech",
    Spacedock: "spacedock",
    PDS: "pds",
    Fighter: "fighter",
    Destroyer: "destroyer",
    Cruiser: "cruiser",
    Carrier: "carrier",
    Dreadnought: "dreadnought",
    Flagship: "flagship",
    Warsun: "warsun",
} as const;
export type UNITS = (typeof units)[keyof typeof units];

export const tokens = {
    CommandCounter: "commandCounter"
} as const;
export type TOKENS = (typeof tokens)[keyof typeof tokens];

export const allPieces = Object.assign({}, units, tokens)
export type ALL_PIECES = (typeof allPieces)[keyof typeof allPieces]
