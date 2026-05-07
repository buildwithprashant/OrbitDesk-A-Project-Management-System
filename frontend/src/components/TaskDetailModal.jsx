import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { formatDate, statusLabel } from '../utils/formatters';
import Modal from './ui/Modal';
import Skeleton from './ui/Skeleton';

export default function TaskDetailModal({ taskId, onClose, onStatusUpdated }) {
  const [data, setData] = useState(null);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusSaving, setStatusSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks/${taskId}`);
      setData(response.data);
    } catch (error) {
      toast.error(error.message || 'Could not load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  const addComment = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      await api.post('/comments', { task: taskId, body });
      setBody('');
      await load();
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.message || 'Could not add comment');
    }
  };

  const changeStatus = async (event) => {
    const status = event.target.value;
    if (!data?.task || status === data.task.status) return;

    setStatusSaving(true);
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      setData((current) => (current ? { ...current, task: response.data } : current));
      onStatusUpdated?.(response.data);
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.message || 'Could not update status');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <Modal title="Task detail" onClose={onClose}>
      {loading ? (
        <Skeleton className="h-80" />
      ) : (
        <div className="grid gap-6">
          <div>
            <h2 className="text-2xl font-black text-ink">{data.task.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{data.task.description || 'No description.'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="label">Status</label>
                <select className="input" value={data.task.status} onChange={changeStatus} disabled={statusSaving}>
                  <option value="todo">{statusLabel.todo}</option>
                  <option value="in-progress">{statusLabel['in-progress']}</option>
                  <option value="completed">{statusLabel.completed}</option>
                </select>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                <span className="block uppercase tracking-wide text-slate-400">Priority</span>
                <span className="mt-1 block capitalize text-slate-700">{data.task.priority}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
                <span className="block uppercase tracking-wide text-slate-400">Due</span>
                <span className="mt-1 block text-slate-700">{formatDate(data.task.dueDate)}</span>
              </div>
            </div>
          </div>
          <section>
            <h3 className="mb-3 font-black text-ink">Comments</h3>
            <div className="max-h-56 space-y-3 overflow-auto pr-2">
              {data.comments.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">No comments yet.</p>
              ) : (
                data.comments.map((comment) => (
                  <div key={comment._id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>{comment.user.name}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.body}</p>
                  </div>
                ))
              )}
            </div>
            <form className="mt-4 flex gap-2" onSubmit={addComment}>
              <input className="input" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add a comment..." />
              <button className="btn-primary" aria-label="Send comment"><Send size={18} /></button>
            </form>
          </section>
        </div>
      )}
    </Modal>
  );
}
