import { Link } from 'react-router-dom';

export default function SimilarErrors({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
        Similar Past Traces ({errors.length})
      </h3>
      <ul className="space-y-3">
        {errors.map((err) => (
          <li key={err.id} className="group">
            <Link to={`/diary/${err.id}`} className="block p-4 -mx-4 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">{err.errorType}</span>
                <span className="text-zinc-400 dark:text-zinc-500 text-xs shrink-0">{new Date(err.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 truncate">{err.rootCause}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
