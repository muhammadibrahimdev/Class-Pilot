import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
import { navByRole } from '../../config/navigation';
import Logo from '../ui/Logo';
import Button from '../ui/Button';

export default function Sidebar({ onLogout }) {
  const { user } = useSelector((s) => s.auth);
  const items = navByRole[user?.role] || [];

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-navy flex-col h-screen sticky top-0">
      
      <div className="px-6 py-6 border-b border-white/10">
        <Logo light />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative
              ${isActive
                ? 'bg-white/10 text-white font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary-light" />
                )}
                <Icon size={18} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        <Button onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>

    </aside>
  );
}