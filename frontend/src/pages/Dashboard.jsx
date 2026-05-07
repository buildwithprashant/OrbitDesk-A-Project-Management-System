import { CheckCircle2, Clock3, FolderKanban, ListTodo, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api/client';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import StatCard from '../components/ui/StatCard';
import TaskCard from '../components/TaskCard';
import useFetch from '../hooks/useFetch';
import { statusLabel } from '../utils/formatters';

const chartColors = { Pending: '#64748b', 'In Progress': '#2563eb', Completed: '#0f766e' };

export default function Dashboard() {
  const { data, setData, loading, error, refetch } = useFetch('/projects/analytics/summary');
  const chartData = data?.statusGroups?.map((item) => ({ name: statusLabel[item._id], value: item.count, color: chartColors[item._id] })) || [];

  const changeStatus = async (taskId, status) => {
    const previous = data;
    setData((current) =>
      current
        ? {
            ...current,
            recent: current.recent?.map((task) => (task._id === taskId ? { ...task, status } : task))
          }
        : current
    );

    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      setData((current) =>
        current
          ? {
              ...current,
              recent: current.recent?.map((task) => (task._id === taskId ? response.data : task))
            }
          : current
      );
      toast.success('Status updated');
      refetch();
    } catch (err) {
      setData(previous);
      toast.error(err.message || 'Could not update status');
    }
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-pine">Dashboard</p>
        <h1 className="text-3xl font-black text-ink">Delivery overview</h1>
      </div>
      {error && <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard icon={FolderKanban} label="Total projects" value={data.totalProjects} />
            <StatCard icon={ListTodo} label="Total tasks" value={data.totalTasks} accent="bg-blue-50 text-blue-700" />
            <StatCard icon={Clock3} label="Pending" value={data.pendingTasks} accent="bg-slate-100 text-slate-700" />
            <StatCard icon={PlayCircle} label="In Progress" value={data.inProgressTasks} accent="bg-indigo-50 text-indigo-700" />
            <StatCard icon={CheckCircle2} label="Completed" value={data.completedTasks} accent="bg-emerald-50 text-emerald-700" />
          </div>
          {data.projects?.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-4 text-lg font-black text-ink">Project members</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.projects.map((project) => (
                  <Link key={project._id} to={`/projects/${project._id}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium">
                    <div className="mb-3 h-2 w-16 rounded-full" style={{ background: project.color }} />
                    <h3 className="font-black text-ink">{project.name}</h3>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex -space-x-2">
                        {project.members?.slice(0, 4).map((member) => (
                          <div key={member._id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-xs font-black text-white" style={{ background: member.avatarColor }}>
                            {member.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-500">{project.members?.length || 0} members</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="glass-panel rounded-2xl p-5">
              <h2 className="mb-4 text-lg font-black text-ink">Progress mix</h2>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={4}>
                      {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
            <section className="glass-panel rounded-2xl p-5">
              <h2 className="mb-4 text-lg font-black text-ink">Recent activity</h2>
              <div className="grid gap-3">
                {data.recent?.map((task) => <TaskCard key={task._id} task={task} compact onStatusChange={changeStatus} />)}
              </div>
            </section>
          </div>
        </>
      )}
    </PageTransition>
  );
}
