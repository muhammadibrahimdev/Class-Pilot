import { Search, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { roleLabel } from '../../config/navigation';

export default function Topbar() {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search students, classes..."
          className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg
            text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        
        {/* Notification bell */}
        <button className="relative text-muted hover:text-ink transition">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-ink leading-tight">{user?.name}</p>
            <p className="text-xs text-muted uppercase tracking-wide">
              {roleLabel[user?.role]}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
}