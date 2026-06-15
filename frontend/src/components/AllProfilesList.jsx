import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProfiles, deleteProfile } from '../services/api';

/**
 * AllProfilesList component displaying a filterable list of all analyzed profiles.
 * Supports deletion, search filtering, and navigation.
 */
export default function AllProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const res = await getAllProfiles();
      setProfiles(res.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profiles from database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (username, e) => {
    e.stopPropagation(); // Prevent row click navigation
    if (window.confirm(`Are you sure you want to delete the profile for '${username}'?`)) {
      try {
        await deleteProfile(username);
        setProfiles(profiles.filter(p => p.username.toLowerCase() !== username.toLowerCase()));
      } catch (err) {
        alert(`Failed to delete profile: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleRowClick = (username) => {
    // Navigate home and trigger search for this user
    navigate('/', { state: { searchUsername: username } });
  };

  const filteredProfiles = profiles.filter(p =>
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const isoStr = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin h-10 w-10 text-[#58a6ff]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center max-w-xl mx-auto my-10 shadow-md">
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchProfiles}
          className="mt-3 px-4 py-1.5 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#e6edf3] text-sm rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      
      {/* Summary count and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-[#8b949e] text-sm font-medium">
          Showing {filteredProfiles.length} of {profiles.length} profiles
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by username/name..."
            className="w-full bg-[#161b22] text-[#e6edf3] placeholder-[#8b949e] pl-4 pr-10 py-2 rounded-lg border border-[#30363d] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all text-sm shadow-sm"
          />
          <span className="absolute right-3 top-2.5 text-xs text-[#8b949e]">🔍</span>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center shadow-lg">
          <div className="text-4xl mb-4">🐙</div>
          <h3 className="text-lg font-semibold text-[#e6edf3] mb-2">No profiles analyzed yet</h3>
          <p className="text-sm text-[#8b949e] max-w-md mx-auto mb-6">
            Search for a GitHub username on the home page to run a full profile analysis and save it to the database!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium text-sm rounded-md transition-colors shadow-md"
          >
            Go to Search
          </button>
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-[#c9d1d9]">
              <thead className="bg-[#21262d] text-[#8b949e] font-semibold uppercase text-xs border-b border-[#30363d]">
                <tr>
                  <th className="px-6 py-4">Avatar</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4 text-center">Repos</th>
                  <th className="px-6 py-4 text-center">Followers</th>
                  <th className="px-6 py-4 text-center">Stars</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Analyzed At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {filteredProfiles.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleRowClick(p.username)}
                    className="hover:bg-[#30363d]/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={p.avatar_url || 'https://github.com/identicons/ghost.png'}
                        alt={p.username}
                        className="w-8 h-8 rounded-full border border-[#30363d] object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#58a6ff] hover:underline">
                      <div className="flex flex-col">
                        <span>{p.username}</span>
                        {p.name && <span className="text-xs text-[#8b949e] font-normal">{p.name}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span>📦</span>
                        <span>{p.public_repos}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span>👥</span>
                        <span>{Number(p.followers).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-[#d4a72c]">
                        <span>⭐</span>
                        <span>{p.total_stars}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[120px] truncate" title={p.location || 'N/A'}>
                      {p.location ? `📍 ${p.location}` : <span className="text-[#8b949e]/50">—</span>}
                    </td>
                    <td className="px-6 py-4 text-[#8b949e]">
                      {formatDate(p.analyzed_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => handleDelete(p.username, e)}
                        className="p-1.5 hover:bg-red-500/10 text-[#8b949e] hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-md transition-all"
                        title="Delete Profile"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
