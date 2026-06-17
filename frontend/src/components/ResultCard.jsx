const SEVERITY_STYLES = {
  LOW:      'text-zinc-500 dark:text-zinc-400',
  MEDIUM:   'text-amber-600 dark:text-amber-500',
  HIGH:     'text-orange-600 dark:text-orange-500',
  CRITICAL: 'text-red-600 dark:text-red-500',
};

export default function ResultCard({ result }) {
  if (!result) return null;
  if (!result.errorType) return null;

  const {
    errorType, rootCause, fix, prevention, severity, language, tags, createdAt,
  } = result;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-md p-8 space-y-8 bg-white dark:bg-zinc-900/50 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{errorType}</h2>
        <span className={`text-xs font-semibold uppercase tracking-widest flex items-center gap-2 ${SEVERITY_STYLES[severity] || 'text-zinc-500'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {severity || 'UNKNOWN'}
        </span>
      </div>

      {rootCause && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Root Cause</h3>
          <p className="text-zinc-900 dark:text-zinc-100 leading-relaxed text-sm">{rootCause}</p>
        </div>
      )}

      {fix && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Fix</h3>
          <p className="text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap text-sm bg-zinc-50 dark:bg-zinc-950 p-4 rounded-md border border-zinc-100 dark:border-zinc-800/50 font-mono">
            {fix}
          </p>
        </div>
      )}

      {prevention && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Prevention</h3>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">{prevention}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 mt-8">
        {language && <span>{language}</span>}
        {createdAt && <span>{new Date(createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-auto">
            {tags.map((t) => (
              <span key={t} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-sm">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
