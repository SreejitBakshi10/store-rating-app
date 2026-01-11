import { useEffect, useState } from 'react';
import api from '../../api/axios';

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/stores/my-dashboard')
            .then(res => setDashboardData(res.data))
            .catch(err => setError(err.response?.data?.message));
    }, []);

    if (error) return <div className="alert alert-danger m-5">{error}</div>;
    if (!dashboardData) return <div className="text-center m-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container">
            <div className="card mb-4 border-warning">
                <div className="card-body text-center">
                    <h2 className="card-title">{dashboardData.storeName}</h2>
                    <h1 className="display-1 text-warning fw-bold">{dashboardData.averageRating}</h1>
                    <p className="text-muted">Average Rating</p>
                </div>
            </div>

            <h3 className="mb-3">Customer Ratings</h3>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.ratings.map(r => (
                            <tr key={r.id}>
                                <td>{r.User?.name || 'Unknown'}</td>
                                <td>{r.User?.email || '-'}</td>
                                <td><i className="fas fa-star text-warning"></i> {r.score}</td>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerDashboard;