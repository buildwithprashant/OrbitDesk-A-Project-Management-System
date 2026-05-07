import { Outlet } from 'react-router-dom';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <Sidebar />
      <main className="min-h-screen px-4 pb-28 pt-4 lg:ml-72 lg:px-8 lg:pb-10">
        <Topbar />
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
