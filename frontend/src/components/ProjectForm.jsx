import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const stringArray = z.preprocess(toArray, z.array(z.string()));

const schema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  color: z.string().optional(),
  members: stringArray.optional()
});

export default function ProjectForm({ initialValues, users = [], onSubmit, saving }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || { name: '', description: '', deadline: '', color: '#0f766e', members: [] }
  });

  const selectedMembers = toArray(watch('members'));
  const allUserIds = users.map((user) => user._id);
  const submit = (values) => onSubmit({ ...values, members: toArray(values.members) });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="label mb-0">Project members</label>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button className="text-pine" type="button" onClick={() => setValue('members', allUserIds, { shouldDirty: true, shouldValidate: true })}>
                All
              </button>
              <button className="text-slate-400" type="button" onClick={() => setValue('members', [], { shouldDirty: true, shouldValidate: true })}>
                Clear
              </button>
            </div>
          </div>
          <div className="grid max-h-44 gap-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600">
                <input type="checkbox" value={user._id} {...register('members')} />
                <span className="min-w-0 flex-1 truncate">{user.name}</span>
                <span className="text-xs capitalize text-slate-400">{user.role}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs font-bold text-slate-400">{selectedMembers.length} selected</p>
        </div>
      )}
      <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save project'}</button>
    </form>
  );
}
