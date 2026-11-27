import React, { useState } from 'react';
import { getMapPlanets, strategyCards, TabletopCards, CardState } from './utils/tabletopCards';
import { TILE_NUMBER_AND_ROTATION } from './utils/mapData';
import './TabletopCardsPanel.css';
import { DrawerCard } from './cards/BoardCards';

interface Props {
    hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>;
    playerCount: number;
    cards: TabletopCards;
    onChange: (kind: keyof TabletopCards, id: string, state: CardState) => void;
    onReadyPlanets: () => void;
    onReturnStrategies: () => void;
}

export function TabletopCardsPanel({ hexTiles, playerCount, cards, onChange, onReadyPlanets, onReturnStrategies }: Props) {
    const [tab, setTab] = useState<'strategies' | 'planets'>('strategies');
    const [filter, setFilter] = useState('all');
    const planets = getMapPlanets(hexTiles);
    const entries = tab === 'strategies' ? strategyCards : planets.map(planet => ({ id: planet.name, name: planet.name, color: '#42678f', planet }));
    return <section className="tabletop-cards" aria-label="Tabletop cards">
        <div className="card-tabs" role="tablist" aria-label="Card type">
            <button role="tab" aria-selected={tab === 'strategies'} onClick={() => setTab('strategies')}>Strategy cards</button>
            <button role="tab" aria-selected={tab === 'planets'} onClick={() => setTab('planets')}>Planet cards</button>
        </div>
        <div className="cards-toolbar">
            <label>Show <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All players</option><option value="unassigned">Unassigned</option>
                {Array.from({ length: playerCount }, (_, i) => <option key={i} value={i + 1}>Player {i + 1}</option>)}
            </select></label>
            <button onClick={tab === 'strategies' ? onReturnStrategies : onReadyPlanets}>{tab === 'strategies' ? 'Return strategy cards' : 'Ready all planets'}</button>
        </div>
        <div className={`card-list ${tab}`}>
            {entries.filter(card => filter === 'all' || (filter === 'unassigned' ? !cards[tab][card.id]?.player : cards[tab][card.id]?.player === Number(filter))).map(card => {
                const state = cards[tab][card.id] ?? { player: null, exhausted: false };
                const planet = tab === 'planets' ? planets.find(p => p.name === card.id) : undefined;
                return <article key={card.id} className={`tabletop-card${state.exhausted ? ' exhausted' : ''}`} style={{ borderColor: card.color }}>
                    <DrawerCard kind={tab} id={card.id} state={state} planet={planet} onFlip={() => onChange(tab, card.id, { ...state, exhausted: !state.exhausted })} />
                    <label className="card-owner"><select aria-label={`Owner of ${card.name}`} value={state.player ?? ''} onChange={e => {
                        const player = e.target.value ? Number(e.target.value) : null;
                        onChange(tab, card.id, { ...state, x: undefined, y: undefined, player, exhausted: tab === 'planets' && player !== null });
                    }}><option value="">Unassigned</option>
                        {Array.from({ length: playerCount }, (_, i) => <option key={i} value={i + 1}>Player {i + 1}</option>)}
                    </select></label>
                </article>;
            })}
            {entries.length === 0 && <p>Add planet systems to the map to see their cards.</p>}
        </div>
    </section>;
}
