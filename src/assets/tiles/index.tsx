import stEmpty from './ST_-1.png'
import st0 from './ST_0.png'
import st1 from './ST_1.png'
import st2 from './ST_2.png'
import st3 from './ST_3.png'
import st4 from './ST_4.png'
import st5 from './ST_5.png'
import st6 from './ST_6.png'
import st7 from './ST_7.png'
import st8 from './ST_8.png'
import st9 from './ST_9.png'
import st10 from './ST_10.png'
import st11 from './ST_11.png'
import st12 from './ST_12.png'
import st13 from './ST_13.png'
import st14 from './ST_14.png'
import st15 from './ST_15.png'
import st16 from './ST_16.png'
import st17 from './ST_17.png'
import st18 from './ST_18.png'
import st19 from './ST_19.png'
import st20 from './ST_20.png'
import st21 from './ST_21.png'
import st22 from './ST_22.png'
import st23 from './ST_23.png'
import st24 from './ST_24.png'
import st25 from './ST_25.png'
import st26 from './ST_26.png'
import st27 from './ST_27.png'
import st28 from './ST_28.png'
import st29 from './ST_29.png'
import st30 from './ST_30.png'
import st31 from './ST_31.png'
import st32 from './ST_32.png'
import st33 from './ST_33.png'
import st34 from './ST_34.png'
import st35 from './ST_35.png'
import st36 from './ST_36.png'
import st37 from './ST_37.png'
import st38 from './ST_38.png'
import st39 from './ST_39.png'
import st40 from './ST_40.png'
import st41 from './ST_41.png'
import st42 from './ST_42.png'
import st43 from './ST_43.png'
import st44 from './ST_44.png'
import st45 from './ST_45.png'
import st46 from './ST_46.png'
import st47 from './ST_47.png'
import st48 from './ST_48.png'
import st49 from './ST_49.png'
import st50 from './ST_50.png'
import st51 from './ST_51.png'
import st52 from './ST_52.png'
import st53 from './ST_53.png'
import st54 from './ST_54.png'
import st55 from './ST_55.png'
import st56 from './ST_56.png'
import st57 from './ST_57.png'
import st58 from './ST_58.png'
import st59 from './ST_59.png'
import st60 from './ST_60.png'
import st61 from './ST_61.png'
import st62 from './ST_62.png'
import st63 from './ST_63.png'
import st64 from './ST_64.png'
import st65 from './ST_65.png'
import st66 from './ST_66.png'
import st67 from './ST_67.png'
import st68 from './ST_68.png'
import st69 from './ST_69.png'
import st70 from './ST_70.png'
import st71 from './ST_71.png'
import st72 from './ST_72.png'
import st73 from './ST_73.png'
import st74 from './ST_74.png'
import st75 from './ST_75.png'
import st76 from './ST_76.png'
import st77 from './ST_77.png'
import st78 from './ST_78.png'
import st79 from './ST_79.png'
import st80 from './ST_80.png'
import st81 from './ST_81.png'
import st82 from './ST_82.png'
import st83A from './ST_83A.png'
import st83B from './ST_83B.png'
import st84A from './ST_84A.png'
import st84B from './ST_84B.png'
import st85A from './ST_85A.png'
import st85B from './ST_85B.png'
import st86A from './ST_86A.png'
import st86B from './ST_86B.png'
import st87A from './ST_87A.png'
import st87B from './ST_87B.png'
import st88A from './ST_88A.png'
import st88B from './ST_88B.png'
import st89A from './ST_89A.png'
import st89B from './ST_89B.png'
import st90A from './ST_90A.png'
import st90B from './ST_90B.png'
import st91A from './ST_91A.png'
import st91B from './ST_91B.png'
import st92 from './ST_92.png'
import st93 from './ST_93.png'
import st94 from './ST_94.png'
import st95 from './ST_95.png'
import st96A from './ST_96a.png'
import st96B from './ST_96b.png'
import st97 from './ST_97.png'
import st98 from './ST_98.png'
import st99 from './ST_99.png'
import st100 from './ST_100.png'
import st101 from './ST_101.png'
import st102 from './ST_102.png'
import st103 from './ST_103.png'
import st104 from './ST_104.png'
import st105 from './ST_105.png'
import st106 from './ST_106.png'
import st107 from './ST_107.png'
import st108 from './ST_108.png'
import st109 from './ST_109.png'
import st110 from './ST_110.png'
import st111 from './ST_111.png'
import st112 from './ST_112.png'
import st113 from './ST_113.png'
import st114 from './ST_114.png'
import st115 from './ST_115.png'
import st116 from './ST_116.png'
import st117 from './ST_117.png'
import { allFactions, ALL_FACTIONS, factionInfo } from '../data/factions'
import { Tile, TileMap } from '../data/tiles'
import { tilesInfo } from '../data/tiles'
// Define a type for tile selection data
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

