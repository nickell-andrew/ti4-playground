import React, { useMemo } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { ALL_PIECES } from '../consts';
import { getImageFromDraggablePieceProps } from './draggablePieceUtils';
import styles from './PieceContainer.module.css';

export const getTGContainerUid = (name: ALL_PIECES): string =>
    `container-shared-${name}`;

export interface TGContainerProps {
    name: ALL_PIECES;
    x: number;
    y: number;
}

export const TGContainer: React.FC<TGContainerProps> = React.memo(({
    name,
    x,
    y,
}) => {
    const uid = useMemo(() => getTGContainerUid(name), [name]);

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
    } = useDraggable({
        id: uid,
        data: { name, isContainer: true, isSharedTG: true },
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: uid,
        data: { name, isContainer: true, isSharedTG: true },
    });

    const setRef = (el: HTMLDivElement | null) => {
        setDraggableRef(el);
        setDroppableRef(el);
    };

    // player: 1 is used only to look up the (color-agnostic) image
    const image = useMemo(() =>
        getImageFromDraggablePieceProps({ player: 1, name, pieceNumber: 1 }, 1),
        [name]
    );

    return (
        <div
            ref={setRef}
            className={classNames(
                styles.container,
                isOver && styles.isOver,
            )}
            style={{ left: x, top: y } as React.CSSProperties}
            {...attributes}
            {...listeners}
        >
            <div className={styles.imageWrapper}>
                {image}
            </div>
        </div>
    );
});
