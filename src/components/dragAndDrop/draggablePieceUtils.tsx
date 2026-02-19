import React, { CSSProperties } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { BASE_FACTION_COLORS, baseFactionColors, units, tokens, ALL_PIECES, PLAYERS } from '../consts';
import allUnitImages from '../../assets/units';
import allTokenImages from '../../assets/tokens';
import type { TokenImageEntry } from '../../assets/tokens';
import { ImageComponentProps } from '../../assets/units/black';
import { pieceSize } from '../consts';

export interface DraggablePieceProps {
    player: PLAYERS;
    name: ALL_PIECES;
    pieceNumber: number;
    x?: number;
    y?: number;
    style?: CSSProperties;
}

export type DraggablePiecePropsByUid = Record<UniqueIdentifier, DraggablePieceProps>;

export const getUidFromDraggablePieceProps = ({ player, name, pieceNumber }: DraggablePieceProps): UniqueIdentifier => {
    return `${player}-${name}-${pieceNumber}`;
};

export const getAltTextFromDraggablePieceProps = ({ player, name, pieceNumber }: DraggablePieceProps): string => {
    return `${player}-${name}-${pieceNumber}`;
};

type PNGsForFaction = Record<ALL_PIECES, React.FC<ImageComponentProps>>;
type allPNGsType = Record<BASE_FACTION_COLORS, PNGsForFaction>;

function getTokenComponent(
    entry: TokenImageEntry,
    color: BASE_FACTION_COLORS
): React.FC<ImageComponentProps> {
    if (typeof entry === 'function') {
        return entry;
    }
    return entry[color];
}

const allPNGs: allPNGsType = Object.values(baseFactionColors).reduce((dict, color) => {
    dict[color] = {
        ...Object.values(units).reduce((dict, name) => {
            dict[name] = allUnitImages[color][name];
            return dict;
        }, {} as PNGsForFaction),
        ...Object.values(tokens).reduce((dict, name) => {
            const entry = allTokenImages[name];
            dict[name] = getTokenComponent(entry, color);
            return dict;
        }, {} as PNGsForFaction)
    };
    return dict;
}, {} as allPNGsType);

const colorsByPlayer: Record<PLAYERS, BASE_FACTION_COLORS> = {
    1: baseFactionColors.Green,
    2: baseFactionColors.Purple,
    3: baseFactionColors.Black,
    4: baseFactionColors.Pink,
    5: baseFactionColors.Yellow,
    6: baseFactionColors.Blue
};

export const getImageFromDraggablePieceProps = (
    { player, name, pieceNumber }: DraggablePieceProps,
    scaleFactor: number
): React.ReactNode => {
    const [width, height] = pieceSize[name];
    const Component = allPNGs[colorsByPlayer[player]][name];
    return (
        <Component
            alt={getAltTextFromDraggablePieceProps({ player, name, pieceNumber })}
            style={{ width: `${width}px`, height: `${height}px` }}
        />
    );
};
