import { CSSProperties } from "react";
import { allTiles } from "../../assets/tiles";
import { PLAYER_COUNT, TILE_NUMBER_AND_ROTATION } from "../HexBoard";

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
    isLocked: boolean;
    onClick: (event: React.MouseEvent) => void;
}

export const HexTile: React.FC<HexProps> = ({ q, r, s, boardSize, tile, isLocked, extraSystem = false, onClick }) => {
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
        backgroundImage: `url(${allTiles[tile.number]})`,
        // backgroundImage: `url(${urlBase}/${tile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `rotate(${tile.rotation.deg}deg)`
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