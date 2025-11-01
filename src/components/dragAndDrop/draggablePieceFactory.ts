import { UNITS, TOKENS } from '../consts';
import { DraggablePieceProps, DraggablePiecePropsByUid, getUidFromDraggablePieceProps } from './draggablePieceUtils';
import { getInitialCoordinates } from '../utils/pieceCoordinates';

export const getDraggablePieceProps = (player: number): DraggablePiecePropsByUid => {
    const unitInfo: [UNITS, number][] = [
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

    const cardboard: [TOKENS, number][] = [
        ["commandCounter", 16],
    ];

    const draggablesByUid: DraggablePiecePropsByUid = {};

    unitInfo.forEach(([name, count]) => {
        for (let i = 1; i <= count; i++) {
            const props: DraggablePieceProps = { player, name, pieceNumber: i };
            const coords = getInitialCoordinates(props);
            const uid = getUidFromDraggablePieceProps(props);
            draggablesByUid[uid] = { ...props, ...coords };
        }
    });

    cardboard.forEach(([name, count]) => {
        for (let i = 1; i <= count; i++) {
            const props: DraggablePieceProps = { player, name, pieceNumber: i };
            const coords = getInitialCoordinates(props);
            const uid = getUidFromDraggablePieceProps(props);
            draggablesByUid[uid] = { ...props, ...coords };
        }
    });

    return draggablesByUid;
};

