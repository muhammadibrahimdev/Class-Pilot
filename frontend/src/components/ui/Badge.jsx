const variants = {
  pending: 'bg-amber-50 text-amber-600 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
  pro: 'bg-primary/10 text-primary border border-primary/20',
  basic: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export default function Badge({ label, variant = 'basic' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant]}`}>
      {label}
    </span>
  );
}