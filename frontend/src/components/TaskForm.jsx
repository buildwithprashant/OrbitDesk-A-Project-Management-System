import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Project is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'completed']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignee: z.string().optional()
});

export default function TaskForm({ projects = [], users = [], initialValues, onSubmit, saving }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      project: projects[0]?._id || '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      assignee: ''
    }
  });

  const submit = (values) =>
    onSubmit({
      ...values,
      assignees: values.assignee ? [values.assignee] : []
    });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
      <div>
        <label className="label">Task title</label>
        <input className="input" {...register('title')} />
        {errors.title && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.title.message}</p>}
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-24" {...register('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Project</label>
          <select className="input" {...register('project')}>
            {projects.map((item) => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Assignee</label>
          <select className="input" {...register('assignee')}>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Status</label>
          <select className="input" {...register('status')}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Due date</label>
          <input className="input" type="date" {...register('dueDate')} />
        </div>
      </div>
      <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save task'}</button>
    </form>
  );
}
