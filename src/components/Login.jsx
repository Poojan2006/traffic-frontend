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
            background: 'linear-gradient(135deg, #0b1128 0%, #05070e 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {/* Soft Ambient Lights */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)', filter: 'blur(60px)' }}></div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 90% 80%, rgba(79, 70, 229, 0.06) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                maxWidth: '1200px',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4rem',
                zIndex: 10
            }}>
                {/* Left Description Area */}
                <div style={{ 
                    flex: '1 1 450px', 
                    padding: '2rem 1rem',
                }}>
                    <div
                        style={{
                            width: 68, height: 68,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', marginBottom: '1.5rem',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                        }}
                    >🚦</div>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: 800,
                        color: '#f8fafc',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        marginBottom: '1.2rem'
                    }}>
                        Empowering <br />
                        <span style={{ 
                            background: 'linear-gradient(to right, #60a5fa, #818cf8)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent' 
                        }}>Smart Traffic</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '460px' }}>
                        Trivo Platform brings police, civilians, and administrators into one unified ecosystem for safer, faster, and more intelligent traffic rule enforcement.
                    </p>
                </div>

                {/* Right Login Box */}
                <div className="auth-card" style={{ 
                    flex: '1 1 400px', 
                    maxWidth: '440px' 
                }}>

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
                            style={{ 
                                width: '100%', 
                                marginTop: '1rem',
                                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                                border: 'none',
                                padding: '0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                            }}
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
        </div>
    );
};

export default Login;
