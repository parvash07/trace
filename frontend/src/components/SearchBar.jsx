import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), language || null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow bg-transparent overflow-hidden">
        <input
          className="w-full bg-transparent px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          placeholder="Search your error diary..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="relative flex items-center">
          <select
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-md pl-4 pr-10 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-shadow h-full min-w-[140px]"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="" className="bg-white dark:bg-zinc-900">All languages</option>
            <option value="java" className="bg-white dark:bg-zinc-900">Java</option>
            <option value="python" className="bg-white dark:bg-zinc-900">Python</option>
            <option value="javascript" className="bg-white dark:bg-zinc-900">JavaScript</option>
            <option value="typescript" className="bg-white dark:bg-zinc-900">TypeScript</option>
            <option value="go" className="bg-white dark:bg-zinc-900">Go</option>
            <option value="rust" className="bg-white dark:bg-zinc-900">Rust</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-zinc-400 dark:text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <button 
          type="submit" 
          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors h-full"
        >
          Search
        </button>
      </div>
    </form>
  );
}
