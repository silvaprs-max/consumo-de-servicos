import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: '500',
        transition: 'all 0.2s',
        border: 'none',
        cursor: 'pointer',
        gap: '0.5rem'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
        },
        secondary: {
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
        },
        danger: {
            backgroundColor: 'var(--color-danger)',
            color: '#fff',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
        }
    };

    const sizes = {
        sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
        md: { padding: '0.5rem 1rem', fontSize: '1rem' },
        lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
        icon: { padding: '0.5rem', width: '36px', height: '36px' }
    };

    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
    };

    return (
        <button
            className={className}
            style={style}
            onMouseOver={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--color-background)';
            }}
            onMouseOut={(e) => {
                if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }}
            {...props}
        >
            {children}
        </button>
    );
};
