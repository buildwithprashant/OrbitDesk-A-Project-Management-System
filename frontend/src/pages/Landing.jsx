import { ArrowRight, CheckCircle2, KanbanSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#f8fafc]">
        <section className="relative overflow-hidden px-6 py-6">
          <nav className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-black text-white">O</div>
              <span className="text-lg font-black text-ink">OrbitDesk</span>
            </div>
            <div className="flex items-center gap-3">
              <Link className="font-bold text-slate-600" to="/login">Login</Link>
              <Link className="btn-primary" to="/signup">Start free <ArrowRight size={17} /></Link>
            </div>
          </nav>
          <div className="mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pine/20 bg-pine/10 px-4 py-2 text-sm font-bold text-pine">
                <Sparkles size={16} /> Built for focused delivery teams
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-tight text-ink md:text-7xl">OrbitDesk</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                A premium team task manager where projects, assignments, status changes, comments, and analytics stay in one fast workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn-primary" to="/signup">Create workspace <ArrowRight size={18} /></Link>
                <Link className="btn-secondary" to="/login">Open dashboard</Link>
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-4">
              <div className="rounded-[1.5rem] bg-ink p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-black">Launch Control</p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">Live sprint</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {['Todo', 'In Progress', 'Completed'].map((column, index) => (
                    <div key={column} className="rounded-2xl bg-white/10 p-3">
                      <p className="mb-3 text-sm font-bold text-white/70">{column}</p>
                      {[0, 1, 2].slice(0, index + 1).map((item) => (
                        <div key={item} className="mb-3 rounded-xl bg-white p-3 text-ink">
                          <p className="text-sm font-black">{['API hardening', 'Mobile states', 'Analytics cards'][item]}</p>
                          <div className="mt-3 h-2 rounded-full bg-slate-100">
                            <div className="h-2 rounded-full bg-coral" style={{ width: `${45 + item * 20}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl gap-4 pb-8 md:grid-cols-3">
            {[
              [KanbanSquare, 'Project boards with user, manager, and admin control'],
              [ShieldCheck, 'JWT authentication and secure API defaults'],
              [CheckCircle2, 'Task comments, activity logs, and analytics']
            ].map(([Icon, text]) => (
              <div key={text} className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-700">
                <Icon className="mb-3 text-pine" /> {text}
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
