import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axiosConfig';
import { generateChallanPDF } from '../utils/pdfGenerator';

const ViolationList = ({ role: propRole, type = 'my', onActionSuccess }) => {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);
    const [fineDetails, setFineDetails] = useState({ fineAmount: '', vehicleNo: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = propRole || user.role || 'USER';

    const fetchViolations = useCallback(async () => {
        try {
            let endpoint = '/violations/my';
            if (type === 'pending') endpoint = '/violations/pending';
            else if (role !== 'USER') endpoint = '/violations/issued'; 
            
            const res = await API.get(endpoint);
            setViolations(res.data);
        } catch (err) {
            console.error('Fetch violations failed', err);
        } finally {
            setLoading(false);
        }
    }, [role, type]);

    useEffect(() => { fetchViolations(); }, [fetchViolations]);

    const handleVerify = async (id, action) => {
        try {
            await API.put(`/violations/verify/${id}`, { ...fineDetails, action });
            setVerifyingId(null);
            setFineDetails({ fineAmount: '', vehicleNo: '' });
            fetchViolations();
            if (onActionSuccess) onActionSuccess();
        } catch (err) {
            alert('Verification failed. Please check the details.');
        }
    };

    if (loading) return <div className="loading" style={{ padding: '4rem', width: '100%' }}>Loading records...</div>;

    const isPolice = role !== 'USER';

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                    {type === 'pending' ? 'Verification Queue' : (isPolice ? 'Official Records' : 'My Submission History')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                    {type === 'pending' ? 'Review civilian submissions and authorize traffic challans.' : (isPolice ? 'Database of verified violations and issued fines.' : 'Comprehensive list of all violations you have reported to the authorities.')}
                </p>
            </div>

            {violations.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.15 }}>📂</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No records match your current view.</p>
                </div>
            ) : (
                <div className="violation-grid">
                    {violations.map(v => (
                        <div key={v.id} className="card violation-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="image-container" style={{ height: '220px', position: 'relative' }}>
                                <img src={`${API.defaults.baseURL}/violations/image/${v.id}`} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className={`badge badge-${v.status.toLowerCase()}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>{v.status}</span>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>{v.description}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Vehicle Plate</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v.vehicleNo || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ticket Date</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{new Date(v.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {v.fineAmount && (
                                    <div style={{ padding: '1rem', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Challan Amount</span>
                                        <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.125rem' }}>₹{v.fineAmount}</span>
                                    </div>
                                )}

                                {(v.status === 'VERIFIED' || v.status === 'PAID') && (
                                    <button 
                                        onClick={() => generateChallanPDF(v)}
                                        className="btn btn-secondary" 
                                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}>
                                        <span style={{ marginRight: '0.5rem' }}>📄</span> Download PDF Challan
                                    </button>
                                )}

                                {isPolice && v.status === 'PENDING' && (
                                    verifyingId === v.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem' }}>Confirmed Vehicle No.</label>
                                                <input type="text" placeholder="MH-01-XX-0000"
                                                    value={fineDetails.vehicleNo}
                                                    onChange={(e) => setFineDetails({ ...fineDetails, vehicleNo: e.target.value.toUpperCase() })} />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem' }}>Fine Amount (INR)</label>
                                                <input type="number" placeholder="500"
                                                    value={fineDetails.fineAmount}
                                                    onChange={(e) => setFineDetails({ ...fineDetails, fineAmount: e.target.value })} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                <button onClick={() => handleVerify(v.id, 'APPROVE')} className="btn btn-primary" style={{ padding: '0.6rem', fontSize: '0.8125rem' }}
                                                    disabled={!fineDetails.fineAmount || !fineDetails.vehicleNo}>
                                                    Approve
                                                </button>
                                                <button onClick={() => handleVerify(v.id, 'REJECT')} className="btn btn-secondary"
                                                    style={{ padding: '0.6rem', fontSize: '0.8125rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                                    Reject
                                                </button>
                                            </div>
                                            <button onClick={() => setVerifyingId(null)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem' }}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setVerifyingId(v.id); setFineDetails({ fineAmount: '', vehicleNo: v.vehicleNo || '' }); }}
                                            className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                                            Process Submission
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViolationList;
