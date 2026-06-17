import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiary } from '../api/errorApi';

const SEVERITY_STYLES = {
  LOW:      'text-zinc-500 dark:text-zinc-400',
  MEDIUM:   'text-amber-600 dark:text-amber-500',
  HIGH:     'text-orange-600 dark:text-orange-500',
  CRITICAL: 'text-red-600 dark:text-red-500',
};

export default function DiaryList() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDiary(page).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [page]);

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading diary...</p>;
  if (!data || data.content?.length === 0) return <p className="text-zinc-500 dark:text-zinc-400 text-sm">No errors in your diary yet.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Error Diary</h2>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50 border-t border-b border-zinc-200 dark:border-zinc-800/50">
        {data.content.map((entry) => (
          <Link
            key={entry.id}
            to={`/diary/${entry.id}`}
            className="group flex flex-col sm:flex-row sm:items-center gap-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors px-2 -mx-2 rounded-md"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${SEVERITY_STYLES[entry.severity]?.split(' ')[0] || 'bg-zinc-300'}`}></span>
                <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{entry.errorType}</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate pl-4.5">{entry.rootCause}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500 sm:w-48 sm:justify-end pl-4.5 sm:pl-0">
              <span className="uppercase">{entry.language}</span>
              <span>{new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-30 transition-colors"
        >
          &larr; Previous
        </button>
        <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
          Page {page + 1} of {data.totalPages || 1}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= (data.totalPages || 1) - 1}
          className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-30 transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
