import { FolderKanban, LayoutDashboard, ListTodo, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/profile', label: 'Profile', icon: UserCircle }
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-white/70 bg-white/90 p-2 shadow-premium backdrop-blur lg:hidden">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `grid place-items-center rounded-xl px-2 py-2 text-[11px] font-black ${isActive ? 'bg-ink text-white' : 'text-slate-500'}`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
