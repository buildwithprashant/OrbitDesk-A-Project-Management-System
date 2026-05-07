import { Menu, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <Menu className="lg:hidden" size={20} />
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-500 md:flex">
          <Search size={17} />
          <span className="text-sm font-medium">Search projects, tasks, people</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NavLink to="/projects" className="hidden text-sm font-bold text-slate-600 hover:text-ink sm:block">
          Workspace
        </NavLink>
        <div className="grid h-10 w-10 place-items-center rounded-full font-black text-white" style={{ background: user?.avatarColor || '#0f766e' }}>
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
}
