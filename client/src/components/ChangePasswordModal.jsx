import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePasswordModal = ({ show, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/password', { currentPassword, newPassword });

            onClose();
            alert("Password updated! Please log in again.");
            logout();
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Change Password</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form id="pwdForm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Current Password</label>
                                <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                <small className="text-muted">8-16 chars, 1 Upper, 1 Special</small>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" form="pwdForm" className="btn btn-success">Update & Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;