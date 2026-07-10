export default function IconButton({ icon: Icon, onClick, variant = 'default', title, loading }) {
  const variants = {
    default: 'text-muted hover:text-ink hover:bg-surface',
    success: 'text-emerald-600 hover:bg-emerald-50',
    danger: 'text-red-500 hover:bg-red-50',
  };

  return (
    <button
      disabled={loading}
      onClick={onClick}
      title={title}
      className={`w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center transition ${variants[variant]}`}
    >
      <Icon size={16} />
    </button>
  );
}