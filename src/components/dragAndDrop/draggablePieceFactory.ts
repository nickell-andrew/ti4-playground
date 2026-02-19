import { UNITS, TOKENS, ALL_PIECES, tokens } from '../consts';
import { DraggablePieceProps, DraggablePiecePropsByUid, getUidFromDraggablePieceProps } from './draggablePieceUtils';
import { referencePoints, pieceOffsetInHex } from '../utils/pieceCoordinates';

// Number of command counters pre-placed on the board at game start (in rightmost grey hex)
export const COMMAND_COUNTERS_PRE_PLACED = 8;

// Max piece counts per type (used for container display)
export const maxPieceCounts: Record<ALL_PIECES, number> = {
    infantry: 12,
    mech: 4,
    spacedock: 3,
    pds: 6,
    fighter: 10,
    destroyer: 8,
    cruiser: 8,
    carrier: 4,
    dreadnought: 5,
    warsun: 2,
    flagship: 1,
    commandCounter: 16,
    tradeGood: 12,
    tradeGoodBundle: 4,
};

export const unitTypes: UNITS[] = [
    "infantry", "mech", "spacedock", "pds", "fighter",
    "destroyer", "cruiser", "carrier", "dreadnought", "warsun", "flagship",
];

export const tgTokenTypes: TOKENS[] = [
    tokens.TradeGood,
    tokens.TradeGoodBundle,
];

export const getDraggablePieceProps = (player: number): DraggablePiecePropsByUid => {
    // Units start with no active pieces - they are spawned from containers
    const draggablesByUid: DraggablePiecePropsByUid = {};

    // Pre-place 7 command counters in the rightmost grey hex (p{player}h3)
    const commandCounterToken: TOKENS = "commandCounter";
    const base = referencePoints[`p${player}h3`];
    for (let i = 1; i <= COMMAND_COUNTERS_PRE_PLACED; i++) {
        const props: DraggablePieceProps = { player, name: commandCounterToken, pieceNumber: i };
        const offset = pieceOffsetInHex[`${commandCounterToken}${i}`];
        const uid = getUidFromDraggablePieceProps(props);
        draggablesByUid[uid] = { ...props, x: base.x + offset.x, y: base.y + offset.y };
    }

    return draggablesByUid;
};

