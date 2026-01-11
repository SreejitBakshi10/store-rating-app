import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import BootstrapModal from './BootstrapModal';
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPwdModal, setShowPwdModal] = useState(false);

    const handleLogoutConfirm = () => {
        logout();
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <i className="fas fa-store me-2"></i>Store Rating App
                    </Link>
                    <div className="d-flex">
                        {user ? (
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i className="fas fa-user-circle me-1"></i> {user.name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><span className="dropdown-item-text text-muted">{user.role}</span></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => setShowPwdModal(true)}>
                                            Change Password
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={() => setShowLogoutModal(true)}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Signup</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Modal */}
            <BootstrapModal 
                show={showLogoutModal} 
                title="Confirm Logout" 
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                confirmText="Logout"
                confirmColor="danger"
            >
                Are you sure you want to log out?
            </BootstrapModal>

            {/* Change Password Modal */}
            <ChangePasswordModal show={showPwdModal} onClose={() => setShowPwdModal(false)} />
        </>
    );
};

export default Navbar;