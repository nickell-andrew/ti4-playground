import React, { useCallback, useState, useEffect, useRef, useMemo, CSSProperties } from 'react';
import { DndContext, DragEndEvent, UniqueIdentifier, useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors } from '@dnd-kit/core';
import './HexBoard.css';

import { Coordinates } from "@dnd-kit/utilities";
import { DraggableItem } from "./dragAndDrop/DraggableItem";
import { Wrapper } from "./dragAndDrop/components"

import { UNITS, TOKENS, BASE_FACTION_COLORS, baseFactionColors, units, tokens, ALL_PIECES, PLAYERS, allPieces, pieceSize } from './consts';
import { generateTiles } from './utils/generateTiles';
import { TileMap, tilesInfo } from '../assets/data/tiles';
import { TIER, tileTiers } from '../assets/data/tile-selection';
import { allTiles, homeSystemTiles, TILE_NUMBERS, tileNumbers } from '../assets/tiles';
import allUnitImages from '../assets/units';
import allTokenImages from '../assets/tokens';
import { ImageComponentProps } from '../assets/units/black';


// Define the corner coordinates based on the grid size
// The grid is generated with q and r from -3 to 3, with s = -q - r
const cornerCoordinates = [
  { q: -3, r: 3, s: 0 },   // Bottom-left
  { q: -3, r: 0, s: 3 },   // Top-left
  { q: 0, r: -3, s: 3 },   // Top
  { q: 3, r: -3, s: 0 },   // Top-right
  { q: 3, r: 0, s: -3 },   // Bottom-right
  { q: 0, r: 3, s: -3 }    // Bottom
];

const tooltipTextForTile = (tile: TILE_NUMBERS, tileData: TileMap): string => {
  let tileInfo = tileData[tile]

  if (tileInfo.faction || tileInfo.planets.length > 0) {
    return tileInfo?.faction ||
      tileInfo?.planets.map(planet => planet.name).join(' ')
  }

  let wormholeText = tileInfo.wormhole ?? ""
  let anomalyText = tileInfo.anomaly ?? ""
  if (wormholeText.length > 0 && anomalyText.length > 0) {
    return `${wormholeText} ${anomalyText}`
  } else if (wormholeText.length > 0) {
    return `${wormholeText} wormhole`
  } else if (anomalyText.length > 0) {
    return `${anomalyText}`
  }
  return "Empty"
}

// Define a type for the map data
interface MapData {
  hexTiles: Record<string, TILE_NUMBERS>;
  allDraggablesByUid: DraggablePiecePropsByUid;
  timestamp: number;
}

interface HexProps {
  q: number;
  r: number;
  s: number;
  extraSystem?: boolean
  boardSize: number;
  tile: TILE_NUMBERS | null;
  isLocked: boolean;
  onClick: (event: React.MouseEvent) => void;
}

const getBoardSize = () => {
  // return 9 * 168 + 12
  return 1000
  // Math.max(
  //   Math.min(window.innerWidth - 40, window.innerHeight - 40),
  //   1000
  // );
}

const getScaleFactor = (boardSize?: number): number => {
  // Calculate position based on relative percentages
  const baseSize = Math.min(boardSize ?? getBoardSize(), 1000);

  // Scale the positioning based on the current board size
  const scaleFactor = baseSize / 1000;
  return scaleFactor
}

const Hexagon: React.FC<HexProps> = ({ q, r, s, boardSize, tile, isLocked, extraSystem = false, onClick }) => {
  let extraSystemStyle: CSSProperties = {}
  if (extraSystem) {
    extraSystemStyle = {
      backgroundColor: "gray",
      pointerEvents: "none"
    }
  }

  const scaleFactor = getScaleFactor(boardSize)

  // Calculate hexagon dimensions for pointy-top orientation
  const hexWidth = 180 * scaleFactor;
  const hexHeight = 160 * scaleFactor;

  // For pointy-top hexagons:
  // - Horizontal distance between centers: width * sqrt(3)/2 (≈ 0.866)
  // - Vertical distance between centers: height * 3/4

  const horizontalSpacing = hexWidth * 0.751; // sqrt(3)/2 of width
  const verticalSpacing = hexHeight * 0.995

  // Calculate position with proper offsets for pointy-top orientation
  const left = (q + 1.1) * horizontalSpacing + (boardSize / 2) - (hexWidth / 2); // Center horizontally
  const top = 240 + (r * verticalSpacing + q * verticalSpacing * 0.5) + (boardSize / 2) * 1 - (hexHeight / 2); // Center vertically with adjustment

  const style = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${hexWidth}px`,
    height: `${hexHeight}px`
  };

  // Background style for the tile image
  const backgroundStyle = tile ? {
    backgroundImage: `url(${allTiles[tile]})`,
    // backgroundImage: `url(${urlBase}/${tile})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <div
      className="hexagon"
      style={{ ...style, ...backgroundStyle, ...(isLocked ? { pointerEvents: 'none' } : {}), ...extraSystemStyle }}
      onClick={onClick}
    >
      <div className="hexagon-content">
        {!(tile || extraSystem) && `${q},${r},${s}`}
      </div>
    </div>
  );
};

