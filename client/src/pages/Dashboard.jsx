import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import UserDashboard from './dashboards/UserDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div style={{ padding: '2rem' }}>Please log in to view the dashboard.</div>;
    }

    if (user.role === 'admin') return <AdminDashboard />;
    if (user.role === 'store_owner') return <OwnerDashboard />;
    
    return <UserDashboard />;
};

export default Dashboard;