export default function Input({ label, icon: Icon, error, ...props }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-ink">{label}</label>
        {props.action}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
        )}
        <input
          {...props}
          action={undefined}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5
            border rounded-lg text-sm outline-none transition
            placeholder:text-slate-300
            focus:border-primary focus:ring-2 focus:ring-primary/15
            ${error ? 'border-red-400' : 'border-border'}`}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}