import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import './HexBoard.css';

import { generateTiles } from './utils/generateTiles';
import { isTileNumber, TILE_NUMBERS, tileNumbers } from '../assets/tiles';
import { TilePicker } from './tilePicker/TilePicker';
import { allRotations } from './tilePicker/rotations';
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
  DraggablePiecePropsByUid,
  getUidFromDraggablePieceProps,
} from './dragAndDrop/draggablePieceUtils';
import { getDraggablePieceProps, maxPieceCounts, unitTypes, tgTokenTypes } from './dragAndDrop/draggablePieceFactory';
import { PieceContainer, getContainerUid } from './dragAndDrop/PieceContainer';
import { TGContainer, getTGContainerUid } from './dragAndDrop/TGContainer';
import { TGTotalBadge } from './dragAndDrop/TGTotalBadge';
import { tokens, PLAYERS } from './consts';
import { getContainerCoordinates, referencePoints, tgContainerPositions, H3_PROXIMITY_RADIUS } from './utils/pieceCoordinates';
import { ConfirmModal } from './dragAndDrop/components';

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
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
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

  // Build container items - one per player per piece type
  const containerItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    const players = [...Array(playerCount)].map((_, i) => (i + 1) as PLAYERS);

    for (const player of players) {
      // Unit containers
      for (const name of unitTypes) {
        const activeCount = Object.values(allDraggables).filter(
          p => p.player === player && p.name === name
        ).length;
        const maxCount = maxPieceCounts[name];
        const coords = getContainerCoordinates(player, name);
        items.push(
          <PieceContainer
            key={getContainerUid(player, name)}
            player={player}
            name={name}
            x={coords.x}
            y={coords.y}
            activeCount={activeCount}
            maxCount={maxCount}
          />
        );
      }

      // Command counter container
      const ccName = tokens.CommandCounter;
      const ccActiveCount = Object.values(allDraggables).filter(
        p => p.player === player && p.name === ccName
      ).length;
      const ccMaxCount = maxPieceCounts[ccName];
      const ccCoords = getContainerCoordinates(player, ccName);
      items.push(
        <PieceContainer
          key={getContainerUid(player, ccName)}
          player={player}
          name={ccName}
          x={ccCoords.x}
          y={ccCoords.y}
          activeCount={ccActiveCount}
          maxCount={ccMaxCount}
        />
      );

    }

    // Two shared TG containers (not per-player)
    for (const tgName of tgTokenTypes) {
      const tgCoords = tgContainerPositions[tgName];
      items.push(
        <TGContainer
          key={getTGContainerUid(tgName)}
          name={tgName}
          x={tgCoords.x}
          y={tgCoords.y}
        />
      );
    }

    return items;
  }, [allDraggables, playerCount])

  // Per-player TG total badges — count tokens physically within each player's h3 hex
  const tgTotalItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    const players = [...Array(playerCount)].map((_, i) => (i + 1) as PLAYERS);

    for (const player of players) {
      const h3 = referencePoints[`p${player}h3`];
      const r = H3_PROXIMITY_RADIUS;

      const isInH3 = (x: number | undefined, y: number | undefined) => {
        if (x === undefined || y === undefined) return false;
        return Math.abs(x - h3.x) <= r && Math.abs(y - h3.y) <= r;
      };

      const singles = Object.values(allDraggables).filter(
        p => p.name === tokens.TradeGood && isInH3(p.x, p.y)
      ).length;
      const bundles = Object.values(allDraggables).filter(
        p => p.name === tokens.TradeGoodBundle && isInH3(p.x, p.y)
      ).length;

      // Position the badge outside the player's H area:
      // project outward from the board center through h3, past h3
      const mecatol = referencePoints['mecatol'];
      const outX = h3.x - mecatol.x;
      const outY = h3.y - mecatol.y;
      const len = Math.sqrt(outX * outX + outY * outY);
      const badgeX = Math.round(h3.x + (outX / len) * 110);
      const badgeY = Math.round(h3.y + (outY / len) * 110);

      items.push(
        <TGTotalBadge
          key={`tg-total-${player}`}
          player={player}
          singles={singles}
          bundles={bundles}
          x={badgeX}
          y={badgeY}
        />
      );
    }

    return items;
  }, [allDraggables, playerCount])

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setBoardSize(BOARD_SIZE);
      }, 150);
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
    setShowClearConfirm(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    setHexTiles(initialTiles);
    setAllDraggables(getInitialDraggables());
    setShowClearConfirm(false);
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
    URL.revokeObjectURL(url);
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

  const onDragEnd = useCallback(({ delta, active, over }: DragEndEvent): void => {
    const activeId = active.id as string;
    const overId = over?.id as string | undefined;

    // Shared TG container dragged → spawn a new TG token (no player association)
    if (activeId.startsWith('container-shared-')) {
      if (overId === activeId) return;
      const name = activeId.replace('container-shared-', '') as any;

      const maxCount = maxPieceCounts[name as keyof typeof maxPieceCounts];
      const existingForType = Object.values(allDraggables).filter(p => p.name === name);
      if (existingForType.length >= maxCount) return;

      const usedNumbers = new Set(existingForType.map(p => p.pieceNumber));
      let pieceNumber = 1;
      while (usedNumbers.has(pieceNumber) && pieceNumber <= maxCount) pieceNumber++;
      if (pieceNumber > maxCount) return;

      // Spawn at container position + drag delta; player:1 is just for image lookup
      const containerCoords = tgContainerPositions[name];
      const spawnX = containerCoords.x + delta.x;
      const spawnY = containerCoords.y + delta.y;

      const newProps = { player: 1 as PLAYERS, name, pieceNumber };
      const uid = getUidFromDraggablePieceProps(newProps);
      setAllDraggables(prev => ({
        ...prev,
        [uid]: { ...newProps, x: spawnX, y: spawnY },
      }));
      return;
    }

    // Per-player container dragged → spawn a new piece
    if (activeId.startsWith('container-')) {
      const [, playerStr, name] = activeId.split('-');
      const player = parseInt(playerStr) as PLAYERS;

      // Don't spawn if dropped back on its own container
      if (overId === activeId) return;

      const maxCount = maxPieceCounts[name as keyof typeof maxPieceCounts];
      const existingForType = Object.values(allDraggables).filter(
        p => p.player === player && p.name === name
      );
      if (existingForType.length >= maxCount) return;

      // Find next available piece number
      const usedNumbers = new Set(existingForType.map(p => p.pieceNumber));
      let pieceNumber = 1;
      while (usedNumbers.has(pieceNumber) && pieceNumber <= maxCount) pieceNumber++;
      if (pieceNumber > maxCount) return;

      // Position at where the drag ended (container's board-relative coords + delta)
      const containerCoords = getContainerCoordinates(player, name);
      const spawnX = containerCoords.x + delta.x;
      const spawnY = containerCoords.y + delta.y;

      const newProps = { player, name: name as any, pieceNumber };
      const uid = getUidFromDraggablePieceProps(newProps);
      setAllDraggables(prev => ({
        ...prev,
        [uid]: { ...newProps, x: spawnX, y: spawnY },
      }));
      return;
    }

    // Piece dropped on a shared TG container → delete
    if (overId && overId.startsWith('container-shared-')) {
      const name = overId.replace('container-shared-', '');
      const pieceProps = allDraggables[activeId];
      if (pieceProps && pieceProps.name === name) {
        setAllDraggables(prev => {
          const next = { ...prev };
          delete next[activeId];
          return next;
        });
      }
      return;
    }

    // Active piece dropped on its matching per-player container → delete
    if (overId && overId.startsWith('container-')) {
      const [, playerStr, name] = overId.split('-');
      const player = parseInt(playerStr) as PLAYERS;
      // Only delete if the piece belongs to the same player and piece type
      const pieceProps = allDraggables[activeId];
      if (pieceProps && pieceProps.player === player && pieceProps.name === name) {
        setAllDraggables(prev => {
          const next = { ...prev };
          delete next[activeId];
          return next;
        });
      }
      return;
    }

    // Default: update position
    setAllDraggables(prev => {
      const props = prev[active.id];
      if (!props) return prev;
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
  }, [setAllDraggables, allDraggables])

  const onExportClick = useCallback(() => {
    setShowExportModal(true)
  }, [setShowExportModal])

  const onImportClick = useCallback(() => {
    setShowImportModal(true)
  }, [setShowImportModal])

  return (
    <>
      <BoardControls
        locked={locked}
        onToggleLock={toggleMapLock}
        onClearBoard={handleClearBoard}
        onSaveMap={handleSaveMap}
        onExportClick={onExportClick}
        onImportClick={onImportClick}
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
        containerItems={[...containerItems, ...tgTotalItems]}
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
      {showClearConfirm && (
        <ConfirmModal
          onConfirm={handleConfirmClear}
          onDeny={() => setShowClearConfirm(false)}
        >
          Clear the entire board?
        </ConfirmModal>
      )}
    </>
  );
};

export default HexBoard;
