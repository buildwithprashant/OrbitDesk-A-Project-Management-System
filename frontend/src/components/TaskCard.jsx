import { FormControl, MenuItem, Select } from '@mui/material';
import { CalendarDays, MessageSquare } from 'lucide-react';
import Badge from './ui/Badge';
import { formatDate, isOverdue, priorityClass, statusClass, statusLabel, taskStatuses } from '../utils/formatters';

export default function TaskCard({ task, onStatusChange, onOpen, compact = false }) {
  const completed = task.status === 'Completed';

  return (
    <article className={`rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium ${completed ? 'border-emerald-100 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <button className="text-left" onClick={() => onOpen?.(task)} type="button">
          <h3 className={`font-extrabold text-ink ${completed ? 'line-through decoration-emerald-500/60' : ''}`}>{task.title}</h3>
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
              <FormControl size="small" sx={{ minWidth: compact ? 136 : 150 }}>
                <Select
                  value={task.status}
                  onChange={(event) => onStatusChange(task._id, event.target.value)}
                  sx={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {taskStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {onOpen && <button className="text-xs font-black text-pine" onClick={() => onOpen(task)} type="button">Details</button>}
          </div>
        </div>
      )}
    </article>
  );
}
