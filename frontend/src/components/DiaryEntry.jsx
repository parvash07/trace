import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEntry, deleteEntry } from '../api/errorApi';
import ResultCard from './ResultCard';

export default function DiaryEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEntry(id).then((res) => {
      setEntry(res);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trace?')) return;
    try {
      await deleteEntry(id);
      navigate('/diary');
    } catch {}
  };

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading entry...</p>;
  if (!entry) return <p className="text-zinc-500 dark:text-zinc-400 text-sm">Entry not found.</p>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/diary')} 
          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 text-sm font-medium transition-colors"
        >
          &larr; Back to diary
        </button>
        <button 
          onClick={handleDelete} 
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
        >
          Delete Trace
        </button>
      </div>
      <ResultCard result={entry} />
    </div>
  );
}
