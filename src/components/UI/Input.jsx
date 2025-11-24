import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`} style={{ gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            {label && <label className="text-sm font-medium text-muted">{label}</label>}
            <input
                className="bg-surface border rounded"
                style={{
                    padding: '0.5rem 0.75rem',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                {...props}
            />
            {error && <span className="text-sm text-danger">{error}</span>}
        </div>
    );
};
