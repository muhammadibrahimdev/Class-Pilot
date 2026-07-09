import { Icons } from '../../config/icon';

export default function DataTable({
  columns,
  data,
  total,
  page,
  totalPages,
  onPageChange,
  sortKey,
  sortDir,
  onSortChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found',
  itemLabel = 'item',
  rowKey = (row) => row.id,
  loading = false,
}) {
  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      onSortChange(col.key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(col.key, 'asc');
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border gap-4">
        <div className="relative w-full max-w-xs">
          <Icons.search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm
              outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
              placeholder:text-slate-300"
          />
        </div>
        <span className="text-xs text-muted shrink-0">
          {total} {itemLabel}{total !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="text-sm text-muted">Loading...</span>
          </div>
        )}
        <table className="w-full text-sm">
          <caption className="sr-only">{itemLabel} list</caption>
          <thead>
            <tr className="bg-surface border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col)}
                  className={`text-left text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-ink' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted text-sm py-12">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data?.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-surface/60 transition">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface">
        <p className="text-xs text-muted">
          Page {page} of {totalPages} &middot; {total} {itemLabel}{total !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="text-xs px-2 py-1 cursor-pointer rounded border border-border disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="text-xs cursor-pointer px-2 py-1 rounded border border-border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}