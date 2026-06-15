import { useState, useEffect, useMemo } from 'react';

/**
 * Mapping of programming languages to their brand colors.
 * Extend this map as needed.
 */
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  CSharp: '#178600',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Rust: '#dea584',
  // add more as needed
};

/**
 * Convert an ISO date string to a relative time ago format.
 * Example: "2023-09-01T12:34:56Z" -> "2 days ago"
 */
function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (const i of intervals) {
    const count = Math.floor(diffSec / i.seconds);
    if (count >= 1) {
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Debounce hook – returns a debounced value after the specified delay.
 */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

/**
 * Repository card component.
 */
function RepoCard({ repo }) {
  const {
    name,
    full_name,
    description,
    html_url,
    language,
    stargazers_count,
    forks_count,
    watchers_count,
    open_issues_count,
    topics = [],
    updated_at,
  } = repo;

  const displayedTopics = topics.slice(0, 4);
  const extraCount = topics.length - displayedTopics.length;

  const langColor = LANGUAGE_COLORS[language] || '#8b949e';

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:bg-[#21262d] transition-colors shadow-sm">
      <a href={html_url} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="text-[#58a6ff] font-semibold text-lg hover:underline truncate">{name}</h3>
      </a>
      {description && (
        <p className="text-[#8b949e] text-sm mt-1 line-clamp-2">{description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {language && (
          <span className="flex items-center text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${langColor}20`, color: langColor }}>
            {language}
          </span>
        )}
        <span className="text-xs text-[#8b949e]">★ {stargazers_count}</span>
        <span className="text-xs text-[#8b949e]">⑂ {forks_count}</span>
        <span className="text-xs text-[#8b949e]">👁️ {watchers_count}</span>
        <span className="text-xs text-[#8b949e]">❗ {open_issues_count}</span>
        <span className="text-xs text-[#8b949e]">⏱ {timeAgo(updated_at)}</span>
      </div>
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {displayedTopics.map((t, i) => (
            <span key={i} className="text-xs bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20 rounded-full px-2 py-0.5">
              #{t}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-full px-2 py-0.5">
              +{extraCount} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Main component for displaying a searchable, sortable list of repositories.
 */
export default function RepositoriesList({ repositories = [] }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('stars'); // stars, forks, updated
  const [languageFilter, setLanguageFilter] = useState('All');

  const debouncedSearch = useDebounce(search, 300);

  // Unique languages for filter dropdown
  const languages = useMemo(() => {
    const setLang = new Set();
    repositories.forEach(r => r.language && setLang.add(r.language));
    return ['All', ...Array.from(setLang).sort()];
  }, [repositories]);

  const filteredRepos = useMemo(() => {
    let list = repositories;
    if (languageFilter !== 'All') {
      list = list.filter(r => r.language === languageFilter);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(lower) || (r.description && r.description.toLowerCase().includes(lower)));
    }
    // Sorting
    if (sortKey === 'stars') {
      list = [...list].sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortKey === 'forks') {
      list = [...list].sort((a, b) => b.forks_count - a.forks_count);
    } else if (sortKey === 'updated') {
      list = [...list].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
    return list;
  }, [repositories, languageFilter, debouncedSearch, sortKey]);

  return (
    <section className="mt-10">
      <h2 className="text-[#e6edf3] text-xl font-semibold mb-4">Repositories ({filteredRepos.length})</h2>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Search repositories…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
        />
        <select
          value={languageFilter}
          onChange={e => setLanguageFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
        >
          {languages.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
        >
          <option value="stars">Stars ↓</option>
          <option value="forks">Forks ↓</option>
          <option value="updated">Updated ↓</option>
        </select>
      </div>
      {filteredRepos.length === 0 ? (
        <p className="text-[#8b949e]">No repositories match the selected criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
}
