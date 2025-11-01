import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
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
    draggableItems: React.ReactNode;
}

export const HexBoardGrid: React.FC<HexBoardGridProps> = ({
    boardSize,
    hexagons,
    hexTiles,
    playerCount,
    locked,
    onHexClick,
    onDragEnd,
    draggableItems,
}) => {
    return (
        <div className="hex-board-wrapper">
            <div className="hex-board-container">
                <div className="hex-board">
                    <DraggableContainer
                        onDragEnd={onDragEnd}
                        draggableItems={draggableItems}
                    >
                        <Mallice
                            boardSize={boardSize}
                        />
                        {hexagons.map((hex, index) => {
                            const hexKey = `${hex.q},${hex.r},${hex.s}`;
                            return (
                                <HexTile
                                    key={index}
                                    {...hex}
                                    boardSize={boardSize}
                                    playerCount={playerCount}
                                    tile={hexTiles[hexKey] ?? null}
                                    isLocked={locked}
                                    onClick={(e: React.MouseEvent) => onHexClick(hex.q, hex.r, hex.s, e)}
                                />
                            );
                        })}
                        {draggableItems}
                    </DraggableContainer>
                </div>
            </div>
        </div>
    );
};

