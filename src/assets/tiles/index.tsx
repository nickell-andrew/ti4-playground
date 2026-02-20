import { useState, useEffect } from 'react'
import { allFactions, ALL_FACTIONS, factionInfo } from '../data/factions'
import { Tile, TileMap } from '../data/tiles'
import { tilesInfo } from '../data/tiles'

export interface TileSelectionData {
    tiers: {
        high: number[];
        mid: number[];
        low: number[];
        red: number[];
    };
}

export const tileNumbers = {
    tileEmpty: "-1",
    tile0: "0",
    tile1: "1",
    tile2: "2",
    tile3: "3",
    tile4: "4",
    tile5: "5",
    tile6: "6",
    tile7: "7",
    tile8: "8",
    tile9: "9",
    tile10: "10",
    tile11: "11",
    tile12: "12",
    tile13: "13",
    tile14: "14",
    tile15: "15",
    tile16: "16",
    tile17: "17",
    tile18: "18",
    tile19: "19",
    tile20: "20",
    tile21: "21",
    tile22: "22",
    tile23: "23",
    tile24: "24",
    tile25: "25",
    tile26: "26",
    tile27: "27",
    tile28: "28",
    tile29: "29",
    tile30: "30",
    tile31: "31",
    tile32: "32",
    tile33: "33",
    tile34: "34",
    tile35: "35",
    tile36: "36",
    tile37: "37",
    tile38: "38",
    tile39: "39",
    tile40: "40",
    tile41: "41",
    tile42: "42",
    tile43: "43",
    tile44: "44",
    tile45: "45",
    tile46: "46",
    tile47: "47",
    tile48: "48",
    tile49: "49",
    tile50: "50",
    tile51: "51",
    tile52: "52",
    tile53: "53",
    tile54: "54",
    tile55: "55",
    tile56: "56",
    tile57: "57",
    tile58: "58",
    tile59: "59",
    tile60: "60",
    tile61: "61",
    tile62: "62",
    tile63: "63",
    tile64: "64",
    tile65: "65",
    tile66: "66",
    tile67: "67",
    tile68: "68",
    tile69: "69",
    tile70: "70",
    tile71: "71",
    tile72: "72",
    tile73: "73",
    tile74: "74",
    tile75: "75",
    tile76: "76",
    tile77: "77",
    tile78: "78",
    tile79: "79",
    tile80: "80",
    tile81: "81",
    tile82: "82",
    tile83A: "83A",
    tile83B: "83B",
    tile84A: "84A",
    tile84B: "84B",
    tile85A: "85A",
    tile85B: "85B",
    tile86A: "86A",
    tile86B: "86B",
    tile87A: "87A",
    tile87B: "87B",
    tile88A: "88A",
    tile88B: "88B",
    tile89A: "89A",
    tile89B: "89B",
    tile90A: "90A",
    tile90B: "90B",
    tile91A: "91A",
    tile91B: "91B",
    tile92: "92",
    tile93: "93",
    tile94: "94",
    tile95: "95",
    tile96A: "96a",
    tile96B: "96b",
    tile97: "97",
    tile98: "98",
    tile99: "99",
    tile100: "100",
    tile101: "101",
    tile102: "102",
    tile103: "103",
    tile104: "104",
    tile105: "105",
    tile106: "106",
    tile107: "107",
    tile108: "108",
    tile109: "109",
    tile110: "110",
    tile111: "111",
    tile112: "112",
    tile113: "113",
    tile114: "114",
    tile115: "115",
    tile116: "116",
    tile117: "117",
} as const;
export type TILE_NUMBERS = (typeof tileNumbers)[keyof typeof tileNumbers]

const validTileNumbers = new Set<string>(Object.values(tileNumbers))

export function isTileNumber(value: string): value is TILE_NUMBERS {
    return validTileNumbers.has(value)
}

// Map tile numbers to their filename stem (handles special cases like 96a/96b)
function tileFilename(number: TILE_NUMBERS): string {
    return `ST_${number}`
}

// Module-level cache: tile number -> loaded URL
const tileUrlCache: Partial<Record<TILE_NUMBERS, string>> = {}

// In-flight promises to avoid duplicate fetches
const tileUrlPromises: Partial<Record<TILE_NUMBERS, Promise<string>>> = {}

function loadTileUrl(number: TILE_NUMBERS): Promise<string> {
    if (tileUrlCache[number] !== undefined) {
        return Promise.resolve(tileUrlCache[number] as string)
    }
    if (tileUrlPromises[number] !== undefined) {
        return tileUrlPromises[number] as Promise<string>
    }
    const filename = tileFilename(number)
    const promise = import(`./${filename}.webp`).then((mod: { default: string }) => {
        tileUrlCache[number] = mod.default
        return mod.default
    })
    tileUrlPromises[number] = promise
    return promise
}

export function useTileUrl(number: TILE_NUMBERS | null | undefined): string | undefined {
    const cached = number != null ? tileUrlCache[number] : undefined
    const [url, setUrl] = useState<string | undefined>(cached)

    useEffect(() => {
        if (number == null) {
            setUrl(undefined)
            return
        }
        if (tileUrlCache[number] !== undefined) {
            setUrl(tileUrlCache[number])
            return
        }
        let cancelled = false
        loadTileUrl(number).then(loaded => {
            if (!cancelled) setUrl(loaded)
        })
        return () => { cancelled = true }
    }, [number])

    return url
}

export type HOME_SYSTEM_TILES = Record<ALL_FACTIONS, Tile>
export const homeSystemTiles: HOME_SYSTEM_TILES = {
    ...Object.entries(allFactions).reduce((dict, [_, value]) => {
        dict[value] = tilesInfo[factionInfo[value].homesystem]
        return dict
    }, {} as HOME_SYSTEM_TILES)
} as const;

export type TILES_BY_TILE_NUMBER = Record<TILE_NUMBERS, Tile>
export const homeSystemTilesByTileNumber: TILES_BY_TILE_NUMBER = {
    ...Object.entries(homeSystemTiles).reduce((dict, [faction, value]) => {
        let f = (faction as any) as ALL_FACTIONS
        dict[factionInfo[f].homesystem] = value
        return dict
    }, {} as TILES_BY_TILE_NUMBER)
} as const;

export const hyperlaneTiles: TileMap = {
    ...Object.values(tileNumbers).reduce((map, tileNumber) => {
        let tile = tilesInfo[tileNumber]
        if (tile.hyperlanes !== null && tile.hyperlanes !== undefined) {
            map[tileNumber] = tile
        }
        return map
    }, {} as TileMap)
} as const;

export const hyperlaneTilesByTileNumber: TILES_BY_TILE_NUMBER = {
    ...Object.entries(hyperlaneTiles).reduce((dict, [tile, value]) => {
        let t = (tile as any) as TILE_NUMBERS
        dict[t] = value
        return dict
    }, {} as TILES_BY_TILE_NUMBER)
} as const;
