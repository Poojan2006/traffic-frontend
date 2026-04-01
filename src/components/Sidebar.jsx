import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ROLE_META = {
    USER:   { label: 'Civilian Portal',    icon: '👤' },
    POLICE: { label: 'Police Dashboard',   icon: '🚔' },
    ADMIN:  { label: 'Admin Panel',        icon: '🛡️' },
};

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'USER';
    const meta = ROLE_META[role] || ROLE_META.USER;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const NavItem = ({ to, icon, label }) => (
        <NavLink 
            to={to} 
            onClick={onClose}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
        </NavLink>
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-dot" />
                    Trivo
                </div>
            </div>

            <div className="nav-section">
                <div className="nav-label">{meta.label}</div>
                <nav className="nav-links">
                    <NavItem to="/dashboard" icon="⊞" label="Dashboard" />

                    {/* Civilian Links */}
                    {role === 'USER' && (
                        <>
                            <NavItem to="/report" icon="＋" label="Report Violation" />
                            <NavItem to="/check-challan" icon="🔍" label="Check Challan" />
                            <NavItem to="/my-violations" icon="📄" label="My Reports" />
                        </>
                    )}

                    {/* Police Links */}
                    {role === 'POLICE' && (
                        <>
                            <NavItem to="/issue-fine" icon="⚖" label="Issue Fine" />
                            <NavItem to="/verify-reports" icon="✓" label="Verify Reports" />
                            <NavItem to="/my-violations" icon="📄" label="Issued Fines" />
                        </>
                    )}

                    {/* Admin Links */}
                    {role === 'ADMIN' && (
                        <>
                            <NavItem to="/issue-fine" icon="⚖" label="Issue Fine" />
                            <NavItem to="/admin" icon="👥" label="Staff Management" />
                            <NavItem to="/verify-reports" icon="✓" label="Verification Portal" />
                            <NavItem to="/my-violations" icon="📄" label="All Violations" />
                        </>
                    )}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {user.username || 'User'}
                    </div>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-muted)', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                    }}>
                        {user.email}
                    </div>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.8125rem', padding: '0.5rem' }}
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
