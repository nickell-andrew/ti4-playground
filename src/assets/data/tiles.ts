import { TILE_NUMBERS } from "../tiles"


export type TileMap = Record<TILE_NUMBERS, Tile>
export type edge = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type edgeConnection = [edge, edge]
export interface Tile {
    type: "green" | "blue" | "hyperlane" | "red";
    faction?: string | null;
    wormhole: string | null;
    anomaly?: string | null;
    planets: Planet[];
    stations?: Station[] | null;
    hyperlanes?: edgeConnection[] | null;
}

export type Station = {
    name: string;
    resources: number;
    influence: number;
    // specialties: string[] | null;
    trait?: Trait;
    // legendary: false | string;
}
export type Trait = "cultural" | "industrial" | "hazardous" | null
export interface Planet {
    name: string;
    resources: number;
    influence: number;
    specialties: string[] | null;
    traits?: Trait[];
    legendary: false | string;
}

export const tilesInfo: TileMap = {
    "-1": {
        "type": "red",
        "wormhole": null,
        "planets": []
    },
    "0": {
        "type": "green",
        "wormhole": null,
        "planets": []
    },
    "1": {
        "type": "green",
        "faction": "The Federation of Sol",
        "wormhole": null,
        "planets": [{
            "name": "Jord",
            "resources": 4,
            "influence": 2,
            "specialties": null,

            "legendary": false
        }]
    },

    "2": {
        "type": "green",
        "faction": "The Mentak Coalition",
        "wormhole": null,
        "planets": [{
            "name": "Moll Primus",
            "resources": 4,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }]
    },
    "3": {
        "type": "green",
        "faction": "The Yin Brotherhood",
        "wormhole": null,
        "planets": [{
            "name": "Darien",
            "resources": 4,
            "influence": 4,

            "specialties": null,
            "legendary": false
        }]
    },
    "4": {
        "type": "green",
        "faction": "The Embers of Muaat",
        "wormhole": null,
        "planets": [{
            "name": "Muaat",
            "resources": 4,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }]
    },
    "5": {
        "type": "green",
        "faction": "The Arborec",
        "wormhole": null,
        "planets": [{
            "name": "Nestphar",
            "resources": 3,
            "influence": 2,

            "specialties": null,
            "legendary": false
        }]
    },
    "6": {
        "type": "green",
        "faction": "The Lizix Mindnet",
        "wormhole": null,
        "planets": [{
            "name": "[0.0.0]",
            "resources": 5,
            "influence": 0,

            "specialties": null,
            "legendary": false
        }]
    },
    "7": {
        "type": "green",
        "faction": "The Winnu",
        "wormhole": null,
        "planets": [{
            "name": "Winnu",
            "resources": 3,
            "influence": 4,

            "specialties": null,
            "legendary": false
        }]
    },
    "8": {
        "type": "green",
        "faction": "The Nekro Virus",
        "wormhole": null,
        "planets": [{
            "name": "Mordai II",
            "resources": 4,
            "influence": 0,

            "specialties": null,
            "legendary": false
        }]
    },
    "9": {
        "type": "green",
        "faction": "The Naalu Collective",
        "wormhole": null,
        "planets": [{
            "name": "Maaluuk",
            "resources": 0,
            "influence": 2,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Druaa",
            "resources": 3,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "10": {
        "type": "green",
        "faction": "The Barony of Letnev",
        "wormhole": null,
        "planets": [{
            "name": "Arc Prime",
            "resources": 4,
            "influence": 0,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Wren Terra",
            "resources": 2,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "11": {
        "type": "green",
        "faction": "The Clan of Saar",
        "wormhole": null,
        "planets": [{
            "name": "Lisis II",
            "resources": 1,
            "influence": 0,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Ragh",
            "resources": 2,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "12": {
        "type": "green",
        "faction": "The Universities of Jol-Nar",
        "wormhole": null,
        "planets": [{
            "name": "Nar",
            "resources": 2,
            "influence": 3,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Jol",
            "resources": 1,
            "influence": 2,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "13": {
        "type": "green",
        "faction": "Sardakk N'orr",
        "wormhole": null,
        "planets": [{
            "name": "Tren'lak",
            "resources": 1,
            "influence": 0,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Quinarra",
            "resources": 3,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "14": {
        "type": "green",
        "faction": "The Xxcha Kingdom",
        "wormhole": null,
        "planets": [{
            "name": "Archon Ren",
            "resources": 2,
            "influence": 3,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Archon Tau",
            "resources": 1,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "15": {
        "type": "green",
        "faction": "The Yssaril Tribes",
        "wormhole": null,
        "planets": [{
            "name": "Retillion",
            "resources": 2,
            "influence": 3,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Shalloq",
            "resources": 1,
            "influence": 2,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "16": {
        "type": "green",
        "faction": "The Emirates of Hacan",
        "wormhole": null,
        "planets": [{
            "name": "Arretze",
            "resources": 2,
            "influence": 0,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Hercant",
            "resources": 1,
            "influence": 1,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Kamdorn",
            "resources": 0,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "17": {
        "type": "green",
        "faction": "The Ghosts of Creuss",
        "wormhole": "delta",
        "planets": []
    },
    "18": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Mecatol Rex",
            "resources": 1,
            "influence": 6,

            "specialties": null,
            "legendary": false
        }]
    },
    "19": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Wellon",
            "resources": 1,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": ["cybernetic"],
            "legendary": false
        }]
    },
    "20": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Vefut II",
            "resources": 2,
            "influence": 2,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }]
    },
    "21": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Thibah",
            "resources": 1,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["propulsion"],
            "legendary": false
        }]
    },
    "22": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Tar'mann",
            "resources": 1,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["biotic"],
            "legendary": false
        }]
    },
    "23": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Saudor",
            "resources": 2,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        }]
    },
    "24": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Mehar Xull",
            "resources": 1,
            "influence": 3,
            "traits": ["hazardous"],
            "specialties": ["warfare"],
            "legendary": false
        }]
    },
    "25": {
        "type": "blue",
        "wormhole": "beta",
        "planets": [{
            "name": "Quann",
            "resources": 2,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }]
    },
    "26": {
        "type": "blue",
        "wormhole": "alpha",
        "planets": [{
            "name": "Lodor",
            "resources": 3,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }]
    },
    "27": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "New Albion",
            "resources": 1,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["biotic"],
            "legendary": false
        },
        {
            "name": "Starpoint",
            "resources": 3,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "28": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Tequ'ran",
            "resources": 2,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Torkan",
            "resources": 0,
            "influence": 3,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "29": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Qucen'n",
            "resources": 1,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Rarron",
            "resources": 0,
            "influence": 3,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "30": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Mellon",
            "resources": 0,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Zohbat",
            "resources": 3,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "31": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Lazar",
            "resources": 1,
            "influence": 0,
            "traits": ["industrial"],
            "specialties": ["cybernetic"],
            "legendary": false
        },
        {
            "name": "Sakulag",
            "resources": 2,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "32": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Dal Bootha",
            "resources": 0,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Xxehan",
            "resources": 1,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "33": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Corneeq",
            "resources": 1,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Resulon",
            "resources": 2,
            "influence": 0,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "34": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Centauri",
            "resources": 1,
            "influence": 3,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Gral",
            "resources": 1,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["propulsion"],
            "legendary": false
        }
        ]
    },
    "35": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Bereg",
            "resources": 3,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Lirta IV",
            "resources": 2,
            "influence": 3,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "36": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Arnor",
            "resources": 2,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Lor",
            "resources": 1,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "37": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Arinam",
            "resources": 1,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Meer",
            "resources": 0,
            "influence": 4,
            "traits": ["hazardous"],
            "specialties": ["warfare"],
            "legendary": false
        }
        ]
    },
    "38": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Abyz",
            "resources": 3,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Fria",
            "resources": 2,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "39": {
        "type": "red",
        "wormhole": "alpha",
        "anomaly": null,
        "planets": []
    },
    "40": {
        "type": "red",
        "wormhole": "beta",
        "anomaly": null,
        "planets": []
    },
    "41": {
        "type": "red",
        "wormhole": null,
        "anomaly": "gravity-rift",
        "planets": []
    },
    "42": {
        "type": "red",
        "wormhole": null,
        "anomaly": "nebula",
        "planets": []
    },
    "43": {
        "type": "red",
        "wormhole": null,
        "anomaly": "supernova",
        "planets": []
    },
    "44": {
        "type": "red",
        "wormhole": null,
        "anomaly": "asteroid-field",
        "planets": []
    },
    "45": {
        "type": "red",
        "wormhole": null,
        "anomaly": "asteroid-field",
        "planets": []
    },
    "46": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "47": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "48": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "49": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "50": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "51": {
        "type": "green",
        "wormhole": "delta",
        "planets": [{
            "name": "Creuss",
            "resources": 4,
            "influence": 2,
            "specialties": null,
            "legendary": false
        }]
    },
    "52": {
        "type": "green",
        "faction": "The Mahact Gene-sorcerers",
        "wormhole": null,
        "planets": [{
            "name": "Ixth",
            "resources": 3,
            "influence": 5,

            "specialties": null,
            "legendary": false
        }]
    },
    "53": {
        "type": "green",
        "faction": "The Nomad",
        "wormhole": null,
        "planets": [{
            "name": "Arcturus",
            "resources": 4,
            "influence": 4,

            "specialties": null,
            "legendary": false
        }]
    },
    "54": {
        "type": "green",
        "faction": "The Vuil'raith Cabal",
        "wormhole": null,
        "planets": [{
            "name": "Acheron",
            "resources": 4,
            "influence": 0,

            "specialties": null,
            "legendary": false
        }]
    },
    "55": {
        "type": "green",
        "faction": "The Titans of Ul",
        "wormhole": null,
        "planets": [{
            "name": "Elysium",
            "resources": 4,
            "influence": 1,

            "specialties": null,
            "legendary": false
        }]
    },
    "56": {
        "type": "green",
        "faction": "The Empyrean",
        "wormhole": null,
        "planets": [{
            "name": "The Dark",
            "resources": 3,
            "influence": 4,

            "specialties": null,
            "legendary": false
        }]
    },
    "57": {
        "type": "green",
        "faction": "The Naaz-Rokha Alliance",
        "wormhole": null,
        "planets": [{
            "name": "Naazir",
            "resources": 2,
            "influence": 1,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Rokha",
            "resources": 1,
            "influence": 2,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "58": {
        "type": "green",
        "faction": "The Argent Flight",
        "wormhole": null,
        "planets": [{
            "name": "Valk",
            "resources": 2,
            "influence": 0,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Avar",
            "resources": 1,
            "influence": 1,

            "specialties": null,
            "legendary": false
        },
        {
            "name": "Ylir",
            "resources": 0,
            "influence": 2,

            "specialties": null,
            "legendary": false
        }
        ]
    },
    "59": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Archon Vail",
            "resources": 1,
            "influence": 3,
            "traits": ["hazardous"],
            "specialties": ["propulsion"],
            "legendary": false
        }]
    },
    "60": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Perimeter",
            "resources": 2,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        }]
    },
    "61": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Ang",
            "resources": 2,
            "influence": 0,
            "traits": ["industrial"],
            "specialties": ["warfare"],
            "legendary": false
        }]
    },
    "62": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Sem-Lore",
            "resources": 3,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": ["cybernetic"],
            "legendary": false
        }]
    },
    "63": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Vorhal",
            "resources": 0,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": ["biotic"],
            "legendary": false
        }]
    },
    "64": {
        "type": "blue",
        "wormhole": "beta",
        "planets": [{
            "name": "Atlas",
            "resources": 3,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }]
    },
    "65": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Primor",
            "resources": 2,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": "You may exhaust this card at the end of your turn to place up to 2 infantry from your reinforcements on any planet you control"
        }]
    },
    "66": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Hope's End",
            "resources": 3,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": "You may exhaust this card at the end of your turn to place 1 mech from your reinforcements on any planet you control, or draw 1 action card"
        }]
    },
    "67": {
        "type": "red",
        "wormhole": null,
        "anomaly": "gravity-rift",
        "planets": [{
            "name": "Cormund",
            "resources": 2,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }]
    },
    "68": {
        "type": "red",
        "wormhole": null,
        "anomaly": "nebula",
        "planets": [{
            "name": "Everra",
            "resources": 3,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }]
    },
    "69": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Accoen",
            "resources": 2,
            "influence": 3,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Jeol Ir",
            "resources": 2,
            "influence": 3,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "70": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Kraag",
            "resources": 2,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Siig",
            "resources": 0,
            "influence": 2,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "71": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Ba'Kal",
            "resources": 3,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Alio Prima",
            "resources": 1,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "72": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Lisis",
            "resources": 2,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Velnor",
            "resources": 2,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["warfare"],
            "legendary": false
        }
        ]
    },
    "73": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Cealdri",
            "resources": 0,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": ["cybernetic"],
            "legendary": false
        },
        {
            "name": "Xanhact",
            "resources": 0,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "74": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Vega Major",
            "resources": 2,
            "influence": 1,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Vega Minor",
            "resources": 1,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": ["propulsion"],
            "legendary": false
        }
        ]
    },
    "75": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Loki",
            "resources": 1,
            "influence": 2,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Abaddon",
            "resources": 1,
            "influence": 0,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Ashtroth",
            "resources": 2,
            "influence": 0,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        }
        ]
    },
    "76": {
        "type": "blue",
        "wormhole": null,
        "planets": [{
            "name": "Rigel I",
            "resources": 0,
            "influence": 1,
            "traits": ["hazardous"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Rigel II",
            "resources": 1,
            "influence": 2,
            "traits": ["industrial"],
            "specialties": null,
            "legendary": false
        },
        {
            "name": "Rigel III",
            "resources": 1,
            "influence": 1,
            "traits": ["industrial"],
            "specialties": ["biotic"],
            "legendary": false
        }
        ]
    },
    "77": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "78": {
        "type": "red",
        "wormhole": null,
        "anomaly": null,
        "planets": []
    },
    "79": {
        "type": "red",
        "wormhole": "alpha",
        "anomaly": "asteroid-field",
        "planets": []
    },
    "80": {
        "type": "red",
        "wormhole": null,
        "anomaly": "supernova",
        "planets": []
    },
    "81": {
        "type": "red",
        "wormhole": null,
        "anomaly": "muaat-supernova",
        "planets": []
    },
    "82": {
        "type": "blue",
        "wormhole": "all",
        "planets": [{
            "name": "Mallice",
            "resources": 0,
            "influence": 3,
            "traits": ["cultural"],
            "specialties": null,
            "legendary": "You may exhaust this card at the end of your turn to gain 2 trade goods or convert all of your commodities into trade goods"
        }]
    },
    "83A": {
        "type": "hyperlane",
        "hyperlanes": [
            [1, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "83B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 2],
            [3, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "84A": {
        "type": "hyperlane",
        "hyperlanes": [
            [2, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "84B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 4],
            [1, 3]
        ],
        "wormhole": null,
        "planets": []
    },
    "85A": {
        "type": "hyperlane",
        "hyperlanes": [
            [1, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "85B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 2],
            [3, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "86A": {
        "type": "hyperlane",
        "hyperlanes": [
            [1, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "86B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 4],
            [1, 3]
        ],
        "wormhole": null,
        "planets": []
    },
    "87A": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 2],
            [2, 4],
            [2, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "87B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 2],
            [0, 3]
        ],
        "wormhole": null,
        "planets": []
    },
    "88A": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "88B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 2],
            [3, 5]
        ],
        "wormhole": null,
        "planets": []
    },
    "89A": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 2],
            [0, 4],
            [2, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "89B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "90A": {
        "type": "hyperlane",
        "hyperlanes": [
            [1, 5],
            [2, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "90B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 4]
        ],
        "wormhole": null,
        "planets": []
    },
    "91A": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 3],
            [0, 4],
            [1, 3]
        ],
        "wormhole": null,
        "planets": []
    },
    "91B": {
        "type": "hyperlane",
        "hyperlanes": [
            [0, 2],
            [0, 3]
        ],
        "wormhole": null,
        "planets": []
    },
    "92": {
        "type": "green",
        "faction": "Last Bastion",
        "wormhole": null,
        "anomaly": "nebula",
        "planets": [
            {
                "name": "Ordinian",
                "resources": 0,
                "influence": 0,

                "legendary": "You may exhaust this card when you pass to draw 1 action card and gain 1 command token",
                "specialties": []
            }
        ],
        "stations": [
            {
                "name": "Revelation",
                "resources": 1,
                "influence": 2
            }
        ]
    },
    "93": {
        "type": "green",
        "faction": "The Ral Nel Consortium",
        "wormhole": null,
        "planets": [
            {
                "name": "Mez Lo Orz Fei Zsha",
                "resources": 2,
                "influence": 1,

                "legendary": false,
                "specialties": []
            },
            {
                "name": "Rep Lo Orz Qet",
                "resources": 1,
                "influence": 3,

                "legendary": false,
                "specialties": []
            }
        ]
    },
    "94": {
        "type": "green",
        "faction": "The Crimson Rebellion",
        "wormhole": "epsilon",
        "planets": []
    },
    "95": {
        "type": "green",
        "faction": "The Deepwrought Scholarate",
        "wormhole": null,
        "planets": [
            {
                "name": "Ikatena",
                "resources": 4,
                "influence": 4,

                "legendary": false,
                "specialties": []
            }
        ]
    },
    "96a": {
        "type": "green",
        "faction": "The Firmament",
        "wormhole": null,
        "planets": [
            {
                "name": "Cronos",
                "resources": 2,
                "influence": 1,

                "legendary": false,
                "specialties": []
            },
            {
                "name": "Tallin",
                "resources": 1,
                "influence": 2,

                "legendary": false,
                "specialties": []
            }
        ]
    },
    "96b": {
        "type": "green",
        "faction": "The Obsidian",
        "wormhole": null,
        "planets": [
            {
                "name": "Cronos Hollow",
                "resources": 3,
                "influence": 0,

                "legendary": false,
                "specialties": []
            },
            {
                "name": "Tallin Hollow",
                "resources": 3,
                "influence": 0,

                "legendary": false,
                "specialties": []
            }
        ]
    },
    "97": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Paunus",
                "resources": 1,
                "influence": 3,
                "traits": ["industrial"],
                "legendary": "You may exhaust this card when you pass to gain control of a non-home, non-legendary planet that contains no units and has no attachments.",
                "specialties": [
                    "biotic"
                ]
            }
        ]
    },
    "98": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Garbozia",
                "resources": 2,
                "influence": 1,
                "traits": ["hazardous"],
                "legendary": "You may exhaust this card when you pass to place 1 action card from the discard pile faceup on this card; you can purge cards on this card to play them as if they were in your hand.",
                "specialties": []
            }
        ]
    },
    "99": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Emelpar",
                "resources": 0,
                "influence": 2,
                "traits": ["cultural"],
                "legendary": "You may exhaust this card at the end of your turn to ready another component that isn't a strategy card.",
                "specialties": []
            }
        ]
    },
    "100": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Tempesta",
                "resources": 1,
                "influence": 1,
                "traits": ["hazardous"],
                "legendary": "You may exhaust this card after you activate a system to apply +1 to the move value of 1 of your ships during this tactical action.",
                "specialties": [
                    "propulsion"
                ]
            }
        ]
    },
    "101": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Olergodt",
                "resources": 2,
                "influence": 1,
                "traits": [
                    "cultural",
                    "hazardous"
                ],
                "legendary": false,
                "specialties": [
                    "cybernetic",
                    "warfare"
                ]
            }
        ]
    },
    "102": {
        "type": "blue",
        "wormhole": "alpha",
        "planets": [
            {
                "name": "Andeara",
                "resources": 1,
                "influence": 1,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": [
                    "propulsion"
                ]
            }
        ]
    },
    "103": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Vira-Pics III",
                "resources": 2,
                "influence": 3,
                "traits": [
                    "cultural",
                    "hazardous"
                ],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "104": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Lesab",
                "resources": 2,
                "influence": 1,
                "traits": [
                    "hazardous",
                    "industrial"
                ],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "105": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "New Terra",
                "resources": 1,
                "influence": 1,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": [
                    "biotic"
                ]
            },
            {
                "name": "Tinnes",
                "resources": 2,
                "influence": 1,
                "traits": [
                    "hazardous",
                    "industrial"
                ],
                "legendary": false,
                "specialties": [
                    "biotic"
                ]
            }
        ]
    },
    "106": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Cresius",
                "resources": 0,
                "influence": 1,
                "traits": ["hazardous"],
                "legendary": false,
                "specialties": []
            },
            {
                "name": "Lazul Rex",
                "resources": 2,
                "influence": 2,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "107": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Tiamat",
                "resources": 1,
                "influence": 2,
                "traits": ["cultural"],
                "legendary": false,
                "specialties": [
                    "cybernetic",
                    "cybernetic"
                ]
            },
            {
                "name": "Hercalor",
                "resources": 1,
                "influence": 0,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "108": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Kosboth",
                "resources": 0,
                "influence": 1,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": []
            },
            {
                "name": "Capha",
                "resources": 3,
                "influence": 0,
                "traits": ["hazardous"],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "109": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Bellatrix",
                "resources": 1,
                "influence": 2,
                "traits": ["industrial"],
                "legendary": false,
                "specialties": []
            }
        ],
        "stations": [
            {
                "name": "Tsion Station",
                "resources": 1,
                "influence": 1
            }
        ]
    },
    "110": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Horizon",
                "resources": 1,
                "influence": 2,
                "traits": ["cultural"],
                "legendary": false,
                "specialties": []
            },
            {
                "name": "Elnath",
                "resources": 2,
                "influence": 0,
                "traits": ["hazardous"],
                "legendary": false,
                "specialties": []
            },
            {
                "name": "Luthien VI",
                "resources": 3,
                "influence": 1,
                "traits": ["hazardous"],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "111": {
        "type": "blue",
        "wormhole": null,
        "planets": [
            {
                "name": "Tarana",
                "resources": 1,
                "influence": 2,
                "traits": [
                    "industrial",
                    "cultural"
                ],
                "legendary": false,
                "specialties": []
            }
        ],
        "stations": [
            {
                "name": "Oluz Station",
                "resources": 1,
                "influence": 1
            }
        ]
    },
    "112": {
        "type": "blue",
        "wormhole": null,
        "anomaly": null,
        "planets": [
            {
                "name": "Mecatol Rex",
                "resources": 1,
                "influence": 6,

                "legendary": "",
                "specialties": []
            }
        ]
    },
    "113": {
        "type": "red",
        "wormhole": "beta",
        "anomaly": "gravity rift",
        "planets": []
    },
    "114": {
        "type": "red",
        "wormhole": null,
        "anomaly": "entropic scar",
        "planets": []
    },
    "115": {
        "type": "red",
        "wormhole": null,
        "anomaly": "asteroid field",
        "planets": [
            {
                "name": "Industrex",
                "resources": 2,
                "influence": 0,
                "traits": ["industrial"],
                "legendary": "You may exhaust this card when you pass to place 1 ship that matches a unit upgrade technology you owm from your reinforcements into a system that contains your ships.",
                "specialties": [
                    "warfare"
                ]
            }
        ]
    },
    "116": {
        "type": "red",
        "wormhole": null,
        "anomaly": "entropic scar",
        "planets": [
            {
                "name": "Lemox",
                "resources": 0,
                "influence": 3,
                "traits": ["cultural"],
                "legendary": false,
                "specialties": []
            }
        ]
    },
    "117": {
        "type": "red",
        "wormhole": null,
        "planets": [],
        "stations": [
            {
                "name": "The Watchtower",
                "resources": 1,
                "influence": 1
            }
        ]
    },
    // "118": {
    //     "type": "green",
    //     "wormhole": "epsilon",
    //     "planets": [
    //         {
    //             "name": "Ahk Creuxx",
    //             "resources": 4,
    //             "influence": 2,

    //             "legendary": false,
    //             "specialties": []
    //         }
    //     ]
    // },
}