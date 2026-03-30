import React, { useState } from 'react';
import API from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const TEST_ACCOUNTS = [
    { role: 'Admin',    icon: '🛡️', email: 'admin@trivo.com',    password: 'Admin@123',    color: '#f59e0b' },
    { role: 'Police',   icon: '👮', email: 'police@trivo.com',   password: 'Police@123',   color: '#60a5fa' },
    { role: 'Civilian', icon: '🧑', email: 'civilian@trivo.com', password: 'Civilian@123', color: '#34d399' },
];

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem(
                'user',
                JSON.stringify(res.data.user || { email: credentials.email, role: 'USER' })
            );
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            background: 'var(--bg)',
            backgroundImage: `
                radial-gradient(circle at 15% 50%, rgba(79, 110, 247, 0.15), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(159, 70, 228, 0.15), transparent 25%)
            `,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Glowing Orbs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(79, 110, 247, 0.2)', filter: 'blur(100px)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(159, 70, 228, 0.2)', filter: 'blur(100px)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite reverse' }}></div>

            <div className="auth-card" style={{ position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, var(--primary), #8330c8)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            margin: '0 auto 1.25rem',
                            boxShadow: '0 8px 16px rgba(79, 110, 247, 0.25)',
                            transform: 'rotate(-5deg)',
                        }}
                    >
                        🚦
                    </div>
                    <h1 style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #ffffff, #a0a5b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.2rem'
                    }}>
                        Welcome to Trivo
                    </h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', fontWeight: 500 }}>
                        Next-Gen Traffic Management System
                    </p>
                </div>

                {/* Login Form */}
                <div className="glass-card">
                    {error && (
                        <div
                            style={{
                                background: 'var(--danger-dim)',
                                border: '1px solid rgba(224,82,82,0.25)',
                                color: 'var(--danger)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '1.25rem',
                                fontSize: '0.85rem',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="officer@trivo.com"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* ── Test Credentials Panel ── */}
                <div
                    style={{
                        marginTop: '1.75rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                    }}
                >
                    <p
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            marginBottom: '0.75rem',
                            opacity: 0.7,
                        }}
                    >
                        🔑 Test Credentials — click to fill
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {TEST_ACCOUNTS.map(({ role, icon, email, password, color }) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setCredentials({ email, password })}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${color}33`,
                                    borderRadius: '8px',
                                    padding: '0.55rem 0.85rem',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background 0.18s, border-color 0.18s',
                                    width: '100%',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${color}18`;
                                    e.currentTarget.style.borderColor = `${color}88`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = `${color}33`;
                                }}
                            >
                                <span style={{ fontSize: '1rem' }}>{icon}</span>
                                <span style={{ flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color }}>
                                        {role}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.72rem',
                                            color: 'var(--text-muted)',
                                            opacity: 0.8,
                                        }}
                                    >
                                        {email}
                                    </span>
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.68rem',
                                        color: 'var(--text-muted)',
                                        opacity: 0.55,
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {password}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
