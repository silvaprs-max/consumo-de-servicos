import React from 'react';

export const Select = ({ label, options, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`} style={{ gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            {label && <label className="text-sm font-medium text-muted">{label}</label>}
            <select
                className="bg-surface border rounded"
                style={{
                    padding: '0.5rem 0.75rem',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-sm text-danger">{error}</span>}
        </div>
    );
};
