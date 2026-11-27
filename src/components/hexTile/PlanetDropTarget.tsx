import React from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { PlanetTarget } from '../utils/systemTargets';
import { getHexGeometry } from '../utils/boardGeometry';

export function PlanetDropTarget({ hexKey, target, geometry }: { hexKey: string; target: PlanetTarget; geometry: ReturnType<typeof getHexGeometry> }) {
    const { active } = useDndContext();
    const accepts = /-(infantry|mech|spacedock|pds)(-|$)/.test(String(active?.id ?? ''));
    const { setNodeRef, isOver } = useDroppable({ id: `planet-${hexKey}-${target.name}`, disabled: !accepts,
        data: { isHex: true, isPlanet: true, hexKey, planetName: target.name, x: target.x, y: target.y } });
    return <div ref={setNodeRef} className={`planet-drop-target${accepts ? ' visible' : ''}${isOver ? ' over' : ''}`}
        style={{ left: target.x - geometry.x + geometry.width / 2, top: target.y - geometry.y + geometry.height / 2 }}
        aria-label={`Planet drop target: ${target.name}`}><span>{target.name}</span></div>;
}
