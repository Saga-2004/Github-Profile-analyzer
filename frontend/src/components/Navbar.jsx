import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

/**
 * Navbar component providing responsive navigation matching GitHub's dark UI theme.
 */
export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 text-[#e6edf3] hover:text-[#58a6ff] transition-colors">
              {/* GitHub Mark SVG */}
              <svg className="w-8 h-8 fill-current" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.88.01.64.01 1.11.01 1.2 0 .21-.15.46-.55.38A8.013 8.013 0 010 8c0-4.42 3.58-8 8-8z"></path>
              </svg>
              <span className="font-semibold text-lg tracking-wider">GH Analyzer</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'border-[#58a6ff] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e]'
              }`}
            >
              Search
            </Link>
            <Link
              to="/profiles"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                isActive('/profiles')
                  ? 'border-[#58a6ff] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e]'
              }`}
            >
              All Profiles
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-[#0d1117] inline-flex items-center justify-center p-2 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22] focus:outline-none border border-[#30363d]"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[#30363d] bg-[#161b22]">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/')
                ? 'bg-[#0d1117] text-[#58a6ff] border-l-4 border-[#58a6ff]'
                : 'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#e6edf3]'
            }`}
          >
            Search
          </Link>
          <Link
            to="/profiles"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/profiles')
                ? 'bg-[#0d1117] text-[#58a6ff] border-l-4 border-[#58a6ff]'
                : 'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#e6edf3]'
            }`}
          >
            All Profiles
          </Link>
        </div>
      </div>
    </nav>
  );
}
