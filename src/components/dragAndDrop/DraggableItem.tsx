// import { useState, useCallback, useRef } from "react";
import { useDraggable, UniqueIdentifier } from "@dnd-kit/core";
import { DraggableSvgProps } from "../../svg/Units/Pink/pch_ca-svg";
import { Draggable } from "./components";
import { CSSProperties } from "react";

interface DraggableItemProps {
    uid: UniqueIdentifier;
    top?: number;
    left?: number;
    style?: CSSProperties;
    children?: React.ReactNode
  }
  
  export const DraggableItem = ({
    uid,
    top,
    left,
    style,
    children
  }: DraggableItemProps) =>{
    const {attributes, isDragging, listeners, setNodeRef, transform} =
      useDraggable({
        id: uid,
      });
  
    return (
      <Draggable
        ref={setNodeRef}
        dragging={isDragging}
        label={uid as string}
        listeners={listeners}
        style={{...style, top, left}}
        transform={transform}
        {...attributes}
        >
          {children}
        </Draggable>
    );
  }
