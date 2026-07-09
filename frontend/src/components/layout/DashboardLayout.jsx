import { useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice.js';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}