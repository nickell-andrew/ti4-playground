import malliceImage from '../../assets/tiles/ST_82.png'
import { getScaleFactor } from './HexTile';

export interface MalliceProps {
    boardSize: number
}
export const Mallice: React.FC<MalliceProps> = ({ boardSize }) => {
    const scaleFactor = getScaleFactor(boardSize)

    // Calculate hexagon dimensions for pointy-top orientation
    const hexWidth = 200 * scaleFactor;
    const hexHeight = 185 * scaleFactor;

    const top = 130 - (hexHeight / 2)
    const left = 1025 - (hexWidth / 2)

    return <div
        className={"mallice"}
        style={{
            top: top,
            left: left,
            backgroundImage: `url(${malliceImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: hexHeight,
            width: hexWidth,
        }}
    />
}