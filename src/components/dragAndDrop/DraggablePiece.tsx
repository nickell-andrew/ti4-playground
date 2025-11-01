import React, { useMemo } from 'react';
import { DraggableItem } from './DraggableItem';
import { DraggablePieceProps, getUidFromDraggablePieceProps, getImageFromDraggablePieceProps } from './draggablePieceUtils';

export const DraggablePiece: React.FC<DraggablePieceProps> = ({ x, y, ...props }) => {
    const uid = useMemo(() => getUidFromDraggablePieceProps(props), [props]);
    const svg = useMemo(() => getImageFromDraggablePieceProps(props, 1), [props]);

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
};

