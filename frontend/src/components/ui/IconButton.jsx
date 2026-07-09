export default function IconButton({ icon: Icon, onClick, variant = 'default', title }) {
  const variants = {
    default: 'text-muted hover:text-ink hover:bg-surface',
    success: 'text-emerald-600 hover:bg-emerald-50',
    danger: 'text-red-500 hover:bg-red-50',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${variants[variant]}`}
    >
      <Icon size={16} />
    </button>
  );
}