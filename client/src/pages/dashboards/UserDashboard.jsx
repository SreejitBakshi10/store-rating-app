import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StoreCard from '../../components/StoreCard';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [sort, setSort] = useState('averageRating:desc');

    const fetchStores = async () => {
        const params = new URLSearchParams({ ...filters, sort });
        try {
            const res = await api.get(`/stores?${params}`);
            setStores(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchStores(); }, [filters, sort]);

    return (
        <div className="container">
            <h2 className="mb-4">Stores</h2>

            <div className="row mb-4">
                <div className="col-md-4">
                    <input className="form-control" placeholder="Search Name..." onChange={e => setFilters({ ...filters, name: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <input className="form-control" placeholder="Search Address..." onChange={e => setFilters({ ...filters, address: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <select className="form-select" onChange={e => setSort(e.target.value)}>
                        <option value="averageRating:desc">Highest Rated</option>
                        <option value="averageRating:asc">Lowest Rated</option>
                        <option value="name:asc">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {stores.map(store => (
                    <div className="col-md-6" key={store.id}>
                        <StoreCard store={store} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;