// TilePicker component
interface TilePickerProps {
  selectedTile: string | null;
  activeHex: { q: number, r: number, s: number } | null;
  onSelectTile: (tile: TILE_NUMBERS | null) => void;
  onClose: () => void;
  position: { x: number, y: number } | null;
}

const TilePicker: React.FC<TilePickerProps> = ({ selectedTile, activeHex, onSelectTile, onClose, position }) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const defaultActiveCategory = cornerCoordinates.find(coord => coord.q === activeHex?.q && coord.r === activeHex?.r && coord.s === activeHex?.s) !== undefined ? "home" : "all";
  const [activeCategory, setActiveCategory] = useState<string>(defaultActiveCategory);
  const [activeTier, setActiveTier] = useState<TIER | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Filter tiles based on search input, active category, and active tier
  const filteredTiles = useMemo(() => {
    const filteredTiles = Object.values(tileNumbers).filter(tileNumber => {
      const tile = tilesInfo[tileNumber]
      const matchesSearch = `
        ${tile.anomaly || ""}|
        ${tile.faction || ""}|
        ${tile.planets.map(p => {
        return `
            ${p.name}|
            ${p.trait || ""}|
            ${p.legendary ? "legendary" : ""}|
            ${p.specialty}
          `
      }).join('|')}|
        ${tile.type || ""}
        ${tile.wormhole || ""}
      `.toLowerCase().includes(filter.toLowerCase())

      // For home systems category
      if (activeCategory === "home") {
        return Object.values(homeSystemTiles) && matchesSearch;
      }

      // For all tiles category (excluding home systems)
      if (activeCategory === "all") {
        // Remove home system tiles from All Tiles category
        if (tile.faction != null) {
          return false;
        }

        // If a tier filter is active, apply it
        if (activeTier) {
          return tileTiers[activeTier].includes(tileNumber) && matchesSearch;
        }

        return matchesSearch;
      }

      if (activeCategory === "hyperlanes") {
        return false
      }

      return false;
    });
    return filteredTiles
  }, [filter, activeCategory, activeTier])

  // Display a subset of tiles or all if showAll is true
  const displayedTiles = showAll ? filteredTiles : filteredTiles.slice(0, 24);

  if (!position) return null;

  const handleTileSelect = (tile: TILE_NUMBERS | null) => {
    onSelectTile(tile);
    onClose();
  };

  const handleTierSelect = (tier: TIER | null) => {
    setActiveTier(tier);
  };

  return (
    <div className="tile-picker-overlay">
      <div className="tile-picker" ref={pickerRef}>
        <div className="tile-picker-header">
          <h3>Select a Tile</h3>
          <input
            type="text"
            placeholder="Search tiles (e.g. ST_18, DS_axis)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="category-buttons">
            <button
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => {
                setActiveCategory("all");
                setActiveTier(null);
              }}
            >
              All Tiles
            </button>
            <button
              className={activeCategory === "home" ? "active" : ""}
              onClick={() => {
                setActiveCategory("home");
                setActiveTier(null);
              }}
            >
              Home Systems
            </button>
            <button
              className={activeCategory === "hyperlanes" ? "active" : ""}
              onClick={() => {
                setActiveCategory("hyperlanes");
                setActiveTier(null);
              }}
            >
              Hyperlanes
            </button>
          </div>

          {activeCategory === "all" && (
            <div className="tier-buttons">
              <button
                className={activeTier === null ? "active" : ""}
                onClick={() => handleTierSelect(null)}
              >
                All
              </button>
              <button
                className={activeTier === "high" ? "active" : ""}
                onClick={() => handleTierSelect("high")}
              >
                High Value
              </button>
              <button
                className={activeTier === "mid" ? "active" : ""}
                onClick={() => handleTierSelect("mid")}
              >
                Mid Value
              </button>
              <button
                className={activeTier === "low" ? "active" : ""}
                onClick={() => handleTierSelect("low")}
              >
                Low Value
              </button>
              <button
                className={activeTier === "red" ? "active" : ""}
                onClick={() => handleTierSelect("red")}
              >
                Red
              </button>
            </div>
          )}

          <button onClick={() => handleTileSelect(null)}>Clear Selection</button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="tile-grid">
          {displayedTiles.map((tile, index) => (

            <div
              key={index}
              className={`tile-option ${selectedTile === tile ? 'selected' : ''} tooltip`}
              onClick={() => handleTileSelect(tile)}
            >
              <img src={allTiles[tile]} alt={`Tile ${tile})}`} />
              <span className="tooltiptext"> {tooltipTextForTile(tile, tilesInfo)}</span>
            </div>
          ))}
          {filteredTiles.length > 24 && !showAll && (
            <button onClick={() => setShowAll(true)}>
              Show {filteredTiles.length - 24} more...
            </button>
          )}
          {showAll && filteredTiles.length > 24 && (
            <button onClick={() => setShowAll(false)}>Show less</button>
          )}
        </div>
      </div>
    </div>
  );
};

