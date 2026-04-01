import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();

    // Map path to title
    const getTitle = (pathname) => {
        const path = pathname.split('/')[1];
        switch (path) {
            case 'dashboard': return 'Dashboard';
            case 'report': return 'Report Violation';
            case 'check-challan': return 'Check Challan';
            case 'my-violations': return 'My Reports';
            case 'issue-fine': return 'Issue Fine';
            case 'verify-reports': return 'Verify Reports';
            case 'admin': return 'User Management';
            default: return 'Trivo';
        }
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onToggleSidebar}>
                    ☰
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {getTitle(location.pathname)}
                </h1>
            </div>

            <div className="header-right">
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {user.username || 'User'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user.role || 'CIVILIAN'}
                    </span>
                </div>
                <div style={{ 
                    width: 36, height: 36, 
                    borderRadius: '50%', 
                    background: 'var(--accent)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', color: 'white'
                }}>
                    {(user.username || 'U').charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default Header;
