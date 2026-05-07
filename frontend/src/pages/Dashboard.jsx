import { AlertTriangle, CheckCircle2, FolderKanban, ListTodo } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import StatCard from '../components/ui/StatCard';
import TaskCard from '../components/TaskCard';
import useFetch from '../hooks/useFetch';
import { statusLabel } from '../utils/formatters';

const chartColors = { todo: '#64748b', 'in-progress': '#2563eb', completed: '#0f766e' };

export default function Dashboard() {
  const { data, loading, error } = useFetch('/projects/analytics/summary');
  const chartData = data?.statusGroups?.map((item) => ({ name: statusLabel[item._id], value: item.count, color: chartColors[item._id] })) || [];

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-pine">Dashboard</p>
        <h1 className="text-3xl font-black text-ink">Delivery overview</h1>
      </div>
      {error && <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FolderKanban} label="Total projects" value={data.totalProjects} />
            <StatCard icon={ListTodo} label="Total tasks" value={data.totalTasks} accent="bg-blue-50 text-blue-700" />
            <StatCard icon={CheckCircle2} label="Completed" value={data.completedTasks} accent="bg-emerald-50 text-emerald-700" />
            <StatCard icon={AlertTriangle} label="Overdue" value={data.overdueTasks} accent="bg-rose-50 text-rose-700" />
          </div>
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
                {data.recent?.map((task) => <TaskCard key={task._id} task={task} compact />)}
              </div>
            </section>
          </div>
        </>
      )}
    </PageTransition>
  );
}
