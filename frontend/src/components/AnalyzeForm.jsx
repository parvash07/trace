import { useState } from 'react';
import { analyzeError } from '../api/errorApi';

const LANGUAGES = ['java', 'python', 'javascript', 'typescript', 'go', 'rust', 'csharp', 'other'];

const SAMPLE_ERROR = {
  stackTrace: `java.lang.NullPointerException: Cannot invoke "String.length()" because "user.getName()" is null
    at com.example.UserService.greet(UserService.java:15)
    at com.example.UserController.getGreeting(UserController.java:22)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
    at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.base/java.lang.reflect.Method.invoke(Method.java:569)
    at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:207)
    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:884)`,
  codeContext: `public class UserService {
    public String greet(User user) {
        return "Hello " + user.getName().toUpperCase();
    }
}`,
  language: 'java',
  tags: ['java', 'null-pointer', 'spring'],
};

export default function AnalyzeForm({ onResult }) {
  const [stackTrace, setStackTrace] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [language, setLanguage] = useState('java');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('trace-example-loaded')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTags = (raw) => {
    const parsed = raw.split(/[,]+/).map(t => t.trim()).filter(t => t.length > 0);
    const unique = parsed.filter(t => !tags.includes(t));
    if (unique.length > 0) {
      setTags([...tags, ...unique]);
    }
    setTagInput('');
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const loadExample = () => {
    setStackTrace(SAMPLE_ERROR.stackTrace);
    setCodeContext(SAMPLE_ERROR.codeContext);
    setLanguage(SAMPLE_ERROR.language);
    setTags((prev) => [...new Set([...prev, ...SAMPLE_ERROR.tags])]);
    localStorage.setItem('trace-example-loaded', 'true');
    setShowWelcome(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeError({ stackTrace, codeContext, language, tags });
      onResult(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Check that the backend and PostgreSQL are running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {showWelcome && (
        <div className="flex items-center justify-between px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-100 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            New to Trace?{' '}
            <button type="button" onClick={loadExample} className="underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors">
              Load a sample error
            </button>
            {' '}— see how it works.
          </p>
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Stack Trace</label>
        <textarea
          className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-md p-4 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-y"
          rows={8}
          placeholder="Paste your stack trace here..."
          value={stackTrace}
          onChange={(e) => setStackTrace(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Code Context (optional)</label>
        <textarea
          className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-md p-4 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-y"
          rows={4}
          placeholder="Paste relevant code..."
          value={codeContext}
          onChange={(e) => setCodeContext(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Language</label>
          <div className="relative flex items-center">
            <select
              className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-md pl-4 pr-10 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-shadow"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l} className="bg-white dark:bg-zinc-900">{l}</option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tags</label>
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow overflow-hidden bg-transparent">
            <input
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTags(tagInput);
                }
              }}
            />
            <button 
              type="button" 
              onClick={() => addTags(tagInput)} 
              className="px-4 py-2.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors border-l border-zinc-200 dark:border-zinc-800"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-sm">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing...' : 'Analyze Trace'}
      </button>
    </form>
  );
}
