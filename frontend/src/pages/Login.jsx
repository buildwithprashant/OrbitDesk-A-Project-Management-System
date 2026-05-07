import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageTransition from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (values) => {
    setSaving(true);
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <main className="grid min-h-screen place-items-center bg-mist p-6">
        <form className="glass-panel w-full max-w-md rounded-2xl p-8" onSubmit={handleSubmit(submit)}>
          <h1 className="text-3xl font-black text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Log in to your OrbitDesk workspace.</p>
          <div className="mt-8 grid gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" {...register('email')} />
              {errors.email && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" {...register('password')} />
              {errors.password && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.password.message}</p>}
            </div>
            <button className="btn-primary" disabled={saving}>{saving ? 'Signing in...' : 'Login'} <ArrowRight size={17} /></button>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here? <Link className="font-bold text-pine" to="/signup">Create an account</Link>
          </p>
        </form>
      </main>
    </PageTransition>
  );
}
