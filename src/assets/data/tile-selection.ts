import { TILE_NUMBERS } from "../tiles"

export const tiers = {
    high: "high",
    mid: "mid",
    low: "low",
    red: "red"
} as const;
export type TIER = (typeof tiers)[keyof typeof tiers]
// export type TIER = "high" | "mid" | "low" | "red"
export type TILE_TIERS = Record<TIER, TILE_NUMBERS[]>
export const tileTiers: TILE_TIERS = {
    "high": ["28", "29", "30", "32", "33", "35", "36", "38", "69", "70", "71", "75"],
    "mid": ["26", "27", "31", "34", "37", "64", "65", "66", "72", "73", "74", "76"],
    "low": ["19", "20", "21", "22", "23", "24", "25", "59", "60", "61", "62", "63"],
    "red": ["39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "67", "68", "77", "78", "79", "80"]
} 