interface DraggablePieceProps {
  player: PLAYERS;
  name: ALL_PIECES;
  pieceNumber: number;
  x?: number;
  y?: number;
  style?: CSSProperties;
}

const getUidFromDraggablePieceProps = ({ player, name, pieceNumber }: DraggablePieceProps): UniqueIdentifier => {
  return `${player}-${name}-${pieceNumber}`;
}

const getAltTextFromDraggablePieceProps = ({ player, name, pieceNumber }: DraggablePieceProps): string => {
  return `${player}-${name}-${pieceNumber}`;
}


type CoordinateOffsets = {
  // base: Coordinates
  [allPieces.Carrier]: Coordinates
  [allPieces.CommandCounter]: Coordinates
  [allPieces.Cruiser]: Coordinates
  [allPieces.Mech]: Coordinates
  [allPieces.Infantry]: Coordinates
  [allPieces.Dreadnought]: Coordinates
  [allPieces.Destroyer]: Coordinates
  [allPieces.Fighter]: Coordinates
  [allPieces.Flagship]: Coordinates
  [allPieces.Spacedock]: Coordinates
  [allPieces.PDS]: Coordinates
  [allPieces.Warsun]: Coordinates
  // [allPieces.Flagship]: Coordinates
}

type columns = 'col-4' | 'col-3' | 'col-2' | 'col-1' | 'col0' | 'col1' | 'col3' | 'col4'
type rows = 'row-8' | 'row-7' | 'row-5' | 'row-4' | 'row-2' | 'row0' | 'row2' | 'row4' | 'row5' | 'row7' | 'row8'
const measurements: Record<columns | rows, number> = {
  'col-4': 90,
  'col-3': 223,
  'col-2': 391,
  'col-1': 494,
  'col0': 627,
  'col1': 764,
  'col3': 1035,
  'col4': 1170,

  'row-8': 70,
  'row-7': 150,
  'row-5': 310,
  'row-4': 390,
  'row-2': 550,
  'row0': 710,
  'row2': 870,
  'row4': 1030,
  'row5': 1110,
  'row7': 1270,
  'row8': 1350,
}
const referencePoints: Record<string, Coordinates> = {
  mecatol: { x: measurements['col0'], y: measurements['row0'] },
  p1h1: { x: measurements['col-1'], y: measurements['row-7'] },
  p1h2: { x: measurements['col0'], y: measurements['row-8'] },
  p1h3: { x: measurements['col1'], y: measurements['row-7'] },
  p2h1: { x: measurements['col3'], y: measurements['row-5'] },
  p2h2: { x: measurements['col4'], y: measurements['row-4'] },
  p2h3: { x: measurements['col4'], y: measurements['row-2'] },
  p3h1: { x: measurements['col3'], y: measurements['row5'] },
  p3h2: { x: measurements['col4'], y: measurements['row4'] },
  p3h3: { x: measurements['col4'], y: measurements['row2'] },
  p4h1: { x: measurements['col-1'], y: measurements['row7'] },
  p4h2: { x: measurements['col0'], y: measurements['row8'] },
  p4h3: { x: measurements['col1'], y: measurements['row7'] },
  p5h1: { x: measurements['col-4'], y: measurements['row2'] },
  p5h2: { x: measurements['col-4'], y: measurements['row4'] },
  p5h3: { x: measurements['col-3'], y: measurements['row5'] },
  p6h1: { x: measurements['col-4'], y: measurements['row-2'] },
  p6h2: { x: measurements['col-4'], y: measurements['row-4'] },
  p6h3: { x: measurements['col-3'], y: measurements['row-5'] },
}
const pieceOffsetInHex: Record<string, Coordinates> = {
  "commandCounter1": { x: -25, y: -40 },
  "commandCounter2": { x: -5, y: -47 },
  "commandCounter3": { x: 15, y: -42 },

  "commandCounter4": { x: 60, y: -5 },
  "commandCounter5": { x: 25, y: -1 },
  "commandCounter6": { x: 51, y: 20 },

  "commandCounter7": { x: 5, y: 50 },
  "commandCounter8": { x: 25, y: 65 },
}
const coordOffsetsAllPieces: CoordinateOffsets = {
  [allPieces.Carrier]: { x: 25, y: 40 },
  [allPieces.Cruiser]: { x: -45, y: 5 },
  [allPieces.Mech]: { x: 35, y: -35 },
  [allPieces.Infantry]: { x: 0, y: -45 },
  [allPieces.Dreadnought]: { x: -40, y: 50 },
  [allPieces.Destroyer]: { x: -35, y: -35 },
  [allPieces.Fighter]: { x: 55, y: 10 },
  [allPieces.Flagship]: { x: -40, y: 50 },
  [allPieces.Spacedock]: { x: -35, y: -35 },
  [allPieces.PDS]: { x: 0, y: -55 },
  [allPieces.Warsun]: { x: 30, y: 50 },
  [allPieces.CommandCounter]: { x: 40, y: -40 },
}

