import { TILE_NUMBERS } from "../tiles"

export const tiers = {
    high: "high",
    mid: "mid",
    low: "low",
    red: "red"
} as const;
export type TIER = (typeof tiers)[keyof typeof tiers]
export type TILE_TIERS = Record<TIER, TILE_NUMBERS[]>

const allTiers = {
    "tiers": {
        "high": [28, 29, 30, 32, 33, 35, 36, 38],
        "mid": [26, 27, 31, 34, 37],
        "low": [19, 20, 21, 22, 23, 24, 25],
        "red": [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
    },
    "pokTiers": {
        "high": [69, 70, 71, 75],
        "mid": [64, 65, 66, 72, 73, 74, 76],
        "low": [59, 60, 61, 62, 63],
        "red": [67, 68, 77, 78, 79, 80]
    },
    "DSTiers": {
        "high": [4261, 4262, 4263, 4264, 4266, 4268],
        "mid": [4253, 4254, 4255, 4256, 4257, 4258, 4259, 4260, 4267],
        "low": [4265],
        "red": [4269, 4270, 4271, 4272, 4273, 4274, 4275, 4276]
    },
    "TETiers": {
        "high": [110, 103, 97, 106, 101, 108],
        "mid": [105, 107, 109, 111, 99, 98],
        "low": [104, 102, 100],
        "red": [116, 115, 114, 113, 117]
    }
}

export const tileTiers: TILE_TIERS = {
    "high": [
        ...allTiers.tiers.high.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.pokTiers.high.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.DSTiers.high.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.TETiers.high.map(tile => String(tile) as TILE_NUMBERS),
    ],
    "mid": [
        ...allTiers.tiers.mid.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.pokTiers.mid.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.DSTiers.mid.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.TETiers.mid.map(tile => String(tile) as TILE_NUMBERS),
    ],
    "low": [
        ...allTiers.tiers.low.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.pokTiers.low.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.DSTiers.low.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.TETiers.low.map(tile => String(tile) as TILE_NUMBERS),
    ],
    "red": [
        ...allTiers.tiers.red.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.pokTiers.red.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.DSTiers.red.map(tile => String(tile) as TILE_NUMBERS),
        ...allTiers.TETiers.red.map(tile => String(tile) as TILE_NUMBERS),
    ],
}