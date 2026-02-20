import { useEffect, useMemo, useRef, useState } from "react";
import { TileMap, tilesInfo } from '../../assets/data/tiles';
import { useTileUrl, homeSystemTilesByTileNumber, hyperlaneTilesByTileNumber, TILE_NUMBERS, tileNumbers } from '../../assets/tiles';
import { TIER, tileTiers } from '../../assets/data/tile-selection';
import { cornerCoordinates, TILE_NUMBER_AND_ROTATION } from "../utils/mapData";
import { allRotations, degOptions, ROTATION } from "./rotations";
import './TilePicker.css'

const tooltipTextForTile = (tile: TILE_NUMBERS, tileData: TileMap): string => {
    let tileInfo = tileData[tile]

    if (tileInfo.faction ||
        tileInfo.planets.length > 0 ||
        (tileInfo.stations?.length && tileInfo.stations.length > 0)
    ) {
        return tileInfo?.faction ||
            [
                ...tileInfo?.planets.map(planet => planet.name),
                ...(tileInfo?.stations ?? []).map(station => station.name)
            ].join(' ')
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

// TilePicker component
export interface TilePickerProps {
    selectedTile: string | null;
    activeHex: { q: number, r: number, s: number } | null;
    onSelectTile: (tile: TILE_NUMBER_AND_ROTATION | null) => void;
    onClose: () => void;
    position: { x: number, y: number } | null;
}

interface TileOptionProps {
    tileNumber: TILE_NUMBERS;
    isSelected: boolean;
    tooltipText: String;
    rotation: number;
    onClick: () => void;
}

const TileOption: React.FC<TileOptionProps> = ({ tileNumber, isSelected, tooltipText, rotation, onClick }) => {
    const url = useTileUrl(tileNumber)
    return (
        <div
            className={`tile-option ${isSelected ? 'selected' : ''} tooltip`}
            onClick={onClick}
        >
            {url && <img src={url} alt={`Tile ${tileNumber}`} style={{ transform: `rotate(${rotation}deg)` }} />}
            <span className="tooltiptext">{tooltipText}</span>
        </div>
    )
}

export const TilePicker: React.FC<TilePickerProps> = ({ selectedTile, activeHex, onSelectTile, onClose, position }) => {
    const [showAll, setShowAll] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>("");
    const defaultActiveCategory = cornerCoordinates.find(coord => coord.q === activeHex?.q && coord.r === activeHex?.r && coord.s === activeHex?.s) !== undefined ? "home" : "all";
    const [activeCategory, setActiveCategory] = useState<string>(defaultActiveCategory);
    const [activeTier, setActiveTier] = useState<TIER | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [rotation, setRotation] = useState<ROTATION>(allRotations[degOptions.deg0])

    useEffect(() => {
        if (searchInputRef.current) searchInputRef.current.focus()
    }, [searchInputRef])

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
          ${tileNumber}|
          ${tile.anomaly || ""}|
          ${tile.faction || ""}|
          ${tile.planets.map(p => {
                return `
              ${p.name}|
              ${p.traits?.join(', ') || ""}|
              ${p.legendary ? "legendary" : ""}|
              ${p.specialties?.join(', ') || ""}
            `
            }).join('|')}|
          ${tile.stations?.map(s => {
                return `
            ${s.name}|
            ${s.trait ? s.trait : ""}
            `
            }).join('|')}|
          ${tile.type || ""}
          ${tile.wormhole || ""}
        `.toLowerCase().includes(filter.toLowerCase())

            // For home systems category
            if (activeCategory === "home") {
                return !!homeSystemTilesByTileNumber[tileNumber] && matchesSearch;
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
                return !!hyperlaneTilesByTileNumber[tileNumber] && matchesSearch
            }

            return false;
        });
        return filteredTiles
    }, [filter, activeCategory, activeTier])

    const isShowingAll = useMemo(() => {
        return filteredTiles.length <= 25 || showAll
    }, [showAll, filteredTiles])

    // Display a subset of tiles or all if showAll is true
    const displayedTiles = useMemo(() => {
        const toShow = isShowingAll ? filteredTiles : filteredTiles.slice(0, 25)
        return toShow.map(tileNumber => {
            let tooltipText = tooltipTextForTile(tileNumber, tilesInfo)
            return { tileNumber, tooltipText } as { tileNumber: TILE_NUMBERS, tooltipText: String }
        }).sort((tileA, tileB) => {
            var aIsEmpty = false
            var bIsEmpty = false
            var compareA = tileA.tooltipText
            if (compareA.startsWith("The ")) {
                compareA = compareA.slice(4)
            }
            if (compareA === "Empty" || compareA === "") {
                aIsEmpty = true
            }

            var compareB = tileB.tooltipText
            if (compareB.startsWith("The")) {
                compareB = compareB.slice(4)
            }
            if (compareB === "Empty" || compareB === "") {
                bIsEmpty = true
            }
            if (aIsEmpty && !bIsEmpty) {
                return 1
            } else if (!aIsEmpty && bIsEmpty) {
                return -1
            } else if ((aIsEmpty && bIsEmpty) || (compareA === compareB)) {
                return 0
            } else {
                return compareA > compareB ? 1 : -1
            }
        })
    }, [isShowingAll, filteredTiles]);

    const displayShowLess = useMemo(() => {
        return isShowingAll && filteredTiles.length > 25
    }, [isShowingAll, filteredTiles])

    if (!position) return null;

    const handleTileSelect = (tile: TILE_NUMBERS | null) => {
        onSelectTile(tile ? { number: tile, rotation } : null);
        onClose();
    };

    const handleTierSelect = (tier: TIER | null) => {
        setActiveTier(tier);
    };

    return (
        <div className="tile-picker-overlay">
            <div className="tile-picker" ref={pickerRef}>
                <div className="tile-picker-header">
                    <div className="top-line">
                        <h3>Select a Tile</h3>
                        <input
                            className={"tile-picker-search"}
                            type="text"
                            placeholder="Search tiles (by Planet / Anomaly / Legendary / Wormhole)"
                            value={filter}
                            ref={searchInputRef}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <button className="close-button" onClick={onClose}>×</button>
                    </div>
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
                    <button onClick={() => setRotation(r => allRotations[r.prev])}>Rotate Counter Clockwise</button>
                    <button onClick={() => setRotation(r => allRotations[r.next])}>Rotate Clockwise</button>
                </div>
                <div className="tile-grid">
                    {displayedTiles.map((tile, index) => (
                        <TileOption
                            key={index}
                            tileNumber={tile.tileNumber}
                            isSelected={selectedTile === tile.tileNumber}
                            tooltipText={tile.tooltipText}
                            rotation={rotation.deg}
                            onClick={() => handleTileSelect(tile.tileNumber)}
                        />
                    ))}
                    {!isShowingAll && (
                        <button onClick={() => setShowAll(true)}>
                            Show {filteredTiles.length - 24} more...
                        </button>
                    )}
                    {displayShowLess && (
                        <button onClick={() => setShowAll(false)}>Show less</button>
                    )}
                </div>
            </div>
        </div>
    );
};