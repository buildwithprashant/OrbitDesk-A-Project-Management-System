import { FolderKanban } from 'lucide-react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-pine/10 text-pine">
        <FolderKanban size={24} />
      </div>
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
