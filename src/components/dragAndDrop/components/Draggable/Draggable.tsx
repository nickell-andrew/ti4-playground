import React, {CSSProperties, forwardRef} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle} from '../Item/components/Handle';

import {
  draggable,
  draggableHorizontal,
  draggableVertical,
} from './draggable-svg';
import styles from './Draggable.module.css';
import { DraggableSvgProps } from '../../../../svg/Units/Pink/pch_ca-svg';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  label?: string;
  style: CSSProperties;
  listeners?: DraggableSyntheticListeners;
  transform?: Transform | null;
  isPendingDelay?: boolean;
  children?: React.ReactNode;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      dragOverlay,
      dragging,
      label,
      style,
      listeners,
      transform,
      isPendingDelay = false,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          // handle && styles.handle,
          isPendingDelay && styles.pendingDelay
        )}
        style={
          {
            zIndex: 100,
            ...style,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        {/* {<label>{`${style.left}, ${style.top}`}</label>} */}
        <button
          {...props}
          style={style}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...listeners}
          ref={ref}
        >
          {props.children || <span style={{ color: '#FFF' }}>{label}</span>}
        </button>
      </div>
    );
  }
);
