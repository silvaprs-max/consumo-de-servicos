import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, BarChart2, Zap, Sun, Moon, X, LogOut, Download, Upload, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { encryptData, decryptData } from '../../utils/crypto';
import { useToast } from '../../context/ToastContext';
import { entryService } from '../../services/entryService';

const Sidebar = ({ isOpen, isMobile, onClose }) => {
    const { theme, toggleTheme, entries, addEntry } = useData();
    const { signOut, user, profile } = useAuth();
    const { addToast } = useToast();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [exportPassword, setExportPassword] = useState('');
    const [importPassword, setImportPassword] = useState('');
    const [importFile, setImportFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const navItems = [
        { icon: Home, label: 'Início', path: '/' },
        { icon: List, label: 'Lançamentos', path: '/entries' },
        { icon: BarChart2, label: 'Dashboard', path: '/dashboard' },
        ...(profile?.is_admin ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
    ];

    const handleExport = () => {
        if (!exportPassword || exportPassword.length < 6) {
            addToast('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        try {
            setIsProcessing(true);
            const encryptedData = encryptData(entries, exportPassword);
            const blob = new Blob([encryptedData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ecotrack_backup_${new Date().toISOString().split('T')[0]}.ecobak`;
            link.click();
            URL.revokeObjectURL(url);

            addToast('Backup exportado com sucesso!', 'success');
            setShowExportModal(false);
            setExportPassword('');
        } catch (error) {
            addToast('Erro ao exportar backup', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            addToast('Selecione um arquivo de backup', 'error');
            return;
        }

        if (!importPassword) {
            addToast('Digite a senha do backup', 'error');
            return;
        }

        try {
            setIsProcessing(true);
            const fileContent = await importFile.text();
            const decryptedData = decryptData(fileContent, importPassword);

            if (!Array.isArray(decryptedData)) {
                throw new Error('Formato de arquivo inválido');
            }

            // Import entries using upsert to avoid duplicates
            let successCount = 0;
            for (const entry of decryptedData) {
                try {
                    await entryService.upsert(entry);
                    successCount++;
                } catch (err) {
                    console.error('Failed to import entry:', err);
                }
            }

            addToast(`${successCount} lançamentos importados com sucesso!`, 'success');
            setShowImportModal(false);
            setImportPassword('');
            setImportFile(null);

            // Reload the page to refresh data
            window.location.reload();
        } catch (error) {
            console.error('Import error:', error);
            addToast(error.message || 'Erro ao importar backup', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <aside className="bg-surface border" style={{
                width: '250px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                zIndex: 10,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: isMobile && isOpen ? 'var(--shadow-md)' : 'none'
            }}>
                <div className="p-6 flex items-center justify-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-success))',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <h1 className="font-bold text-lg">EcoTrack</h1>
                    </div>
                    {isMobile && (
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={isMobile ? onClose : undefined}
                                    className={({ isActive }) => isActive ? 'active-link' : 'nav-link'}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                        fontWeight: isActive ? '600' : '500',
                                        transition: 'all 0.2s'
                                    })}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}

                        {/* Divider */}
                        <li style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }}></li>

                        {/* Backup/Restore buttons */}
                        <li>
                            <button
                                onClick={() => setShowExportModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                                    e.currentTarget.style.color = 'var(--color-text)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-muted)';
                                }}
                            >
                                <Download size={20} />
                                <span>Exportar Backup</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setShowImportModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                                    e.currentTarget.style.color = 'var(--color-text)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-muted)';
                                }}
                            >
                                <Upload size={20} />
                                <span>Importar Backup</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text)',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-md)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </button>
                    {user && (
                        <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                            <p style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>Usuário</p>
                            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.email}>{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={signOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-md)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                    <div style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.5rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--color-text)',
                        fontWeight: '500'
                    }}>
                        Autor: Paulo Roberto Santos da Silva
                    </div>
                </div>
            </aside>

            {/* Export Modal */}
            <Modal
                isOpen={showExportModal}
                onClose={() => {
                    setShowExportModal(false);
                    setExportPassword('');
                }}
                title="Exportar Backup Criptografado"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => {
                            setShowExportModal(false);
                            setExportPassword('');
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExport} disabled={isProcessing}>
                            {isProcessing ? 'Exportando...' : 'Exportar'}
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p className="text-sm text-muted">
                        Defina uma senha forte para proteger seus dados. Esta senha será necessária para restaurar o backup.
                    </p>
                    <Input
                        label="Senha do Backup"
                        type="password"
                        value={exportPassword}
                        onChange={(e) => setExportPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}>
                        <strong>⚠️ Importante:</strong> Guarde esta senha em local seguro. Sem ela, não será possível recuperar os dados do backup.
                    </div>
                </div>
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={showImportModal}
                onClose={() => {
                    setShowImportModal(false);
                    setImportPassword('');
                    setImportFile(null);
                }}
                title="Importar Backup Criptografado"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => {
                            setShowImportModal(false);
                            setImportPassword('');
                            setImportFile(null);
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleImport} disabled={isProcessing || !importFile}>
                            {isProcessing ? 'Importando...' : 'Importar'}
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p className="text-sm text-muted">
                        Selecione o arquivo de backup (.ecobak) e digite a senha utilizada na exportação.
                    </p>
                    <div>
                        <label className="text-sm font-medium text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Arquivo de Backup
                        </label>
                        <input
                            type="file"
                            accept=".ecobak"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-surface)',
                                color: 'var(--color-text)'
                            }}
                        />
                    </div>
                    <Input
                        label="Senha do Backup"
                        type="password"
                        value={importPassword}
                        onChange={(e) => setImportPassword(e.target.value)}
                        placeholder="Digite a senha do backup"
                        required
                    />
                    {importFile && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem'
                        }}>
                            <strong>Arquivo selecionado:</strong> {importFile.name}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Sidebar;
