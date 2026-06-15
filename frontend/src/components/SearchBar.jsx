import { useEffect, useRef, useState } from 'react';

/**
 * SearchBar component to fetch GitHub username analytics.
 * Supports loading states and autofocus.
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4 mt-6">
      <div className="relative flex items-center">
        {/* GitHub Logo Icon */}
        <div className="absolute left-4 text-[#8b949e] pointer-events-none">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.88.01.64.01 1.11.01 1.2 0 .21-.15.46-.55.38A8.013 8.013 0 010 8c0-4.42 3.58-8 8-8z"></path>
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="w-full bg-[#161b22] text-[#e6edf3] placeholder-[#8b949e] pl-12 pr-32 py-4 rounded-lg border border-[#30363d] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all text-lg shadow-lg"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={!username.trim() || isLoading}
          className="absolute right-2 px-6 py-2 bg-[#1f6feb] hover:bg-[#388bfd] disabled:bg-[#1f6feb]/50 text-white font-medium rounded-md transition-all shadow-md flex items-center justify-center min-w-[100px] h-[44px]"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </form>
  );
}
