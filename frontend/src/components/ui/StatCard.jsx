export default function StatCard({ icon: Icon, label, value, accent = 'bg-pine/10 text-pine' }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
