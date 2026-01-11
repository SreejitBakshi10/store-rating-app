import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');

    return (
        <div className="container">
            <h2 className="mb-4">Admin Dashboard</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Overview</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Manage Users</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>Manage Stores</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'add_user' ? 'active' : ''}`} onClick={() => setActiveTab('add_user')}>Add User</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'add_store' ? 'active' : ''}`} onClick={() => setActiveTab('add_store')}>Add Store</button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'stats' && <StatsView />}
                {activeTab === 'users' && <UsersView />}
                {activeTab === 'stores' && <StoresView />}
                {activeTab === 'add_user' && <AddUserForm onSuccess={() => setActiveTab('users')} />}
                {activeTab === 'add_store' && <AddStoreForm onSuccess={() => setActiveTab('stores')} />}
            </div>
        </div>
    );
};

const StatsView = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

    useEffect(() => {
        api.get('/stores/admin-stats').then(res => setStats(res.data)).catch(console.error);
    }, []);

    return (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="card text-center h-100 border-primary">
                    <div className="card-body">
                        <h5 className="card-title text-primary"><i className="fas fa-users fa-2x mb-2"></i><br />Total Users</h5>
                        <p className="display-4">{stats.totalUsers}</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-center h-100 border-success">
                    <div className="card-body">
                        <h5 className="card-title text-success"><i className="fas fa-store fa-2x mb-2"></i><br />Total Stores</h5>
                        <p className="display-4">{stats.totalStores}</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-center h-100 border-warning">
                    <div className="card-body">
                        <h5 className="card-title text-warning"><i className="fas fa-star fa-2x mb-2"></i><br />Total Ratings</h5>
                        <p className="display-4">{stats.totalRatings}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', role: '' });
    const [sort, setSort] = useState('createdAt:desc');

    const fetchUsers = async () => {
        const params = new URLSearchParams({ ...filters, sort });
        try {
            const res = await api.get(`/users?${params}`);
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, [sort]);

    const handleSort = (field) => {
        const direction = sort.startsWith(field) && sort.endsWith('asc') ? 'desc' : 'asc';
        setSort(`${field}:${direction}`);
    };

    const getSortIcon = (field) => {
        if (!sort.startsWith(field)) return <i className="fas fa-sort text-muted ms-1"></i>;
        return sort.endsWith('asc') ? <i className="fas fa-sort-up ms-1"></i> : <i className="fas fa-sort-down ms-1"></i>;
    };

    return (
        <div>
            {/* Filter Bar */}
            <div className="row mb-3 g-2">
                <div className="col-md-3">
                    <input className="form-control" placeholder="Filter Name" onChange={e => setFilters({ ...filters, name: e.target.value })} />
                </div>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Filter Email" onChange={e => setFilters({ ...filters, email: e.target.value })} />
                </div>
                <div className="col-md-3">
                    <select className="form-select" onChange={e => setFilters({ ...filters, role: e.target.value })}>
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="store_owner">Store Owner</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary w-100" onClick={fetchUsers}><i className="fas fa-filter"></i> Apply Filters</button>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {getSortIcon('name')}</th>
                            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {getSortIcon('email')}</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Owner Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td><span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'store_owner' ? 'warning' : 'info'}`}>{u.role}</span></td>
                                <td>{u.role === 'store_owner' ? <strong>{u.ownerRating}</strong> : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StoresView = () => {
    const [stores, setStores] = useState([]);
    const [sort, setSort] = useState('createdAt:desc');

    useEffect(() => {
        api.get(`/stores?sort=${sort}`).then(res => setStores(res.data)).catch(console.error);
    }, [sort]);

    const handleSort = (field) => {
        const direction = sort.startsWith(field) && sort.endsWith('asc') ? 'desc' : 'asc';
        setSort(`${field}:${direction}`);
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</th>
                        <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email</th>
                        <th>Address</th>
                        <th onClick={() => handleSort('averageRating')} style={{ cursor: 'pointer' }}>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.address}</td>
                            <td><i className="fas fa-star text-warning"></i> {s.averageRating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AddUserForm = ({ onSuccess }) => {
    const formik = useFormik({
        initialValues: { name: '', email: '', password: '', address: '', role: 'user' },
        validationSchema: Yup.object({
            name: Yup.string().min(20).max(60).required("Required"),
            email: Yup.string().email().required("Required"),
            password: Yup.string().min(8).matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/).required("Required"),
            address: Yup.string().max(400).required("Required")
        }),
        onSubmit: async (values) => {
            try { await api.post('/users', values); alert("User Added"); onSuccess(); }
            catch (err) { alert(err.response?.data?.message); }
        }
    });

    return (
        <div className="card mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-primary text-white">Add New User</div>
            <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label>Name</label>
                        <input className="form-control" name="name" onChange={formik.handleChange} value={formik.values.name} />
                        {formik.errors.name && <small className="text-danger">{formik.errors.name}</small>}
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
                        <input className="form-control" name="email" onChange={formik.handleChange} value={formik.values.email} />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input className="form-control" type="password" name="password" onChange={formik.handleChange} value={formik.values.password} />
                        <small className="text-muted">8-16 chars, 1 Upper, 1 Special</small>
                    </div>
                    <div className="mb-3">
                        <label>Address</label>
                        <input className="form-control" name="address" onChange={formik.handleChange} value={formik.values.address} />
                    </div>
                    <div className="mb-3">
                        <label>Role</label>
                        <select className="form-select" name="role" onChange={formik.handleChange} value={formik.values.role}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Create User</button>
                </form>
            </div>
        </div>
    );
};

const AddStoreForm = ({ onSuccess }) => {
    const formik = useFormik({
        initialValues: { name: '', email: '', address: '' },
        validationSchema: Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            address: Yup.string().max(400).required()
        }),
        onSubmit: async (values) => {
            try { await api.post('/stores', values); alert("Store Added"); onSuccess(); }
            catch (err) { alert(err.response?.data?.message); }
        }
    });

    return (
        <div className="card mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-success text-white">Add New Store</div>
            <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3"><label>Store Name</label><input className="form-control" name="name" onChange={formik.handleChange} value={formik.values.name} /></div>
                    <div className="mb-3"><label>Email</label><input className="form-control" name="email" onChange={formik.handleChange} value={formik.values.email} /></div>
                    <div className="mb-3"><label>Address</label><textarea className="form-control" name="address" onChange={formik.handleChange} value={formik.values.address} /></div>
                    <button type="submit" className="btn btn-success w-100">Create Store</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;