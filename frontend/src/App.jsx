import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AnalyzeForm from './components/AnalyzeForm';
import ResultCard from './components/ResultCard';
import SimilarErrors from './components/SimilarErrors';
import SearchBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import DiaryEntryPage from './components/DiaryEntry';
import { searchErrors } from './api/errorApi';

function Layout({ children, activeView, setActiveView }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const location = useLocation();

  const safeSetView = setActiveView || (() => {});
  const currentView = location.pathname.startsWith('/diary') ? 'diary' : activeView;

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200 font-sans tracking-tight">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" onClick={() => safeSetView('analyze')} className="text-xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-50">
            Trace
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              onClick={() => safeSetView('analyze')}
              className={`transition-colors duration-200 ${currentView === 'analyze' ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'}`}
            >
              Analyze
            </Link>
            <Link
              to="/diary"
              onClick={() => safeSetView('diary')}
              className={`transition-colors duration-200 ${currentView === 'diary' ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'}`}
            >
              Diary
            </Link>
            <button 
              onClick={toggleTheme} 
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors ml-2 flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}

function HomePage({ defaultView }) {
  const [result, setResult] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [activeView, setActiveView] = useState(defaultView || 'analyze');

  const handleAnalyzeResult = (data) => {
    setResult(data);
    setSearchResults(null);
    setActiveView('analyze');
  };

  const handleSearch = async (query, language) => {
    const data = await searchErrors(query, language);
    setSearchResults(data);
    setResult(null);
    setActiveView('search');
  };

  return (
    <Layout activeView={activeView} setActiveView={(view) => { setActiveView(view); setSearchResults(null); setResult(null); }}>
      <div className="space-y-12">
        <SearchBar onSearch={handleSearch} />

        {activeView === 'diary' ? (
          <DiaryList />
        ) : searchResults ? (
          <div className="space-y-6">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              Search Results ({searchResults.totalResults})
            </h2>
            {searchResults.results.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No results found.</p>
            ) : (
              <div className="space-y-8">
                {searchResults.results.map((entry) => (
                  <ResultCard key={entry.id} result={entry} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <AnalyzeForm onResult={handleAnalyzeResult} />
            {result && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ResultCard result={result} />
                <SimilarErrors errors={result.similarErrors} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/diary" element={<HomePage defaultView="diary" />} />
      <Route path="/diary/:id" element={<Layout><DiaryEntryPage /></Layout>} />
    </Routes>
  );
}
