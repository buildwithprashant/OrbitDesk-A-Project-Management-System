import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, MenuItem, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import UserMultiSelect from './UserMultiSelect';
import { taskStatuses } from '../utils/formatters';

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const stringArray = z.preprocess(toArray, z.array(z.string()));

const schema = z.object({
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Project is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(taskStatuses),
  dueDate: z.string().min(1, 'Due date is required'),
  assignees: stringArray.optional()
});

export default function TaskForm({ projects = [], users = [], initialValues, onSubmit, saving }) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      title: '',
      description: '',
      project: projects[0]?._id || '',
      priority: 'medium',
      status: 'Pending',
      dueDate: '',
      assignees: []
    }
  });

  const selectedAssignees = toArray(watch('assignees'));
  const allUserIds = users.map((user) => user._id);

  const submit = (values) =>
    onSubmit({
      ...values,
      assignees: toArray(values.assignees)
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="label mb-0">Assignees</label>
            {users.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-bold">
                <button className="text-pine" type="button" onClick={() => setValue('assignees', allUserIds, { shouldDirty: true, shouldValidate: true })}>
                  All
                </button>
                <button className="text-slate-400" type="button" onClick={() => setValue('assignees', [], { shouldDirty: true, shouldValidate: true })}>
                  Clear
                </button>
              </div>
            )}
          </div>
          {users.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-500">
              No users available.
            </p>
          ) : (
            <Controller
              control={control}
              name="assignees"
              render={({ field }) => (
                <UserMultiSelect
                  users={users}
                  value={field.value}
                  onChange={field.onChange}
                  label="Assignees"
                  placeholder="Search and select users"
                />
              )}
            />
          )}
          <p className="mt-2 text-xs font-bold text-slate-400">{selectedAssignees.length} selected</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <Select {...field}>
                  {taskStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
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
