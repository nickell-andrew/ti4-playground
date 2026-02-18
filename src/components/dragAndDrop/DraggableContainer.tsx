import React from 'react';
import { DndContext, DragEndEvent, useSensor, MouseSensor, TouchSensor, KeyboardSensor, useSensors } from '@dnd-kit/core';
import { Wrapper } from './components';

interface DraggableContainerProps {
    children: React.ReactNode;
    onDragEnd(event: DragEndEvent): void;
    draggableItems: React.ReactNode;
}

export const DraggableContainer: React.FC<DraggableContainerProps> = ({
    children,
    onDragEnd,
    draggableItems,
}: DraggableContainerProps) => {
    const mouseSensor = useSensor(MouseSensor, {});
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 5 },
    });
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={onDragEnd}
        >
            <Wrapper>
                {children}
                {draggableItems}
            </Wrapper>
        </DndContext>
    );
};