const getInitialCoordinates = ({ player, name, pieceNumber }: DraggablePieceProps): Coordinates => {
  let base: Coordinates, offset: Coordinates
  if (name === 'commandCounter' && pieceNumber < 9) {
    base = referencePoints[`p${player}h3`]
    offset = pieceOffsetInHex[`${name}${pieceNumber}`]
    return { x: base.x + offset.x, y: base.y + offset.y }
  }
  switch (name) {
    case allPieces.Carrier:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Cruiser:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Destroyer:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Dreadnought:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Spacedock:
      base = referencePoints[`p${player}h2`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.PDS:
      base = referencePoints[`p${player}h2`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Flagship:
      base = referencePoints[`p${player}h2`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Infantry:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Mech:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Warsun:
      base = referencePoints[`p${player}h2`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.CommandCounter:
      base = referencePoints[`p${player}h2`]
      offset = coordOffsetsAllPieces[name]
      break;
    case allPieces.Fighter:
      base = referencePoints[`p${player}h1`]
      offset = coordOffsetsAllPieces[name]
  }
  return { x: base.x + offset.x, y: base.y + offset.y }
}

type PNGsForFaction = Record<ALL_PIECES, React.FC<ImageComponentProps>>
type allPNGsType = Record<BASE_FACTION_COLORS, PNGsForFaction>

const allPNGs: allPNGsType = Object.values(baseFactionColors).reduce((dict, color) => {
  dict[color] = {
    ...Object.values(units).reduce((dict, name) => {
      dict[name] = allUnitImages[color][name]
      return dict
    }, {} as PNGsForFaction),
    ...Object.values(tokens).reduce((dict, name) => {
      dict[name] = allTokenImages[name][color]
      return dict
    }, {} as PNGsForFaction)
  }
  return dict
}, {} as allPNGsType)

const colorsByPlayer: Record<PLAYERS, BASE_FACTION_COLORS> = {
  1: baseFactionColors.Green,
  2: baseFactionColors.Purple,
  3: baseFactionColors.Black,
  4: baseFactionColors.Pink,
  5: baseFactionColors.Yellow,
  6: baseFactionColors.Blue
}

const getImageFromDraggablePieceProps = ({ player, name, pieceNumber }: DraggablePieceProps, scaleFactor: number): React.ReactNode => {
  const [width, height] = pieceSize[name]
  let Component = allPNGs[colorsByPlayer[player]][name]
  return <Component
    alt={getAltTextFromDraggablePieceProps({ player, name, pieceNumber })}
    style={{ width: `${width}px`, height: `${height}px` }}
  />
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({ x, y, ...props }) => {
  const uid = useMemo(() => getUidFromDraggablePieceProps(props), [props])
  const svg = useMemo(() => getImageFromDraggablePieceProps(props, 1), [props])
  return (
    <DraggableItem
      {...props}
      uid={uid}
      top={y}
      left={x}
    >
      {svg}
    </DraggableItem>
  );
}

interface DraggableContainerProps {
  children: React.ReactNode
  onDragEnd(event: DragEndEvent): void
  draggableItems: React.ReactNode
}

type DraggablePiecePropsByUid = Record<UniqueIdentifier, DraggablePieceProps>

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  onDragEnd,
  draggableItems,
}: DraggableContainerProps) => {
  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
    >
      <Wrapper>
        {children}
        {draggableItems}
      </Wrapper>
    </DndContext>
  );
}

const getDraggablePieceProps = (player: number) => {
  let unitInfo: [UNITS, number][] = [
    ["infantry", 12],
    ["mech", 4],
    ["spacedock", 3],
    ["pds", 6],
    ["fighter", 10],
    ["destroyer", 8],
    ["cruiser", 8],
    ["carrier", 4],
    ["dreadnought", 5],
    ["warsun", 2],
    ["flagship", 1],
  ];

  let cardboard: [TOKENS, number][] = [
    ["commandCounter", 16],
  ];
  let draggablesByUid: DraggablePiecePropsByUid = {}
  unitInfo.forEach(([name, count]) => {
    for (let i = 1; i <= count; i++) {
      let props = { player, name, pieceNumber: i }
      let coords = getInitialCoordinates(props)
      let uid = getUidFromDraggablePieceProps(props)
      draggablesByUid[uid] = { ...props, ...coords }
    }
  });
  cardboard.forEach(([name, count]) => {
    for (let i = 1; i <= count; i++) {
      let props = { player, name, pieceNumber: i }
      let coords = getInitialCoordinates(props)
      let uid = getUidFromDraggablePieceProps(props)
      draggablesByUid[uid] = { ...props, ...coords }
    }
  })
  return draggablesByUid
}

const HexBoard: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(getBoardSize());
  const [selectedTile, setSelectedTile] = useState<TILE_NUMBERS | null>(null);
  const [hexTiles, setHexTiles] = useState<Record<string, TILE_NUMBERS>>({});
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<{ x: number, y: number } | null>(null);
  const [activeHex, setActiveHex] = useState<{ q: number, r: number, s: number } | null>(null);
  const [locked, setLocked] = useState<boolean>(false);

  // DnD handlers
  const [allDraggables, setAllDraggables] = useState<DraggablePiecePropsByUid>(
    [1, 2, 3, 4, 5, 6].reduce((draggablesByUid, player) => {
      return Object.assign(draggablesByUid, getDraggablePieceProps(player))
    }, {} as DraggablePiecePropsByUid)
  );

  const draggableItems = useMemo(() => {
    return Object.entries(allDraggables).map(([uid, props]) => {
      const style = {
        height: 0,
        width: 0,
      }

      return <DraggablePiece
        key={uid}
        {...props}
        style={style}
      />
    })
  }, [allDraggables])

  useEffect(() => {
    const handleResize = () => {
      setBoardSize(getBoardSize());
    };

    window.addEventListener('resize', handleResize);

    // Try to load saved map from localStorage
    const savedMap = localStorage.getItem('tiMapData');
    if (savedMap) {
      try {
        const mapData: MapData = JSON.parse(savedMap);
        setHexTiles(mapData.hexTiles);
        if (mapData.allDraggablesByUid && Object.keys(mapData.allDraggablesByUid).length > 0) {
          setAllDraggables(mapData.allDraggablesByUid)
        }
        setLocked(true)
      } catch (e) {
        console.error('Failed to load saved map:', e);
      }
    } else {
      // Initialize corner tiles with Green Tile if no saved map exists
      const initialTiles: Record<string, TILE_NUMBERS> = {};

      // Set First Tile for each corner
      cornerCoordinates.forEach(coord => {
        const hexKey = `${coord.q},${coord.r},${coord.s}`;
        initialTiles[hexKey] = tileNumbers.tile0;
      });

      // Set the central tile to Tile 18 (Mecatol Rex)
      initialTiles['0,0,0'] = tileNumbers.tile18;

      setHexTiles(initialTiles);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hexagons: { q: number; r: number; s: number, extraSystem?: boolean }[] = useMemo(generateTiles, []);

  // Handle hex click to open the picker
  const handleHexClick = useCallback((q: number, r: number, s: number, event: React.MouseEvent) => {
    if (locked) return;
    setActiveHex({ q, r, s });
    setShowPicker(true);
    setPickerPosition({ x: 0, y: 0 }); // Position will be centered by CSS
  }, [locked, setActiveHex, setShowPicker, setPickerPosition]);

  // Handle tile selection
  const handleTileSelect = useCallback((tile: TILE_NUMBERS | null) => {
    setSelectedTile(tile);

    if (activeHex && tile) {
      const { q, r, s } = activeHex;
      const hexKey = `${q},${r},${s}`;
      setHexTiles(prev => ({
        ...prev,
        [hexKey]: tile
      }));
    }
  }, [setSelectedTile, activeHex, setHexTiles]);

  // Close the picker
  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
    setActiveHex(null);
  }, [setShowPicker, setActiveHex]);

  // Clear all tiles from the board
  const handleClearBoard = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire board?')) {
      setHexTiles({});
    }
  }, [setHexTiles]);

  // Save the current map to localStorage
  const handleSaveMap = useCallback(() => {
    const mapData: MapData = {
      hexTiles,
      allDraggablesByUid: allDraggables,
      timestamp: Date.now()
    };
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    alert('Map saved successfully!');
  }, [hexTiles, allDraggables]);

  const toggleMapLock = useCallback(() => {
    setLocked(!locked);
  }, [setLocked, locked])

  // Export the map as JSON file
  const handleExportMap = useCallback(() => {
    const mapData: MapData = {
      hexTiles,
      allDraggablesByUid: allDraggables,
      timestamp: Date.now()
    };

    const dataStr = JSON.stringify(mapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ti-map-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [hexTiles, allDraggables]);

  // Import a map from a JSON file
  const handleImportMap = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const mapData: MapData = JSON.parse(event.target?.result as string);
        setHexTiles(mapData.hexTiles);
        if (mapData.allDraggablesByUid && Object.keys(mapData.allDraggablesByUid).length > 0) {
          setAllDraggables(mapData.allDraggablesByUid)
        }
        alert('Map imported successfully!');
      } catch (error) {
        console.error('Error importing map:', error);
        alert('Failed to import map. Invalid file format.');
      }
    };
    reader.readAsText(file);
  }, [setHexTiles, setAllDraggables]);

  const onDragEnd = useCallback(({ delta, active }: DragEndEvent): void => {
    setAllDraggables(prev => {
      const props = prev[active.id];
      let { x, y } = props
      return {
        ...prev,
        [active.id]: {
          ...props,
          x: (x ?? 0) + delta.x,
          y: (y ?? 0) + delta.y,
        }
      }
    })
  }, [setAllDraggables])

  return (
    <>
      <div className="board-controls">
        <div className="control-group">
          <button onClick={toggleMapLock}>{locked ? "Unlock Map" : "Lock Map"}</button>
          <button disabled={locked} onClick={handleClearBoard}>Clear Board</button>
          <button onClick={handleSaveMap}>Save Map</button>
          <button onClick={handleExportMap}>Export Map</button>
          <label className="import-button">
            Import Map
            <input
              type="file"
              accept=".json"
              disabled={locked}
              onChange={handleImportMap}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
      <div className="hex-board-wrapper">
        <div className="hex-board-container">
          <div className="hex-board">
            <DraggableContainer
              onDragEnd={onDragEnd}
              draggableItems={draggableItems}
            >
              {hexagons.map((hex, index) => {
                const hexKey = `${hex.q},${hex.r},${hex.s}`;
                return (
                  <Hexagon
                    key={index}
                    {...hex}
                    boardSize={boardSize}
                    tile={hexTiles[hexKey] ?? null}
                    isLocked={locked}
                    onClick={(e: React.MouseEvent) => handleHexClick(hex.q, hex.r, hex.s, e)}
                  />
                );
              })}
              {draggableItems}
            </DraggableContainer>
            {showPicker && (
              <TilePicker
                selectedTile={selectedTile}
                activeHex={activeHex}
                onSelectTile={handleTileSelect}
                onClose={handleClosePicker}
                position={pickerPosition}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HexBoard;
