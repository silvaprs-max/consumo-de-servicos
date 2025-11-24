import React from 'react';

export const Spinner = ({ size = 24, color = 'var(--color-primary)' }) => {
    return (
        <div style={{
            width: size,
            height: size,
            border: `3px solid ${color}`,
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            boxSizing: 'border-box',
            animation: 'rotation 1s linear infinite',
        }} />
    );
};
