import { format, isPast, parseISO } from 'date-fns';

export const formatDate = (value) => (value ? format(parseISO(value), 'MMM d, yyyy') : 'No date');
export const isOverdue = (date, status) => status !== 'completed' && date && isPast(parseISO(date));

export const statusLabel = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  completed: 'Completed'
};

export const priorityClass = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-rose-50 text-rose-700 border-rose-100'
};

export const statusClass = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700'
};
