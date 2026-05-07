import { FolderKanban, LayoutDashboard, ListTodo, LogOut, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/profile', label: 'Profile', icon: UserCircle }
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/70 bg-white/80 p-5 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-black text-white">O</div>
        <div>
          <p className="text-lg font-black text-ink">OrbitDesk</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Team command</p>
        </div>
      </div>
      <nav className="space-y-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                isActive ? 'bg-ink text-white shadow-lg shadow-ink/15' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="absolute bottom-5 left-5 right-5 btn-secondary" onClick={logout}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
