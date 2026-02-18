import React from 'react';
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { DraggableContainer } from './dragAndDrop/DraggableContainer';
import { Mallice } from './hexTile/Mallice';
import { HexTile } from './hexTile/HexTile';
import type { TILE_NUMBER_AND_ROTATION, PLAYER_COUNT } from './utils/mapData';

interface HexBoardGridProps {
    boardSize: number;
    hexagons: { q: number; r: number; s: number, extraSystem?: boolean }[];
    hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>;
    playerCount: PLAYER_COUNT;
    locked: boolean;
    onHexClick: (q: number, r: number, s: number, event: React.MouseEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    onDragOver?: (event: DragOverEvent) => void;
    draggableItems: React.ReactNode;
    containerItems: React.ReactNode;
}

export const HexBoardGrid: React.FC<HexBoardGridProps> = React.memo(({
    boardSize,
    hexagons,
    hexTiles,
    playerCount,
    locked,
    onHexClick,
    onDragEnd,
    onDragOver,
    draggableItems,
    containerItems,
}) => {
    return (
        <div className="hex-board-wrapper">
            <div className="hex-board-container">
                <div className="hex-board">
                    <DraggableContainer
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        draggableItems={draggableItems}
                        containerItems={containerItems}
                    >
                        <Mallice
                            boardSize={boardSize}
                        />
                        {hexagons.map((hex) => {
                            const hexKey = `${hex.q},${hex.r},${hex.s}`;
                            return (
                                <HexTile
                                    key={hexKey}
                                    {...hex}
                                    boardSize={boardSize}
                                    playerCount={playerCount}
                                    tile={hexTiles[hexKey] ?? null}
                                    isLocked={locked}
                                    onHexClick={onHexClick}
                                />
                            );
                        })}
                    </DraggableContainer>
                </div>
            </div>
        </div>
    );
});
