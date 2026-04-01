import React, { useState } from 'react';
import API from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const IssueFine = () => {
    const [form, setForm] = useState({ vehicleNo: '', description: '', fineAmount: '', location: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!image) return;
        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', image);
        try {
            const res = await API.post('/violations/analyze', formData);
            const data = res.data;
            setForm(prev => ({ ...prev, description: data.description, fineAmount: data.recommendedFine }));
        } catch (err) {
            alert('AI analysis failed.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => setForm(prev => ({ ...prev, location: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}` })),
                    () => {}
                );
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) { alert('Please upload a photo.'); return; }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('vehicleNo', form.vehicleNo);
            fd.append('description', form.description);
            fd.append('fineAmount', form.fineAmount);
            fd.append('location', form.location);
            fd.append('image', image);
            await API.post('/violations/issue-fine', fd);
            setSuccess(true);
        } catch (err) {
            alert('Failed to issue fine.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', 
                justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', 
                animation: 'fadeIn 0.4s ease', textAlign: 'center', maxWidth: '400px', margin: 'auto'
            }}>
                <div style={{ 
                    width: 80, height: 80, background: 'var(--success)', 
                    color: 'white', borderRadius: '50%', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                }}>✓</div>
                <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Fine Issued Successfully</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}> Official record for <strong>{form.vehicleNo}</strong> has been created in the database.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSuccess(false); setForm({ vehicleNo: '', description: '', fineAmount: '', location: '' }); setImage(null); setPreview(null); }}>Issue Another</button>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Finish</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 760, animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Issue Official Fine</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                    Document a traffic violation and issue an official challan with documented evidence.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card">
                    {/* Core Identification */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Vehicle Registration No.</label>
                            <input 
                                type="text" 
                                name="vehicleNo" 
                                placeholder="KA-00-XX-0000" 
                                value={form.vehicleNo}
                                onChange={handleChange} 
                                required 
                                style={{ letterSpacing: '0.05em', fontWeight: 700, fontSize: '1rem' }} 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Fine Amount (₹)</label>
                            <input 
                                type="number" 
                                name="fineAmount" 
                                placeholder="1000" 
                                value={form.fineAmount}
                                onChange={handleChange} 
                                required 
                                min="1" 
                                style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent)' }}
                            />
                        </div>
                    </div>

                    {/* Evidence Section */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Evidence Capture</label>
                        <div
                            onClick={() => document.getElementById('fine-img').click()}
                            style={{
                                height: 260, 
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-lg)', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center', 
                                cursor: 'pointer', 
                                overflow: 'hidden',
                                background: 'var(--bg-main)', 
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            {preview ? (
                                <img src={preview} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.3 }}>📸</div>
                                    <p style={{ fontWeight: 600 }}>Tap to Capture/Upload Evidence</p>
                                </div>
                            )}
                            <input id="fine-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location (Auto-detected)</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={form.location}
                            onChange={handleChange} 
                            placeholder="Awaiting GPS location..." 
                        />
                    </div>

                    {image && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleAnalyze} 
                            disabled={analyzing}
                            style={{ width: 'fit-content', border: '1px solid var(--accent)', color: 'var(--accent)', marginBottom: '1.5rem' }}
                        >
                            {analyzing ? '✦ Running AI Scan...' : '✦ Run AI Violation Assistant'}
                        </button>
                    )}

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>Official Violation Summary</label>
                        <textarea 
                            name="description" 
                            rows={4} 
                            placeholder="Detailed description of the offense..." 
                            value={form.description}
                            onChange={handleChange} 
                            required 
                            style={{ resize: 'none', lineHeight: 1.6 }} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '1rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Recording Violation...' : 'Issue Official Challan'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            style={{ flex: 0.3 }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default IssueFine;
