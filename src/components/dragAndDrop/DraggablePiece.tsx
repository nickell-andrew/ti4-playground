import React, { useMemo } from 'react';
import { DraggableItem } from './DraggableItem';
import { DraggablePieceProps, getUidFromDraggablePieceProps, getImageFromDraggablePieceProps } from './draggablePieceUtils';
import damageMarker from '../../assets/async/damage.png';

interface Props extends DraggablePieceProps {
    selected?: boolean;
    selectedIds?: string[];
    onSelect?: (id: string, additive: boolean) => void;
}
export const DraggablePiece: React.FC<Props> = React.memo(({ x, y, selected, selectedIds, onSelect, ...props }) => {
    const uid = useMemo(() => getUidFromDraggablePieceProps(props), [props.player, props.name, props.pieceNumber]); // eslint-disable-line react-hooks/exhaustive-deps
    const svg = useMemo(() => getImageFromDraggablePieceProps(props, props.commandPool ? 0.65 : props.tradeGoodPlayer ? 0.67 : props.layoutScale ?? 1), [props.player, props.name, props.pieceNumber, props.commandPool, props.tradeGoodPlayer, props.layoutScale]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DraggableItem
            {...props}
            uid={uid}
            top={y}
            left={x}
            selected={selected}
            selectedIds={selectedIds}
            onSelect={onSelect}
            inPool={!!props.commandPool}
            groundPiece={['infantry', 'mech', 'pds', 'spacedock'].includes(props.name)}
            style={{ ...props.style, '--pool-rotation': `${((props.pieceNumber * 13 + props.player * 7) % 19) - 9}deg` } as React.CSSProperties}
        >
            {svg}
            {props.damaged && <img className="ship-damage" src={damageMarker} alt="Damaged" draggable={false} />}
        </DraggableItem>
    );
});

