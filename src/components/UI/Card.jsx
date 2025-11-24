import React from 'react';

export const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`bg-surface border rounded shadow p-6 ${className}`} style={{ padding: '1.5rem' }}>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4" style={{ marginBottom: '1rem' }}>
                    {title && <h3 className="text-lg font-bold">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};
