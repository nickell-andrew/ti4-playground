import { UNITS, TOKENS, ALL_PIECES, tokens } from '../consts';
import { DraggablePieceProps, DraggablePiecePropsByUid, getUidFromDraggablePieceProps } from './draggablePieceUtils';
import { organizeCommandPools } from '../utils/commandPools';

export const INITIAL_COMMAND_POOL_COUNTS = { tactics: 3, fleet: 3, strategy: 2 } as const;
export const COMMAND_COUNTERS_PRE_PLACED = Object.values(INITIAL_COMMAND_POOL_COUNTS).reduce((sum, count) => sum + count, 0);

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

    // Pre-place command counters in each player's rightmost grey hex.
    const commandCounterToken: TOKENS = "commandCounter";
    let pieceNumber = 1;
    (Object.keys(INITIAL_COMMAND_POOL_COUNTS) as (keyof typeof INITIAL_COMMAND_POOL_COUNTS)[]).forEach(commandPool => {
        for (let i = 0; i < INITIAL_COMMAND_POOL_COUNTS[commandPool]; i++) {
            const props: DraggablePieceProps = { player, name: commandCounterToken, pieceNumber: pieceNumber++ };
            const uid = getUidFromDraggablePieceProps(props);
            draggablesByUid[uid] = { ...props, commandPool };
        }
    });

    return organizeCommandPools(draggablesByUid, player);
};

export const getInitialPieces = (playerCount: number): DraggablePiecePropsByUid => {
    const pieces: DraggablePiecePropsByUid = {};
    for (let player = 1; player <= playerCount; player++) {
        Object.assign(pieces, getDraggablePieceProps(player));
    }
    return pieces;
};

