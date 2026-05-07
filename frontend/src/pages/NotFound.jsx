import { Link } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center bg-mist p-6 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-pine">404</p>
          <h1 className="mt-2 text-5xl font-black text-ink">Page not found</h1>
          <p className="mt-3 text-slate-500">The page you requested is not part of this workspace.</p>
          <Link className="btn-primary mt-8" to="/dashboard">Back to dashboard</Link>
        </div>
      </main>
    </PageTransition>
  );
}
