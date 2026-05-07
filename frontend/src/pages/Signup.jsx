import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageTransition from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'manager', 'admin']),
  title: z.string().optional()
});

export default function Signup() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user', title: 'Product teammate' }
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (values) => {
    setSaving(true);
    try {
      await signup(values);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center bg-mist p-6">
        <form className="glass-panel w-full max-w-lg rounded-2xl p-8" onSubmit={handleSubmit(submit)}>
          <h1 className="text-3xl font-black text-ink">Create your workspace</h1>
          <p className="mt-2 text-sm text-slate-500">Choose User, Manager, or Admin to test role-based workspace flows.</p>
          <div className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input className="input" {...register('name')} />
                {errors.name && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input" {...register('role')}>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Title</label>
              <input className="input" {...register('title')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" {...register('email')} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" {...register('password')} />
              {errors.password && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.password.message}</p>}
            </div>
            <button className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create account'} <ArrowRight size={17} /></button>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link className="font-bold text-pine" to="/login">Login</Link>
          </p>
        </form>
      </main>
    </PageTransition>
  );
}
