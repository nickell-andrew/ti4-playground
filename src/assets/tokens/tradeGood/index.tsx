import React from 'react';
import Tg1 from '../../general/tg1.png';
import type { ImageComponentProps } from '../../units/black';

const TradeGoodToken: React.FC<ImageComponentProps> = ({ alt, style }) => (
    <div style={{
        ...style,
        borderRadius: '50%',
        backgroundColor: 'rgba(20, 15, 5, 0.75)',
        border: '1.5px solid rgba(180, 130, 30, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        padding: '3px',
    }}>
        <img src={Tg1} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
);

export default TradeGoodToken;
