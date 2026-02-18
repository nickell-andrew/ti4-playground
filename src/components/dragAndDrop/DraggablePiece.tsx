import React, { useMemo } from 'react';
import { DraggableItem } from './DraggableItem';
import { DraggablePieceProps, getUidFromDraggablePieceProps, getImageFromDraggablePieceProps } from './draggablePieceUtils';

export const DraggablePiece: React.FC<DraggablePieceProps> = React.memo(({ x, y, ...props }) => {
    const uid = useMemo(() => getUidFromDraggablePieceProps(props), [props.player, props.name, props.pieceNumber]); // eslint-disable-line react-hooks/exhaustive-deps
    const svg = useMemo(() => getImageFromDraggablePieceProps(props, 1), [props.player, props.name, props.pieceNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DraggableItem
            {...props}
            uid={uid}
            top={y}
            left={x}
        >
            {svg}
        </DraggableItem>
    );
});