export function isTileNumber(value: string): value is TILE_NUMBERS {
    if (allTiles[(value as unknown as TILE_NUMBERS)] === undefined) {
        return false
    } else {
        return true
    }
}

export const allTiles: Record<TILE_NUMBERS, string> = {
    "-1": stEmpty,
    "0": st0,
    "1": st1,
    "2": st2,
    "3": st3,
    "4": st4,
    "5": st5,
    "6": st6,
    "7": st7,
    "8": st8,
    "9": st9,
    "10": st10,
    "11": st11,
    "12": st12,
    "13": st13,
    "14": st14,
    "15": st15,
    "16": st16,
    "17": st17,
    "18": st18,
    "19": st19,
    "20": st20,
    "21": st21,
    "22": st22,
    "23": st23,
    "24": st24,
    "25": st25,
    "26": st26,
    "27": st27,
    "28": st28,
    "29": st29,
    "30": st30,
    "31": st31,
    "32": st32,
    "33": st33,
    "34": st34,
    "35": st35,
    "36": st36,
    "37": st37,
    "38": st38,
    "39": st39,
    "40": st40,
    "41": st41,
    "42": st42,
    "43": st43,
    "44": st44,
    "45": st45,
    "46": st46,
    "47": st47,
    "48": st48,
    "49": st49,
    "50": st50,
    "51": st51,
    "52": st52,
    "53": st53,
    "54": st54,
    "55": st55,
    "56": st56,
    "57": st57,
    "58": st58,
    "59": st59,
    "60": st60,
    "61": st61,
    "62": st62,
    "63": st63,
    "64": st64,
    "65": st65,
    "66": st66,
    "67": st67,
    "68": st68,
    "69": st69,
    "70": st70,
    "71": st71,
    "72": st72,
    "73": st73,
    "74": st74,
    "75": st75,
    "76": st76,
    "77": st77,
    "78": st78,
    "79": st79,
    "80": st80,
    "81": st81,
    "82": st82,
    "83A": st83A,
    "83B": st83B,
    "84A": st84A,
    "84B": st84B,
    "85A": st85A,
    "85B": st85B,
    "86A": st86A,
    "86B": st86B,
    "87A": st87A,
    "87B": st87B,
    "88A": st88A,
    "88B": st88B,
    "89A": st89A,
    "89B": st89B,
    "90A": st90A,
    "90B": st90B,
    "91A": st91A,
    "91B": st91B,
    "92": st92,
    "93": st93,
    "94": st94,
    "95": st95,
    "96a": st96A,
    "96b": st96B,
    "97": st97,
    "98": st98,
    "99": st99,
    "100": st100,
    "101": st101,
    "102": st102,
    "103": st103,
    "104": st104,
    "105": st105,
    "106": st106,
    "107": st107,
    "108": st108,
    "109": st109,
    "110": st110,
    "111": st111,
    "112": st112,
    "113": st113,
    "114": st114,
    "115": st115,
    "116": st116,
    "117": st117,
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