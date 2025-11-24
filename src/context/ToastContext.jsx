import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none', // Allow clicking through the container
                }}
            >
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    const { id, message, type } = toast;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            case 'info': return <Info size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return { bg: 'var(--color-surface)', border: 'var(--color-success)', text: 'var(--color-text)' };
            case 'error': return { bg: 'var(--color-surface)', border: 'var(--color-danger)', text: 'var(--color-text)' };
            case 'info': return { bg: 'var(--color-surface)', border: 'var(--color-primary)', text: 'var(--color-text)' };
            default: return { bg: 'var(--color-surface)', border: 'var(--color-primary)', text: 'var(--color-text)' };
        }
    };

    const colors = getColors();

    return (
        <div
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                animation: 'slideIn 0.3s ease-out forwards',
                color: colors.text,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: colors.border }}>{getIcon()}</span>
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={() => onRemove(id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <X size={16} />
            </button>
        </div>
    );
};
