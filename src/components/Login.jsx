import React, { useState } from 'react';
import API from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const TEST_ACCOUNTS = [
    { role: 'Admin',    icon: '🛡️', email: 'admin@trivo.com',    password: 'Admin@123',    color: '#8b5cf6' },
    { role: 'Police',   icon: '🚔', email: 'police@trivo.com',   password: 'Police@123',   color: '#f59e0b' },
    { role: 'Civilian', icon: '👤', email: 'civilian@trivo.com', password: 'Civilian@123', color: '#3b82f6' },
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
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ 
            display: 'flex', minHeight: '100vh', width: '100vw',
            background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' 
        }}>
            {/* Background Decorative Elements */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
                filter: 'blur(80px)', zIndex: 0, opacity: 0.5
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)', zIndex: 0, opacity: 0.5
            }} />

            <div style={{ 
                display: 'flex', width: '100%', maxWidth: '1200px', margin: 'auto', 
                padding: '2rem', gap: '4rem', alignItems: 'center', zIndex: 1,
                flexWrap: 'wrap'
            }}>
                
                {/* Left Side: Brand & Mission */}
                <div style={{ flex: '1 1 400px' }}>
                    <div className="sidebar-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                        <div className="logo-dot" style={{ width: 14, height: 14 }} />
                        Trivo
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff' }}>
                        The Future of <br />
                        <span style={{ color: 'var(--accent)' }}>Traffic Safety.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
                        A comprehensive ecosystem connecting citizens, law enforcement, and administrators to build smarter, safer cities through intelligent traffic management.
                    </p>
                </div>

                {/* Right Side: Login Card */}
                <div style={{ flex: '1 1 400px', maxWidth: '460px' }}>
                    <div className="card glass" style={{ padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                            Enter your credentials to access your portal.
                        </p>

                        {error && (
                            <div className="badge-danger" style={{ 
                                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', 
                                marginBottom: '1.5rem', fontSize: '0.8125rem', textTransform: 'none'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
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
                                style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Test Credentials Helper */}
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                            <span style={{ 
                                fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', 
                                textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block',
                                marginBottom: '1rem'
                            }}>
                                Quick Access (Demo Only)
                            </span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                {TEST_ACCOUNTS.map((acc) => (
                                    <button
                                        key={acc.role}
                                        onClick={() => setCredentials({ email: acc.email, password: acc.password })}
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${acc.color}20`,
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `${acc.color}10`;
                                            e.currentTarget.style.borderColor = acc.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.borderColor = `${acc.color}20`;
                                        }}
                                    >
                                        <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{acc.icon}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: acc.color }}>{acc.role}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            New to the platform?{' '}
                            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
