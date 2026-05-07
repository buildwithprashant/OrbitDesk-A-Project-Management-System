import { Plus, Trash2, UserMinus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { formatDate } from '../utils/formatters';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, canManageWork } = useAuth();
  const { data, loading, refetch } = useFetch(`/projects/${id}`);
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState('');

  const availableUsers = useMemo(() => {
    const memberIds = new Set(data?.project?.members?.map((member) => member._id) || []);
    return users.filter((user) => !memberIds.has(user._id));
  }, [users, data]);

  const changeStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      toast.success('Task updated');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not update task');
    }
  };

  const deleteProject = async () => {
    if (!confirm('Delete this project and its tasks?')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Project deleted');
    navigate('/projects');
  };

  const addMember = async (event) => {
    event.preventDefault();
    if (!memberToAdd) return;

    try {
      await api.patch(`/projects/${id}/members`, { members: [memberToAdd] });
      toast.success('Member added to project');
      setMemberToAdd('');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not add member');
    }
  };

  const removeMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed from project');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not remove member');
    }
  };

  if (loading) return <PageTransition><Skeleton className="h-96" /></PageTransition>;
  const { project, tasks } = data;

  return (
    <PageTransition>
      <div className="mb-6 rounded-2xl bg-ink p-6 text-white shadow-premium">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-white/15 text-white">{project.status}</Badge>
            <h1 className="mt-4 text-4xl font-black">{project.name}</h1>
            <p className="mt-3 max-w-3xl text-white/70">{project.description || 'No description provided.'}</p>
          </div>
          {isAdmin && <button className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20" onClick={deleteProject} aria-label="Delete project"><Trash2 size={20} /></button>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/80">
          <span>Deadline: {formatDate(project.deadline)}</span>
          <span>{project.members.length} members</span>
        </div>
      </div>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-ink">Project members</h2>
            <p className="text-sm text-slate-500">People in this project can be assigned work and track project tasks.</p>
          </div>
          {canManageWork && (
            <form className="flex w-full gap-2 sm:w-auto" onSubmit={addMember}>
              <select className="input min-w-56" value={memberToAdd} onChange={(event) => setMemberToAdd(event.target.value)}>
                <option value="">Select user</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} - {user.role}</option>
                ))}
              </select>
              <button className="btn-primary" disabled={!memberToAdd} aria-label="Add member">
                <Plus size={18} />
              </button>
            </form>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {project.members.map((member) => (
            <div key={member._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white" style={{ background: member.avatarColor }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-ink">{member.name}</p>
                  <p className="text-xs font-bold capitalize text-slate-500">{member.role}</p>
                </div>
              </div>
              {canManageWork && member._id !== project.owner?._id && (
                <button className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-rose-600" onClick={() => removeMember(member._id)} aria-label="Remove member">
                  <UserMinus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      {tasks.length === 0 ? (
        <EmptyState title="No tasks in this project" message="Create tasks from the Tasks page and attach them to this project." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {['todo', 'in-progress', 'completed'].map((status) => (
            <section key={status} className="rounded-2xl border border-slate-200 bg-white/60 p-4">
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">{status.replace('-', ' ')}</h2>
              <div className="grid gap-3">
                {tasks.filter((task) => task.status === status).map((task) => (
                  <TaskCard key={task._id} task={task} onStatusChange={changeStatus} onOpen={setSelectedTask} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      {selectedTask && <TaskDetailModal taskId={selectedTask._id} onClose={() => setSelectedTask(null)} />}
    </PageTransition>
  );
}
