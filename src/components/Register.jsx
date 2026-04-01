import React, { useState } from 'react';
import API from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/auth/register', { ...user, role: 'USER' });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                padding: '2rem', flexWrap: 'wrap', alignItems: 'center', zIndex: 1, gap: '4rem'
            }}>
                
                {/* Left Side: Brand & Context */}
                <div style={{ flex: '1 1 400px' }}>
                    <div className="sidebar-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                        <div className="logo-dot" style={{ width: 14, height: 14 }} />
                        Trivo
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff' }}>
                        Join the <br />
                        <span style={{ color: 'var(--accent)' }}>Movement.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
                        Create your civilian account today and help make our roads safer by reporting violations and staying informed about traffic rules.
                    </p>
                </div>

                {/* Right Side: Register Card */}
                <div style={{ flex: '1 1 400px', maxWidth: '460px' }}>
                    <div className="card glass" style={{ padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Get Started</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                            Join thousands of citizens making a difference.
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
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={user.email}
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
                                    value={user.password}
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
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
