import React from 'react';
import { Planet } from '../../assets/data/tiles';
import { strategyCards } from '../utils/tabletopCards';
import './Cards.css';

const artwork = (name: string): string => require(`../../assets/async/${name}.png`);
export function CardArt({ kind, id, planet, exhausted = false }: { kind: 'strategies' | 'planets'; id: string; planet?: Planet; exhausted?: boolean }) {
    if (kind === 'strategies') return <img className={`strategy-art${exhausted ? ' used' : ''}`} src={artwork(`strategy-${id}`)} alt={`${strategyCards.find(card => card.id === id)?.name ?? id} strategy card`} draggable={false} />;
    if (!planet) return null;
    const status = exhausted ? 'exh' : 'rdy';
    const trait = planet.name === 'Mecatol Rex' ? 'mr' : planet.traits?.[0] ?? 'none';
    return <span className={`planet-art${exhausted ? ' exhausted' : ''}`} role="img" aria-label={`${planet.name}: ${planet.resources} resources, ${planet.influence} influence${exhausted ? ', exhausted' : ''}`}>
        <img className="planet-trait-art" src={artwork(`attribute-${trait}`)} alt="" draggable={false} />
        <span className="planet-vertical-name">{planet.name}</span>
        {planet.legendary && <img className="planet-legendary-art" src={artwork(`legendary-${status}`)} alt="Legendary" draggable={false} />}
        {planet.specialties?.[0] && <img className="planet-tech-art" src={artwork(`tech_${planet.specialties[0].toLowerCase()}-${status}`)} alt={planet.specialties[0]} draggable={false} />}
        <span className="planet-value resource"><img src={artwork(`res-${status}`)} alt="" draggable={false} /><b>{planet.resources}</b></span>
        <span className="planet-value influence"><img src={artwork(`inf-${status}`)} alt="" draggable={false} /><b>{planet.influence}</b></span>
    </span>;
}
