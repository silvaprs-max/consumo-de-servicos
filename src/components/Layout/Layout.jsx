import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '../UI/Button';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex" style={{ minHeight: '100vh', position: 'relative' }}>
            <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />

            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 9
                    }}
                />
            )}

            <main style={{
                marginLeft: isMobile ? '0' : '250px',
                width: isMobile ? '100%' : 'calc(100% - 250px)',
                padding: '2rem',
                backgroundColor: 'var(--color-background)',
                minHeight: '100vh',
                transition: 'margin-left 0.3s ease, width 0.3s ease'
            }}>
                {isMobile && (
                    <div className="mb-4 flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </Button>
                        <span className="font-bold text-lg">EcoTrack</span>
                    </div>
                )}
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
