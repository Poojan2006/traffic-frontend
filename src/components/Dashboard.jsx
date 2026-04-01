import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import AnalyticsMap from './AnalyticsMap';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [violationList, setViolationList] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, paid: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const verifyRes = await API.get('/auth/verify');
                const u = verifyRes.data.user;
                setUser(u);

                const endpoint = u.role === 'USER' ? '/violations/my' : '/violations/pending';
                const res = await API.get(endpoint);
                const list = res.data;
                setViolationList(list);
                setStats({
                    total: list.length,
                    pending: list.filter(v => v.status === 'PENDING').length,
                    verified: list.filter(v => v.status === 'VERIFIED').length,
                    paid: list.filter(v => v.status === 'PAID').length,
                });
            } catch (err) {
                console.error('Dashboard load error', err);
            }
        };
        load();
    }, []);

    if (!user) return <div className="loading" style={{ height: 'calc(100vh - 100px)' }}>Loading Dashboard...</div>;

    const isPolice = user.role !== 'USER';
    const primaryAction = isPolice ? { label: 'Issue Fine', path: '/issue-fine' } : { label: 'Report Violation', path: '/report' };

    const getBadge = (pts) => {
        const p = pts || 0;
        if (p >= 100) return { name: 'Gold Sentinel', icon: '🏆', color: '#fbbf24' };
        if (p >= 50) return { name: 'Silver Guardian', icon: '🥈', color: '#94a3b8' };
        if (p >= 20) return { name: 'Bronze Observer', icon: '🥉', color: '#d97706' };
        return { name: 'Rookie Reporter', icon: '🎖️', color: 'var(--accent)' };
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Welcome back, {user.username}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                    {isPolice ? 'Monitor and manage traffic enforcement efficiency.' : 'Track your reports and civic contribution points.'}
                </p>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                {[
                    { label: 'Total Records', value: stats.total, icon: '📊', color: 'var(--text-primary)' },
                    { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'var(--warning)' },
                    { label: 'Verified Cases', value: stats.verified, icon: '✅', color: 'var(--success)' },
                    { label: 'Settled Fines', value: stats.paid, icon: '💳', color: 'var(--accent)' },
                ].map(s => (
                    <div key={s.label} className="card stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                            <span style={{ color: s.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live</span>
                        </div>
                        <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                        <span className="stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                
                {/* Left Column: Recent Activity & Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Activity Feed */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem' }}>{isPolice ? 'Validation Queue' : 'My Recent Reports'}</h3>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} onClick={() => navigate(isPolice ? '/verify-reports' : '/my-violations')}>
                                View All Activity
                            </button>
                        </div>

                        {violationList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📁</div>
                                <p>No recent activity found on your account.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {violationList.slice(0, 5).map(v => (
                                    <div key={v.id} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '1.25rem', 
                                        padding: '1rem', background: 'rgba(255,255,255,0.02)', 
                                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                                        transition: 'all 0.2s', cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-main)' }}>
                                            <img src={`${API.defaults.baseURL}/violations/image/${v.id}`} alt="evidence" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{v.description}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                {v.vehicleNo && <span style={{ marginRight: '1rem' }}>🚗 {v.vehicleNo}</span>}
                                                <span>📅 {new Date(v.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className={`badge badge-${v.status.toLowerCase()}`}>{v.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Geospatial View */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Geospatial Analytics</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live heatmap showing reported violations across the operational area.</p>
                        </div>
                        <div style={{ height: '340px', background: 'var(--bg-main)' }}>
                            <AnalyticsMap violations={violationList} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Rank Card (Civilian Only) */}
                    {!isPolice && (
                        <div className="card glass" style={{ borderLeft: '4px solid var(--accent)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ fontSize: '3rem' }}>{getBadge(user.points).icon}</div>
                                <div>
                                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Rank</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: getBadge(user.points).color }}>{getBadge(user.points).name}</div>
                                    <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        <span style={{ fontWeight: 700 }}>{user.points || 0}</span> / 100 XP
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '1.25rem', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(user.points || 0, 100)}%`, height: '100%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
                            </div>
                        </div>
                    )}

                    {/* Quick Launch */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Quick Launch</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate(primaryAction.path)}>
                                {primaryAction.label}
                            </button>
                            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate(isPolice ? '/verify-reports' : '/check-challan')}>
                                {isPolice ? 'Verify Pending Reports' : 'Check Active Challans'}
                            </button>
                            {isPolice && (
                                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/my-violations')}>
                                    History of Issued Fines
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Feature Highlight */}
                    <div className="card" style={{ background: 'var(--accent-soft)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>AI Insight</div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                            Our <strong>AI Analysis Engine</strong> automatically detects vehicle plates and classifies violations from your photos for faster processing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
