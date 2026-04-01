import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

const ReportViolation = ({ onReportSuccess }) => {
    const [description, setDescription] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [recommendedFine, setRecommendedFine] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => setLocation(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`),
                    () => setLocation('Location unavailable')
                );
            }
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', image);
        try {
            const res = await API.post('/violations/analyze', formData);
            setDescription(res.data.description);
            setRecommendedFine(res.data.recommendedFine);
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('description', description);
        formData.append('vehicleNo', vehicleNo);
        formData.append('image', image);
        formData.append('location', location);
        try {
            await API.post('/violations/report', formData);
            if (onReportSuccess) onReportSuccess();
            navigate('/my-violations');
        } catch (err) {
            console.error('Report submission error:', err.response?.status, err.response?.data);
            alert('Could not submit the report. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: 760, animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Report a Violation</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                    Provide evidence of traffic rule violations to help maintain safety on our roads.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="card">
                    {/* Photo Upload - Prominent Area */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Evidence Photo (Required)</label>
                        <div
                            onClick={() => document.getElementById('report-img').click()}
                            style={{
                                height: 300, 
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-lg)', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center', 
                                cursor: 'pointer', 
                                overflow: 'hidden',
                                background: 'var(--bg-main)', 
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.02)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.background = 'var(--bg-main)';
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📸</div>
                                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload evidence</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Support for JPG, PNG and WEBP</p>
                                </div>
                            )}
                            <input id="report-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Vehicle Plate No.</label>
                            <input 
                                type="text" 
                                placeholder="MH-01-AB-1234" 
                                value={vehicleNo}
                                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} 
                                required
                                style={{ letterSpacing: '0.05em', fontWeight: 700, fontSize: '1rem' }} 
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Occurrence Location</label>
                            <input 
                                type="text" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Awaiting GPS location..." 
                            />
                        </div>
                    </div>

                    {/* AI Assistant Button */}
                    {image && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleAnalyze} 
                            disabled={analyzing}
                            style={{ width: 'fit-content', marginTop: '1.5rem', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                        >
                            {analyzing ? (
                                <><span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span> Scanning evidence...</>
                            ) : (
                                '✦ Run AI Analysis for details'
                            )}
                        </button>
                    )}

                    {/* AI Results Panel */}
                    {recommendedFine !== null && (
                        <div className="card glass" style={{ 
                            marginTop: '1.5rem', 
                            padding: '1.25rem', 
                            background: 'var(--accent-soft)', 
                            borderColor: 'rgba(59, 130, 246, 0.2)',
                            position: 'relative'
                        }}>
                            <div style={{ 
                                position: 'absolute', top: '-10px', left: '20px', 
                                background: 'var(--accent)', color: 'white', fontSize: '0.625rem', 
                                fontWeight: 800, padding: '2px 8px', borderRadius: '4px' 
                            }}>
                                AI ENGINE RESULT
                            </div>
                            <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{description}</p>
                            <div style={{ fontSize: '0.875rem' }}>
                                Predicted Fine: <strong style={{ color: 'var(--accent)', fontSize: '1.125rem' }}>₹{recommendedFine}</strong>
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                        <label>Violation Summary</label>
                        <textarea 
                            placeholder="Please describe exactly what happened..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={4} 
                            required 
                            style={{ resize: 'none', lineHeight: 1.6 }} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '1rem' }}
                            disabled={uploading}
                        >
                            {uploading ? 'Transmitting Data...' : 'Submit Official Report'}
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

export default ReportViolation;
