import React, { useCallback, CSSProperties } from "react";
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { getHexGeometry } from '../utils/boardGeometry';
import { useTileUrl } from "../../assets/tiles";
import { PLAYER_COUNT, TILE_NUMBER_AND_ROTATION } from "../utils/mapData";
import { planetTargets } from '../utils/systemTargets';
import { PlanetDropTarget } from './PlanetDropTarget';

export const BOARD_SIZE = 1000;

export const getScaleFactor = (boardSize?: number): number => {
    // Calculate position based on relative percentages
    const baseSize = Math.min(boardSize ?? BOARD_SIZE, 1000);

    // Scale the positioning based on the current board size
    const scaleFactor = baseSize / 1000;
    return scaleFactor
}

export interface HexProps {
    q: number;
    r: number;
    s: number;
    extraSystem?: boolean
    boardSize: number;
    playerCount: PLAYER_COUNT;
    tile: TILE_NUMBER_AND_ROTATION | null;
    isActive: boolean;
    isLocked: boolean;
    onHexClick: (q: number, r: number, s: number, event: React.MouseEvent) => void;
}

export const HexTile: React.FC<HexProps> = React.memo(({ q, r, s, boardSize, tile, isActive, isLocked, extraSystem = false, onHexClick }) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        onHexClick(q, r, s, e);
    }, [q, r, s, onHexClick]);

    const visibleTile = tile?.number === '0' ? null : tile;
    const tileUrl = useTileUrl(visibleTile?.number);
    const geometry = getHexGeometry(q, r, boardSize);
    const { active } = useDndContext();
    const showGroundTargets = /-(infantry|mech|spacedock|pds)(-|$)/.test(String(active?.id ?? ''));
    const { setNodeRef, isOver } = useDroppable({
        id: `hex-${q},${r},${s}`,
        disabled: extraSystem,
        data: { isHex: true, hexKey: `${q},${r},${s}`, x: geometry.x, y: geometry.y },
    });

    let extraSystemStyle: CSSProperties = {}
    if (extraSystem) {
        extraSystemStyle = {
            backgroundColor: "gray",
            pointerEvents: "none"
        }
    }

    const style = {
        left: geometry.left,
        top: geometry.top,
        width: geometry.width,
        height: geometry.height,
    };

    // Background style for the tile image
    const backgroundStyle = visibleTile && tileUrl ? {
        backgroundImage: `url(${tileUrl})`,
        // backgroundImage: `url(${urlBase}/${tile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `rotate(${visibleTile.rotation.deg}deg)`
    } : {};

    return (
        <div
            ref={setNodeRef}
            className={`hexagon${!visibleTile && !extraSystem ? ' empty' : ''}${isActive ? ' active' : ''}${isOver ? ' drop-target' : ''}`}
            style={{ ...style, ...(isLocked ? { pointerEvents: 'none' } : {}), ...extraSystemStyle }}
            onClick={handleClick}
            data-testid={!visibleTile && !extraSystem ? 'empty-hex' : undefined}
            data-hex-key={`${q},${r},${s}`}
        >
            <div className="hexagon-image" style={backgroundStyle} />
            <div className="hexagon-content" />
            {!extraSystem && showGroundTargets && <span className="space-drop-hint">Space</span>}
            {!extraSystem && planetTargets(`${q},${r},${s}`, visibleTile).map(target => <PlanetDropTarget key={target.name} target={target} hexKey={`${q},${r},${s}`} geometry={geometry} />)}
        </div>
    );
});
