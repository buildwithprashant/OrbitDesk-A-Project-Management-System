import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import api from '../api/client';
import PageTransition from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2),
  title: z.string().max(80),
  avatarColor: z.string()
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, title: user.title, avatarColor: user.avatarColor || '#0f766e' }
  });

  const submit = async (values) => {
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', values);
      updateUser(data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-pine">Profile</p>
        <h1 className="text-3xl font-black text-ink">Personal settings</h1>
      </div>
      <form className="glass-panel max-w-2xl rounded-2xl p-6" onSubmit={handleSubmit(submit)}>
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full text-2xl font-black text-white" style={{ background: user.avatarColor }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-ink">{user.email}</p>
            <p className="text-sm font-bold capitalize text-slate-500">{user.role}</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register('name')} />
          </div>
          <div>
            <label className="label">Title</label>
            <input className="input" {...register('title')} />
          </div>
          <div>
            <label className="label">Avatar color</label>
            <input className="h-12 w-full rounded-xl border border-slate-200 bg-white p-1" type="color" {...register('avatarColor')} />
          </div>
          <button className="btn-primary w-fit" disabled={saving}><Save size={18} /> {saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </form>
    </PageTransition>
  );
}
