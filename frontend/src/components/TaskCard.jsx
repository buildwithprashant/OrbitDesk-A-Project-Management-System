import { CalendarDays, MessageSquare } from 'lucide-react';
import Badge from './ui/Badge';
import { formatDate, isOverdue, priorityClass, statusClass, statusLabel } from '../utils/formatters';

export default function TaskCard({ task, onStatusChange, onOpen, compact = false }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium">
      <div className="mb-3 flex items-start justify-between gap-3">
        <button className="text-left" onClick={() => onOpen?.(task)} type="button">
          <h3 className="font-extrabold text-ink">{task.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description || 'No description added.'}</p>
        </button>
        <Badge className={priorityClass[task.priority]}>{task.priority}</Badge>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge className={statusClass[task.status]}>{statusLabel[task.status]}</Badge>
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${isOverdue(task.dueDate, task.status) ? 'text-rose-600' : 'text-slate-500'}`}>
          <CalendarDays size={14} /> {formatDate(task.dueDate)}
        </span>
        {task.activity?.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
            <MessageSquare size={14} /> {task.activity.length}
          </span>
        )}
      </div>
      {(!compact || onStatusChange || onOpen) && (
        <div className="flex items-center justify-between">
          {!compact && (
            <div className="flex -space-x-2">
              {task.assignees?.slice(0, 3).map((user) => (
                <div key={user._id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-xs font-black text-white" style={{ background: user.avatarColor }}>
                  {user.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {onStatusChange && (
              <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600" value={task.status} onChange={(event) => onStatusChange(task._id, event.target.value)}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
            {onOpen && <button className="text-xs font-black text-pine" onClick={() => onOpen(task)} type="button">Details</button>}
          </div>
        </div>
      )}
    </article>
  );
}
