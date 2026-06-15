/**
 * LanguageChart component providing a custom Tailwind stacked bar and percentages representing repository language counts.
 */
export default function LanguageChart({ languages }) {
  // Safe parsing to support both raw database strings and objects
  const parsedLanguages = typeof languages === 'string'
    ? JSON.parse(languages)
    : (languages || {});

  const entries = Object.entries(parsedLanguages);

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-[#8b949e] border border-[#30363d] rounded-lg bg-[#0d1117] italic text-sm">
        No language statistics available.
      </div>
    );
  }

  // Calculate total repos to compute percentage
  const total = entries.reduce((sum, [_, val]) => sum + val, 0);

  // Colors mapping for common GitHub language values
  const colorPalette = {
    JavaScript: 'bg-[#f1e05a]',
    TypeScript: 'bg-[#3178c6]',
    HTML: 'bg-[#e34c26]',
    CSS: 'bg-[#563d7c]',
    Python: 'bg-[#3572A5]',
    Java: 'bg-[#b07219]',
    Go: 'bg-[#00ADD8]',
    Rust: 'bg-[#dea584]',
    Ruby: 'bg-[#701516]',
    C: 'bg-[#555555]',
    'C++': 'bg-[#f34b7d]',
    'C#': 'bg-[#178600]',
    PHP: 'bg-[#4F5D95]',
    Shell: 'bg-[#89e051]',
    Swift: 'bg-[#F05138]'
  };

  const getBgColor = (lang) => colorPalette[lang] || 'bg-[#8b949e]';

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 shadow-sm">
      <h3 className="text-[#e6edf3] font-semibold text-base mb-4 flex items-center gap-2">
        <span>📊</span> Top Languages
      </h3>

      {/* Stacked Progress Bar */}
      <div className="w-full h-3 flex overflow-hidden rounded-full bg-[#30363d] mb-6 shadow-inner">
        {entries.map(([lang, count], index) => {
          const pct = ((count / total) * 100).toFixed(1);
          const colorClass = getBgColor(lang);
          return (
            <div
              key={index}
              style={{ width: `${pct}%` }}
              className={`${colorClass} transition-all duration-500`}
              title={`${lang}: ${count} repos (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Details list with progress lines */}
      <div className="space-y-4">
        {entries.map(([lang, count], index) => {
          const pct = ((count / total) * 100).toFixed(1);
          const colorClass = getBgColor(lang);
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${colorClass} border border-[#30363d]`} />
                  <span className="font-medium text-[#e6edf3]">{lang}</span>
                </div>
                <span className="text-xs text-[#8b949e] font-semibold">
                  {count} {count === 1 ? 'repo' : 'repos'} ({pct}%)
                </span>
              </div>
              <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full ${colorClass} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
