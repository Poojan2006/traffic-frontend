import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'USER';

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="app-root" data-role={role}>
            {/* Sidebar with open state for mobile */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="main-wrapper">
                <Header onToggleSidebar={toggleSidebar} />
                <main className="main-content">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, 
                        background: 'rgba(0,0,0,0.5)', zIndex: 90,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}
        </div>
    );
};

export default Layout;
