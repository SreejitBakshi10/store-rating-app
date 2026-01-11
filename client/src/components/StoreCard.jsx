import { useState } from 'react';
import api from '../api/axios';
import BootstrapModal from './BootstrapModal';

const StoreCard = ({ store }) => {
    const [myRating, setMyRating] = useState(store.myRating || 0);
    const [avgRating, setAvgRating] = useState(store.averageRating || 0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleRate = async (score) => {
        try {
            const res = await api.post(`/stores/${store.id}/rate`, { score });
            setMyRating(score);
            setAvgRating(res.data.averageRating);
        } catch (err) {
            alert(err.response?.data?.message || "Rating failed");
        }
    };

    const handleClearConfirm = async () => {
        try {
            const res = await api.delete(`/stores/${store.id}/rate`);
            setMyRating(0);
            setAvgRating(res.data.averageRating);
            setShowDeleteModal(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to remove rating");
        }
    };

    return (
        <>
            <div className="card mb-3 shadow-sm h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 className="card-title text-primary">{store.name}</h5>
                            <p className="card-text text-muted mb-1 small">
                                <i className="fas fa-map-marker-alt me-1"></i> {store.address}
                            </p>
                        </div>
                        <div className="text-end">
                            {/* FIX: Clarified Labels */}
                            <span className="badge bg-light text-dark border">Avg</span>
                            <h4 className="text-warning mb-0 fw-bold">
                                {avgRating} <small className="text-muted fs-6">/ 5</small>
                            </h4>
                        </div>
                    </div>

                    <hr />

                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <small className="text-muted d-block mb-1">Your Rating:</small>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`fas fa-star fa-lg ${star <= myRating ? 'text-warning' : 'text-secondary opacity-25'}`}
                                    onClick={() => handleRate(star)}
                                    style={{ cursor: 'pointer', marginRight: '5px' }}
                                    title={`Rate ${star} stars`}
                                ></i>
                            ))}
                        </div>

                        {myRating > 0 && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <i className="fas fa-trash"></i> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <BootstrapModal
                show={showDeleteModal}
                title="Remove Rating"
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleClearConfirm}
                confirmText="Remove"
                confirmColor="danger"
            >
                Are you sure you want to remove your rating for <strong>{store.name}</strong>?
            </BootstrapModal>
        </>
    );
};

export default StoreCard;