import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import './HexBoard.css';

import { generateTiles } from './utils/generateTiles';
import { isTileNumber, TILE_NUMBERS, tileNumbers } from '../assets/tiles';
import { allRotations, TilePicker } from './tilePicker/TilePicker';
import { BOARD_SIZE } from './hexTile/HexTile';
import { BoardControls } from './BoardControls';
import { HexBoardGrid } from './HexBoardGrid';
import { ImportMapModal } from './modal/ImportMapModal';
import { ExportMapModal } from './modal/ExportMapModal';
import {
  TTSStringHexOrder,
  initialTiles,
  MapDataV1,
  MapDataV2,
  TILE_NUMBER_AND_ROTATION,
  PLAYER_COUNT
} from './utils/mapData';
import { DraggablePiece } from './dragAndDrop/DraggablePiece';
import {
  DraggablePiecePropsByUid
} from './dragAndDrop/draggablePieceUtils';
import { getDraggablePieceProps } from './dragAndDrop/draggablePieceFactory';

// Re-export types for backward compatibility
export type { TILE_NUMBER_AND_ROTATION, PLAYER_COUNT } from './utils/mapData';
export { cornerCoordinates } from './utils/mapData';

const HexBoard: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(BOARD_SIZE);
  const [selectedTile, setSelectedTile] = useState<TILE_NUMBERS | null>(null);
  const [hexTiles, setHexTiles] = useState<Record<string, TILE_NUMBER_AND_ROTATION>>({});
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<{ x: number, y: number } | null>(null);
  const [activeHex, setActiveHex] = useState<{ q: number, r: number, s: number } | null>(null);
  const [locked, setLocked] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<PLAYER_COUNT>(6);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importString, setImportString] = useState<string>('');

  const getInitialDraggables = useCallback(() => {
    return [...Array(playerCount)].map((_, i) => i + 1).reduce((draggablesByUid, player) => {
      return Object.assign(draggablesByUid, getDraggablePieceProps(player))
    }, {} as DraggablePiecePropsByUid)
  }, [playerCount])
  // DnD handlers
  const [allDraggables, setAllDraggables] = useState<DraggablePiecePropsByUid>(getInitialDraggables());

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
      setBoardSize(BOARD_SIZE);
    };

    window.addEventListener('resize', handleResize);

    // Try to load saved map from localStorage
    const savedMap = localStorage.getItem('tiMapData');
    if (savedMap) {
      try {
        const mapData: any = JSON.parse(savedMap);
        // check if we have V2
        let mapDataV2: MapDataV2
        if (mapData.hexTiles && Object.values(mapData.hexTiles).every(t => {
          return (t as TILE_NUMBER_AND_ROTATION).number !== undefined
        })) {
          mapDataV2 = mapData as MapDataV2
        } else {
          const mapDataV1 = mapData as MapDataV1

          mapDataV2 = {
            ...mapDataV1,
            hexTiles: {
              ...Object.entries(mapDataV1.hexTiles).reduce((hexTiles, [key, value]) => {
                hexTiles[key] = {
                  number: value,
                  rotation: allRotations[0],
                }
                return hexTiles
              }, {} as Record<string, TILE_NUMBER_AND_ROTATION>)
            }
          }
        }
        setHexTiles(mapDataV2.hexTiles)
        if (mapDataV2.allDraggablesByUid && Object.keys(mapDataV2.allDraggablesByUid).length > 0) {
          setAllDraggables(mapDataV2.allDraggablesByUid)
        }
        setPlayerCount(mapDataV2.playerCount)
        setLocked(true)
      } catch (e) {
        console.error('Failed to load saved map:', e);
        return
      }
    } else {
      setHexTiles(initialTiles);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hexagons: { q: number; r: number; s: number, extraSystem?: boolean }[] = useMemo(() => {
    return generateTiles(playerCount)
  }, [playerCount]);

  const currentTTSSTring: string = useMemo(() => {
    return TTSStringHexOrder.map(t => hexTiles[t]?.number ?? "0").join(" ")
  }, [hexTiles])

  // Handle hex click to open the picker
  const handleHexClick = useCallback((q: number, r: number, s: number, event: React.MouseEvent) => {
    if (locked) return;
    setActiveHex({ q, r, s });
    setShowPicker(true);
    setPickerPosition({ x: 0, y: 0 }); // Position will be centered by CSS
  }, [locked, setActiveHex, setShowPicker, setPickerPosition]);

  // Handle tile selection
  const handleTileSelect = useCallback((tile: TILE_NUMBER_AND_ROTATION | null) => {
    setSelectedTile(tile ? tile.number : null);

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
      setHexTiles(initialTiles);
      setAllDraggables(getInitialDraggables())
    }
  }, [setHexTiles, setAllDraggables, getInitialDraggables]);

  // Save the current map to localStorage
  const handleSaveMap = useCallback(() => {
    const mapData: MapDataV2 = {
      hexTiles,
      playerCount,
      allDraggablesByUid: allDraggables,
      timestamp: Date.now()
    };
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    alert('Map saved successfully!');
  }, [hexTiles, allDraggables, playerCount]);

  const toggleMapLock = useCallback(() => {
    setLocked(!locked);
  }, [setLocked, locked])

  // Export the map as JSON file
  const handleExportMapToFile = useCallback(() => {
    const mapData: MapDataV2 = {
      hexTiles,
      playerCount,
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
  }, [hexTiles, allDraggables, playerCount]);

  // Import a map from a JSON file
  const handleImportMap = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const mapData: MapDataV2 = JSON.parse(event.target?.result as string);
        setHexTiles(mapData.hexTiles);
        if (mapData.allDraggablesByUid && Object.keys(mapData.allDraggablesByUid).length > 0) {
          setAllDraggables(mapData.allDraggablesByUid)
        }
        setPlayerCount(mapData.playerCount);
        setShowImportModal(false);
        alert('Map imported successfully!');
      } catch (error) {
        console.error('Error importing map:', error);
        alert('Failed to import map. Invalid file format.');
      }
    };
    reader.readAsText(file);
  }, [setHexTiles, setAllDraggables, setShowImportModal]);

  const handleImportTTSString = useCallback(() => {
    let tiles = importString.trim().split(" ")
    if (tiles.every(t => isTileNumber(t)) && tiles.length === 36) {
      let newHexTiles: typeof hexTiles = TTSStringHexOrder.reduce((newTiles, key, idx) => {
        newTiles[key] = {
          number: tiles[idx] as TILE_NUMBERS,
          rotation: allRotations[0]
        }
        return newTiles
      }, {} as typeof hexTiles)
      newHexTiles["0,0,0"] = {
        number: tileNumbers.tile18,
        rotation: allRotations[0]
      }
      setHexTiles(newHexTiles)
      setLocked(true)
    }
  }, [setHexTiles, setLocked, importString])

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
      <BoardControls
        locked={locked}
        onToggleLock={toggleMapLock}
        onClearBoard={handleClearBoard}
        onSaveMap={handleSaveMap}
        onExportClick={() => setShowExportModal(true)}
        onImportClick={() => setShowImportModal(true)}
      />
      <HexBoardGrid
        boardSize={boardSize}
        hexagons={hexagons}
        hexTiles={hexTiles}
        playerCount={playerCount}
        locked={locked}
        onHexClick={handleHexClick}
        onDragEnd={onDragEnd}
        draggableItems={draggableItems}
      />
      {showPicker && (
        <TilePicker
          selectedTile={selectedTile}
          activeHex={activeHex}
          onSelectTile={handleTileSelect}
          onClose={handleClosePicker}
          position={pickerPosition}
        />
      )}
      <ImportMapModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        importString={importString}
        setImportString={setImportString}
        fileInputRef={fileInputRef}
        onImportMap={handleImportMap}
        onImportTTSString={handleImportTTSString}
      />
      <ExportMapModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        currentTTSString={currentTTSSTring}
        onExportToFile={handleExportMapToFile}
      />
    </>
  );
};

export default HexBoard;
