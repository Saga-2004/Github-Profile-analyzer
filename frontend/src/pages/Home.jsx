import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RepositoriesList from '../components/RepositoriesList';
import ProfileCard from '../components/ProfileCard';
import { analyzeProfile } from '../services/api';

/**
 * Home page providing search input and display functionality for GitHub profile analysis.
 */
export default function Home() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Trigger analysis immediately if redirected from table list selection
    if (location.state?.searchUsername) {
      handleSearch(location.state.searchUsername);
      // Clean history to avoid re-triggering search on subsequent loads
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSearch = async (username) => {
    setIsLoading(true);
    setError(null);
    setProfile(null);

    try {
      const res = await analyzeProfile(username);
      setProfile(res.data.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to analyze GitHub user');
      } else {
        setError('Network error: Could not reach the API server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] py-12 px-4">
      {/* Hero Header Section */}
      <div className="text-center max-w-xl mx-auto space-y-4 mb-8">
        <div className="flex justify-center text-[#e6edf3]">
          {/* Large Octocat SVG */}
          <svg className="w-16 h-16 fill-current hover:text-[#58a6ff] transition-colors duration-300" viewBox="0 0 16 16" version="1.1">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.88.01.64.01 1.11.01 1.2 0 .21-.15.46-.55.38A8.013 8.013 0 010 8c0-4.42 3.58-8 8-8z"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-[#e6edf3] tracking-tight sm:text-5xl">
          GitHub Profile Analyzer
        </h1>
        <p className="text-base text-[#8b949e] font-medium max-w-md mx-auto">
          Analyze any GitHub profile, calculate repository insights, and store metrics instantly in your database.
        </p>
      </div>

      {/* Big Search Input */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-10 w-10 text-[#58a6ff]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {/* Error notification display */}
      {error && !isLoading && (
        <div className="w-full max-w-2xl mx-auto px-4 mt-6">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-semibold">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[#8b949e] hover:text-[#e6edf3] text-sm font-medium transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Profile result display */}
      {profile && !isLoading && (
        <>
          <ProfileCard profile={profile} />
          <RepositoriesList repositories={profile.repositories || []} />
        </>
      )}
    </div>
  );
}
