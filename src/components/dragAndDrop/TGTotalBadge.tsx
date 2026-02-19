import React from 'react';
import { PLAYERS } from '../consts';

export interface TGTotalBadgeProps {
    player: PLAYERS;
    singles: number;
    bundles: number;
    x: number;
    y: number;
}

export const TGTotalBadge: React.FC<TGTotalBadgeProps> = React.memo(({
    singles,
    bundles,
    x,
    y,
}) => {
    const total = singles + bundles * 3;

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: '#D4A017',
                fontWeight: 'bold',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '8px',
                border: '1px solid #8B6914',
                pointerEvents: 'none',
                zIndex: 60,
                whiteSpace: 'nowrap',
                userSelect: 'none',
            }}
        >
            {total} TG
        </div>
    );
});
