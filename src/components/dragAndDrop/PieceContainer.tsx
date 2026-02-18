import React, { useMemo } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { PLAYERS, ALL_PIECES } from '../consts';
import { getImageFromDraggablePieceProps } from './draggablePieceUtils';
import styles from './PieceContainer.module.css';

export interface PieceContainerProps {
    player: PLAYERS;
    name: ALL_PIECES;
    x: number;
    y: number;
    activeCount: number;
    maxCount: number;
}

export const getContainerUid = (player: PLAYERS, name: ALL_PIECES): string =>
    `container-${player}-${name}`;

export const PieceContainer: React.FC<PieceContainerProps> = React.memo(({
    player,
    name,
    x,
    y,
    activeCount,
    maxCount,
}) => {
    const uid = useMemo(() => getContainerUid(player, name), [player, name]);
    const remaining = maxCount - activeCount;
    const isDisabled = remaining <= 0;

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
    } = useDraggable({
        id: uid,
        disabled: isDisabled,
        data: { player, name, isContainer: true },
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: uid,
        data: { player, name, isContainer: true },
    });

    // Combine both refs
    const setRef = (el: HTMLDivElement | null) => {
        setDraggableRef(el);
        setDroppableRef(el);
    };

    const image = useMemo(() =>
        getImageFromDraggablePieceProps({ player, name, pieceNumber: 1 }, 1),
        [player, name]
    );

    return (
        <div
            ref={setRef}
            className={classNames(
                styles.container,
                isDisabled && styles.disabled,
                isOver && !isDisabled && styles.isOver,
            )}
            style={{ left: x, top: y } as React.CSSProperties}
            {...attributes}
            {...listeners}
        >
            <div className={styles.imageWrapper}>
                {image}
                {!isDisabled && (
                    <span className={styles.badge}>{remaining}</span>
                )}
            </div>
        </div>
    );
});
