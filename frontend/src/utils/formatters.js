import { format, isPast, parseISO } from 'date-fns';

export const formatDate = (value) => (value ? format(parseISO(value), 'MMM d, yyyy') : 'No date');
export const isOverdue = (date, status) => status !== 'Completed' && date && isPast(parseISO(date));

export const taskStatuses = ['Pending', 'In Progress', 'Completed'];

export const statusLabel = {
  Pending: 'Pending',
  'In Progress': 'In Progress',
  Completed: 'Completed'
};

export const priorityClass = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-rose-50 text-rose-700 border-rose-100'
};

export const statusClass = {
  Pending: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700'
};
