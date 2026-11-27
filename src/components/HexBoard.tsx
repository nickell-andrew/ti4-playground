import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { movePieces } from './utils/movePieces';
import './HexBoard.css';

import { generateTiles } from './utils/generateTiles';
import { TILE_NUMBERS } from '../assets/tiles';
import { parseTTSMap } from './utils/ttsMap';
import { emptyCards, restoreCards, TabletopCards, CardState, getMapPlanets, playerAtCardPosition, cardPosition } from './utils/tabletopCards';
import { TabletopCardsPanel } from './TabletopCardsPanel';
import { restoreCommandPools } from './utils/commandPools';
import { CommandPools, PieceGroupCounts } from './dragAndDrop/CommandPools';
import { BoardCards, CardDragData } from './cards/BoardCards';
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
} from './dragAndDrop/draggablePieceUtils';
import { getInitialPieces, maxPieceCounts, unitTypes, tgTokenTypes } from './dragAndDrop/draggablePieceFactory';
import { PieceContainer, getContainerUid } from './dragAndDrop/PieceContainer';
import { TGContainer, getTGContainerUid } from './dragAndDrop/TGContainer';
import { tokens, PLAYERS } from './consts';
import { getContainerCoordinates, tgContainerPositions } from './utils/pieceCoordinates';
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
  const [importError, setImportError] = useState('');
  const [showCards, setShowCards] = useState(false);
  const [cards, setCards] = useState<TabletopCards>(emptyCards);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

  const getInitialDraggables = useCallback(() => {
    return getInitialPieces(playerCount);
  }, [playerCount])
  // DnD handlers
  const [allDraggables, setAllDraggables] = useState<DraggablePiecePropsByUid>(getInitialDraggables);

  const selectPiece = useCallback((uid: string, additive: boolean) => {
    setSelectedPieces(previous => additive
      ? previous.includes(uid) ? previous.filter(id => id !== uid) : [...previous, uid]
      : previous.includes(uid) ? previous : [uid]);
  }, []);

  const changeCard = useCallback((kind: keyof TabletopCards, id: string, state: CardState) => {
    setCards(previous => ({ ...previous, [kind]: { ...previous[kind], [id]: state } }));
  }, []);
  const dropCard = useCallback((data: CardDragData, point: { x: number; y: number }, player?: number) => {
    setSelectedPieces([`board-card-${data.kind}-${data.cardId}`]);
    const targetPlayer = player ?? playerAtCardPosition(point, playerCount);
    setCards(previous => {
      const state = previous[data.kind][data.cardId] ?? data.state;
      return { ...previous, [data.kind]: { ...previous[data.kind], [data.cardId]: {
        ...state, ...point, player: targetPlayer ?? state.player,
        exhausted: data.kind === 'planets' && targetPlayer !== undefined && targetPlayer !== state.player ? true : state.exhausted,
      } } };
    });
  }, [playerCount]);

  const cardPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    (['strategies', 'planets'] as const).forEach(kind => Object.entries(cards[kind]).forEach(([id, state]) => {
      const position = cardPosition(kind, id, state, cards);
      if (position) positions[`board-card-${kind}-${id}`] = position;
    }));
    return positions;
  }, [cards]);

  useEffect(() => {
    const flip = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'f' || event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
          (event.target as Element)?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
      if (!selectedPieces.length) return;
      event.preventDefault();
      setAllDraggables(previous => {
        const next = { ...previous };
        selectedPieces.forEach(id => {
          const piece = previous[id];
          if (piece && ['fighter', 'destroyer', 'cruiser', 'carrier', 'dreadnought', 'warsun', 'flagship', 'infantry', 'mech'].includes(piece.name)) next[id] = { ...piece, damaged: !piece.damaged };
        });
        return next;
      });
      setCards(previous => {
        const next = { strategies: { ...previous.strategies }, planets: { ...previous.planets } };
        (['strategies', 'planets'] as const).forEach(kind => selectedPieces.forEach(selection => {
          const prefix = `board-card-${kind}-`;
          if (!selection.startsWith(prefix)) return;
          const id = selection.slice(prefix.length), state = previous[kind][id];
          if (state) next[kind][id] = { ...state, exhausted: !state.exhausted };
        }));
        return next;
      });
    };
    window.addEventListener('keydown', flip);
    return () => window.removeEventListener('keydown', flip);
  }, [selectedPieces]);

  useEffect(() => {
    const names = new Set(getMapPlanets(hexTiles).map(planet => planet.name));
    setCards(previous => {
      if (Object.keys(previous.planets).every(name => names.has(name))) return previous;
      return { ...previous, planets: Object.fromEntries(Object.entries(previous.planets).filter(([name]) => names.has(name))) };
    });
  }, [hexTiles]);

  const draggableItems = useMemo(() => {
    return Object.entries(allDraggables).map(([uid, props]) => {
      return <DraggablePiece
        key={uid}
        {...props}
        selected={selectedPieces.includes(uid)}
        selectedIds={selectedPieces}
        onSelect={selectPiece}
      />
    })
  }, [allDraggables, selectedPieces, selectPiece])

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
        setAllDraggables(restoreCommandPools(mapDataV2.allDraggablesByUid ?? getInitialPieces(mapDataV2.playerCount)));
        setCards(restoreCards(mapDataV2.cards, mapDataV2.playerCount));
        setPlayerCount(mapDataV2.playerCount)
        setLocked(true)
      } catch (e) {
        console.error('Failed to load saved map:', e);
        setHexTiles(initialTiles);
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
    setSelectedPieces([]);
    setCards(emptyCards());
    setShowClearConfirm(false);
  }, [setHexTiles, setAllDraggables, getInitialDraggables]);

  // Save the current map to localStorage
  const handleSaveMap = useCallback(() => {
    const mapData: MapDataV2 = {
      hexTiles,
      playerCount,
      allDraggablesByUid: allDraggables,
      timestamp: Date.now(),
      cards,
    };
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    alert('Map saved successfully!');
  }, [hexTiles, allDraggables, playerCount, cards]);

  const toggleMapLock = useCallback(() => {
    setLocked(!locked);
  }, [setLocked, locked])

  // Export the map as JSON file
  const handleExportMapToFile = useCallback(() => {
    const mapData: MapDataV2 = {
      hexTiles,
      playerCount,
      allDraggablesByUid: allDraggables,
      timestamp: Date.now(),
      cards,
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
  }, [hexTiles, allDraggables, playerCount, cards]);

  // Import a map from a JSON file
  const handleImportMap = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const mapData: MapDataV2 = JSON.parse(event.target?.result as string);
        setHexTiles(mapData.hexTiles);
        setAllDraggables(restoreCommandPools(mapData.allDraggablesByUid ?? getInitialPieces(mapData.playerCount)));
        setSelectedPieces([]);
        setCards(restoreCards(mapData.cards, mapData.playerCount));
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
    try {
      const imported = parseTTSMap(importString);
      setHexTiles(imported);
      setCards(emptyCards());
      setSelectedPieces([]);
      setImportError('');
      setShowImportModal(false);
      setLocked(true);
    } catch (error) {
      setImportError((error as Error).message);
    }
  }, [importString]);

  const onDragEnd = useCallback((event: DragEndEvent): void => {
    setAllDraggables(previous => movePieces(previous, event, selectedPieces, playerCount, hexTiles));
  }, [selectedPieces, playerCount, hexTiles]);

  const onExportClick = useCallback(() => {
    setShowExportModal(true)
  }, [setShowExportModal])

  const onImportClick = useCallback(() => {
    setImportError('');
    setShowImportModal(true)
  }, [setShowImportModal])

  return (
    <div className="playground">
      <BoardControls
        locked={locked}
        onToggleLock={toggleMapLock}
        onClearBoard={handleClearBoard}
        onSaveMap={handleSaveMap}
        onExportClick={onExportClick}
        onImportClick={onImportClick}
        onResetPieces={() => setShowResetConfirm(true)}
        onToggleCards={() => setShowCards(value => !value)}
        showCards={showCards}
      />
      <HexBoardGrid
        boardSize={boardSize}
        hexagons={hexagons}
        hexTiles={hexTiles}
        activeHex={activeHex}
        playerCount={playerCount}
        locked={locked}
        onHexClick={handleHexClick}
        onDragEnd={onDragEnd}
        draggableItems={draggableItems}
        containerItems={<>{containerItems}<PieceGroupCounts pieces={allDraggables} />
          {Array.from({ length: playerCount }, (_, i) => <CommandPools key={i} player={i + 1} pieces={allDraggables} />)}
          <BoardCards cards={cards} planets={getMapPlanets(hexTiles)} playerCount={playerCount} onChange={changeCard} selectedIds={selectedPieces} onSelect={selectPiece} /></>}
        onCardDrop={dropCard}
        boardOverlay={showCards && <TabletopCardsPanel hexTiles={hexTiles} playerCount={playerCount} cards={cards} onChange={changeCard}
          onReadyPlanets={() => setCards(previous => ({ ...previous, planets: Object.fromEntries(Object.entries(previous.planets).map(([id, state]) => [id, { ...state, exhausted: false }])) }))}
          onReturnStrategies={() => setCards(previous => ({ ...previous, strategies: {} }))} />}
        pieces={allDraggables}
        selectedIds={selectedPieces}
        onSelectionChange={setSelectedPieces}
        cardPositions={cardPositions}
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
        setImportString={value => { setImportString(value); setImportError(''); }}
        error={importError}
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
      {showResetConfirm && <ConfirmModal onConfirm={() => {
        setAllDraggables(getInitialDraggables());
        setSelectedPieces([]);
        setShowResetConfirm(false);
      }} onDeny={() => setShowResetConfirm(false)}>Reset all pieces to their starting supplies? Tiles and cards will stay in place.</ConfirmModal>}
      {showClearConfirm && (
        <ConfirmModal
          onConfirm={handleConfirmClear}
          onDeny={() => setShowClearConfirm(false)}
        >
          Clear the entire board?
        </ConfirmModal>
      )}
    </div>
  );
};

export default HexBoard;
