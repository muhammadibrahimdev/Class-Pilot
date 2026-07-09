export default function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-lg
        font-semibold text-sm text-white bg-primary hover:bg-primary-dark
        transition disabled:bg-primary/50 disabled:cursor-not-allowed"
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}