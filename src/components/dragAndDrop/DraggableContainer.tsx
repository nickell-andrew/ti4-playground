import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { Wrapper } from './components';
import { getImageFromDraggablePieceProps } from './draggablePieceUtils';
import type { PLAYERS, ALL_PIECES } from '../consts';

interface DraggableContainerProps {
    children: React.ReactNode;
    onDragEnd(event: DragEndEvent): void;
    onDragOver?(event: DragOverEvent): void;
    draggableItems: React.ReactNode;
    containerItems: React.ReactNode;
}

export const DraggableContainer: React.FC<DraggableContainerProps> = ({
    children,
    onDragEnd,
    onDragOver,
    draggableItems,
    containerItems,
}: DraggableContainerProps) => {
    const mouseSensor = useSensor(MouseSensor, {});
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 5 },
    });
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const [dragOverlayImage, setDragOverlayImage] = useState<React.ReactNode>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        if (id.startsWith('container-')) {
            const [, playerStr, name] = id.split('-');
            const player = parseInt(playerStr) as PLAYERS;
            const image = getImageFromDraggablePieceProps({ player, name: name as ALL_PIECES, pieceNumber: 1 }, 1);
            setDragOverlayImage(image);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDragOverlayImage(null);
        onDragEnd(event);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={onDragOver}
        >
            <Wrapper>
                {children}
                {containerItems}
                {draggableItems}
            </Wrapper>
            <DragOverlay dropAnimation={null}>
                {dragOverlayImage ?? null}
            </DragOverlay>
        </DndContext>
    );
};
