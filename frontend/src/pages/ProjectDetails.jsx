import { Plus, Trash2, UserMinus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import UserMultiSelect from '../components/UserMultiSelect';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { formatDate, taskStatuses } from '../utils/formatters';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, canManageWork } = useAuth();
  const { data, setData, loading, refetch } = useFetch(`/projects/${id}`);
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [membersToAdd, setMembersToAdd] = useState([]);
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  const availableUsers = useMemo(() => {
    const memberIds = new Set(data?.project?.members?.map((member) => member._id) || []);
    return users.filter((user) => !memberIds.has(user._id));
  }, [users, data]);

  const availableUserIds = useMemo(() => availableUsers.map((user) => user._id), [availableUsers]);

  const updateTaskInState = (updatedTask) => {
    setData((current) =>
      current
        ? {
            ...current,
            tasks: current.tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
          }
        : current
    );
  };

  const changeStatus = async (taskId, status) => {
    const previous = data;
    setData((current) =>
      current
        ? {
            ...current,
            tasks: current.tasks.map((task) => (task._id === taskId ? { ...task, status } : task))
          }
        : current
    );

    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      updateTaskInState(response.data);
      toast.success('Task updated');
    } catch (error) {
      setData(previous);
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
      setAddMembersOpen(false);
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
            <button className="btn-primary" onClick={() => setAddMembersOpen(true)} disabled={availableUsers.length === 0}>
              <Plus size={18} /> Add members
            </button>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="hidden px-4 py-3 md:table-cell">Email</th>
                <th className="px-4 py-3">Role</th>
                {canManageWork && <th className="px-4 py-3 text-right">Remove</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {project.members.map((member) => (
                <tr key={member._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full text-xs font-black text-white" style={{ background: member.avatarColor }}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-ink">{member.name}</p>
                        <p className="text-xs text-slate-400 md:hidden">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize text-slate-600">{member.role}</span>
                  </td>
                  {canManageWork && (
                    <td className="px-4 py-3 text-right">
                      {member._id !== project.owner?._id && (
                        <button className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" onClick={() => removeMember(member._id)} aria-label="Remove member">
                          <UserMinus size={18} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {tasks.length === 0 ? (
        <EmptyState title="No tasks in this project" message="Create tasks from the Tasks page and attach them to this project." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {taskStatuses.map((status) => (
            <section key={status} className="rounded-2xl border border-slate-200 bg-white/60 p-4">
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">{status}</h2>
              <div className="grid gap-3">
                {tasks.filter((task) => task.status === status).map((task) => (
                  <TaskCard key={task._id} task={task} onStatusChange={changeStatus} onOpen={setSelectedTask} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      {addMembersOpen && (
        <Modal title="Add project members" onClose={() => setAddMembersOpen(false)}>
          <form className="grid gap-4" onSubmit={addMember}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500">{membersToAdd.length} selected</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                <button className="text-pine" type="button" onClick={() => setMembersToAdd(availableUserIds)}>
                  All
                </button>
                <button className="text-slate-400" type="button" onClick={() => setMembersToAdd([])}>
                  Clear
                </button>
              </div>
            </div>
            <UserMultiSelect
              users={availableUsers}
              value={membersToAdd}
              onChange={setMembersToAdd}
              label="Project members"
              placeholder="Search and select users"
            />
            <button className="btn-primary" disabled={membersToAdd.length === 0}>
              <Plus size={18} /> Add selected members
            </button>
          </form>
        </Modal>
      )}
      {selectedTask && <TaskDetailModal taskId={selectedTask._id} onClose={() => setSelectedTask(null)} onStatusUpdated={updateTaskInState} />}
    </PageTransition>
  );
}
