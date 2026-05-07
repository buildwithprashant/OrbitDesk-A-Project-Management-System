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
  const [membersToAdd, setMembersToAdd] = useState([]);

  const availableUsers = useMemo(() => {
    const memberIds = new Set(data?.project?.members?.map((member) => member._id) || []);
    return users.filter((user) => !memberIds.has(user._id));
  }, [users, data]);

  const availableUserIds = useMemo(() => availableUsers.map((user) => user._id), [availableUsers]);

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
    if (membersToAdd.length === 0) return;

    try {
      await api.patch(`/projects/${id}/members`, { members: membersToAdd });
      toast.success(membersToAdd.length === 1 ? 'Member added to project' : 'Members added to project');
      setMembersToAdd([]);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not add members');
    }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member from the project and unassign their project tasks?')) return;

    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed from project');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not remove member');
    }
  };

  const toggleMemberToAdd = (userId) => {
    setMembersToAdd((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    );
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
            <form className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 sm:w-96" onSubmit={addMember}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Add access</span>
                {availableUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <button className="text-pine" type="button" onClick={() => setMembersToAdd(availableUserIds)}>
                      All
                    </button>
                    <button className="text-slate-400" type="button" onClick={() => setMembersToAdd([])}>
                      Clear
                    </button>
                  </div>
                )}
              </div>
              {availableUsers.length === 0 ? (
                <p className="rounded-lg bg-white p-3 text-sm font-semibold text-slate-500">Every active user already has access.</p>
              ) : (
                <>
                  <div className="grid max-h-36 gap-2 overflow-auto">
                    {availableUsers.map((user) => (
                      <label key={user._id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600">
                        <input
                          type="checkbox"
                          checked={membersToAdd.includes(user._id)}
                          onChange={() => toggleMemberToAdd(user._id)}
                        />
                        <span className="min-w-0 flex-1 truncate">{user.name}</span>
                        <span className="text-xs capitalize text-slate-400">{user.role}</span>
                      </label>
                    ))}
                  </div>
                  <button className="btn-primary mt-3 w-full" disabled={membersToAdd.length === 0} aria-label="Add members">
                    <Plus size={18} /> Add selected
                  </button>
                </>
              )}
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
      {selectedTask && <TaskDetailModal taskId={selectedTask._id} onClose={() => setSelectedTask(null)} onStatusUpdated={refetch} />}
    </PageTransition>
  );
}
