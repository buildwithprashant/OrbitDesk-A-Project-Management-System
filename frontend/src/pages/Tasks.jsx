import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { statusLabel, taskStatuses } from '../utils/formatters';

export default function Tasks() {
  const { canManageWork } = useAuth();
  const { data: tasks = [], setData: setTasks, loading, refetch } = useFetch('/tasks', { initialData: [] });
  const { data: projects = [] } = useFetch('/projects', { initialData: [] });
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((task) => task.status === filter)),
    [tasks, filter]
  );

  const updateTaskInState = (updatedTask) => {
    setTasks((current) => current.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  const createTask = async (values) => {
    setSaving(true);
    try {
      await api.post('/tasks', values);
      toast.success('Task created');
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not create task');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (taskId, status) => {
    const previous = tasks;
    setTasks((current) => current.map((task) => (task._id === taskId ? { ...task, status } : task)));

    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      updateTaskInState(response.data);
      toast.success('Status updated');
    } catch (error) {
      setTasks(previous);
      toast.error(error.message || 'Could not update status');
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-pine">Tasks</p>
          <h1 className="text-3xl font-black text-ink">Execution board</h1>
        </div>
        {canManageWork && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} /> New task</button>}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...taskStatuses].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${filter === item ? 'bg-ink text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            {item === 'all' ? 'All' : statusLabel[item]}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Skeleton /><Skeleton /><Skeleton /></div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState title="No matching tasks" message="Adjust filters or create a task to start tracking delivery." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => <TaskCard key={task._id} task={task} onStatusChange={changeStatus} onOpen={setSelectedTask} />)}
        </div>
      )}
      {open && (
        <Modal title="Create task" onClose={() => setOpen(false)}>
          <TaskForm projects={projects} users={users} onSubmit={createTask} saving={saving} />
        </Modal>
      )}
      {selectedTask && <TaskDetailModal taskId={selectedTask._id} onClose={() => setSelectedTask(null)} onStatusUpdated={updateTaskInState} />}
    </PageTransition>
  );
}
