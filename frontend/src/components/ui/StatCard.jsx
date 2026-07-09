export default function StatCard({ icon: Icon, label, value, sub, badge, badgeColor }) {
  const badgeColors = {
    green: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    blue: 'text-primary bg-primary/10',
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted">
          <Icon size={20} />
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColors[badgeColor] || badgeColors.blue}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-muted uppercase tracking-wide mb-1">{label}</p>
        <p className="font-heading text-2xl font-bold text-ink">{value ?? '—'}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}