import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  color: z.string().optional(),
  members: z.array(z.string()).optional()
});

export default function ProjectForm({ initialValues, users = [], onSubmit, saving }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || { name: '', description: '', deadline: '', color: '#0f766e', members: [] }
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="label">Project name</label>
        <input className="input" {...register('name')} />
        {errors.name && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-28" {...register('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Deadline</label>
          <input className="input" type="date" {...register('deadline')} />
          {errors.deadline && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.deadline.message}</p>}
        </div>
        <div>
          <label className="label">Accent</label>
          <input className="h-12 w-full rounded-xl border border-slate-200 bg-white p-1" type="color" {...register('color')} />
        </div>
      </div>
      {users.length > 0 && (
        <div>
          <label className="label">Project members</label>
          <div className="grid max-h-44 gap-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600">
                <input type="checkbox" value={user._id} {...register('members')} />
                {user.name}
                <span className="text-xs capitalize text-slate-400">{user.role}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save project'}</button>
    </form>
  );
}
