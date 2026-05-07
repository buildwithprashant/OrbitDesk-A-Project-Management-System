import { Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProjectForm from '../components/ProjectForm';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/ui/PageTransition';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { formatDate } from '../utils/formatters';

export default function Projects() {
  const { canManageWork } = useAuth();
  const { data: projects = [], loading, refetch } = useFetch('/projects', { initialData: [] });
  const { data: users = [] } = useFetch('/users', { initialData: [] });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const createProject = async (values) => {
    setSaving(true);
    try {
      await api.post('/projects', { ...values, members: values.members || [] });
      toast.success('Project created');
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Could not create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-pine">Projects</p>
          <h1 className="text-3xl font-black text-ink">Workspace portfolio</h1>
        </div>
        {canManageWork && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} /> New project</button>}
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Skeleton /><Skeleton /><Skeleton /></div>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet" message="Create your first project to organize tasks, members, and deadlines." action={canManageWork && <button className="btn-primary" onClick={() => setOpen(true)}>Create project</button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium">
              <div className="mb-5 h-2 w-20 rounded-full" style={{ background: project.color }} />
              <h2 className="text-xl font-black text-ink">{project.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{project.description || 'No project description yet.'}</p>
              <div className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member) => (
                      <div key={member._id} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[11px] font-black text-white" style={{ background: member.avatarColor }}>
                        {member.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span>{project.members?.length || 0} members</span>
                </div>
                <span>Due {formatDate(project.deadline)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {open && <Modal title="Create project" onClose={() => setOpen(false)}><ProjectForm users={users} onSubmit={createProject} saving={saving} /></Modal>}
    </PageTransition>
  );
}
