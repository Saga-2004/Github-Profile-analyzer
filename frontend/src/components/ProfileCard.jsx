import ProfileStats from './ProfileStats';
import LanguageChart from './LanguageChart';

/**
 * ProfileCard component displaying details of a specific analyzed profile.
 * Displays user avatar, info fields, topics, metrics, languages, and repo statistics.
 */
export default function ProfileCard({ profile }) {
  if (!profile) return null;

  const {
    username,
    name,
    bio,
    avatar_url,
    location,
    company,
    blog,
    email,
    twitter_username,
    most_starred_repo,
    most_forked_repo,
    top_languages,
    repo_topics,
    analyzed_at
  } = profile;

  // Safe parsing of repository topics JSON array
  const parsedTopics = typeof repo_topics === 'string'
    ? JSON.parse(repo_topics)
    : (repo_topics || []);

  /**
   * Formats the analyzed timestamp to a human-readable date.
   */
  const formatAnalyzedAt = (dateString) => {
    if (!dateString) return '';
    try {
      const isoStr = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
      const d = new Date(isoStr);
      return d.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  /**
   * Helper to guess repository owner/repo URL to open repository in new tab.
   */
  const getRepoLink = (repoString, owner) => {
    if (!repoString) return '#';
    const parts = repoString.split(' (');
    const repoName = parts[0].trim();
    return `https://github.com/${owner}/${repoName}`;
  };

  const getRepoNameOnly = (repoString) => {
    if (!repoString) return '';
    return repoString.split(' (')[0].trim();
  };

  const getRepoStatOnly = (repoString) => {
    if (!repoString) return '';
    const parts = repoString.split(' (');
    return parts[1] ? parts[1].replace(')', '') : '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 md:p-8 shadow-xl">
        
        {/* Top Profile Overview Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 space-y-4 md:space-y-0">
          <img
            src={avatar_url || 'https://github.com/identicons/ghost.png'}
            alt={`${username}'s avatar`}
            className="w-24 h-24 rounded-full border-2 border-[#58a6ff] shadow-md object-cover"
          />
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#e6edf3]">{name || username}</h2>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#58a6ff] hover:underline"
                >
                  @{username}
                </a>
              </div>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 md:mt-0 px-4 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e] font-medium text-sm rounded-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>View on GitHub</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            {bio && <p className="text-[#8b949e] text-sm max-w-2xl leading-relaxed">{bio}</p>}

            {/* Profile Info Icons and Text Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#8b949e] pt-2">
              {location && (
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span className="truncate" title={location}>{location}</span>
                </div>
              )}
              {company && (
                <div className="flex items-center space-x-2">
                  <span>🏢</span>
                  <span className="truncate" title={company}>{company}</span>
                </div>
              )}
              {blog && (
                <div className="flex items-center space-x-2">
                  <span>🔗</span>
                  <a
                    href={blog.startsWith('http') ? blog : `https://${blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#58a6ff] hover:underline truncate"
                    title={blog}
                  >
                    {blog}
                  </a>
                </div>
              )}
              {twitter_username && (
                <div className="flex items-center space-x-2">
                  <span>🐦</span>
                  <a
                    href={`https://twitter.com/${twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#58a6ff] hover:underline truncate"
                    title={`@${twitter_username}`}
                  >
                    @{twitter_username}
                  </a>
                </div>
              )}
            </div>

            {/* Repository Topics */}
            {parsedTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3 justify-center md:justify-start">
                {parsedTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20 rounded-full font-medium"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <ProfileStats stats={profile} />

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Languages Column */}
          <LanguageChart languages={top_languages} />

        </div>

        {/* Footer info bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#30363d] mt-6 pt-4 text-xs text-[#8b949e] gap-2">
          <div>
            Analyzed at: <span className="text-[#e6edf3]">{formatAnalyzedAt(analyzed_at)}</span>
          </div>
          <div className="flex items-center space-x-1 text-[#3fb950] bg-[#3fb950]/10 border border-[#3fb950]/20 px-2.5 py-0.5 rounded-full font-semibold">
            <span>✓</span>
            <span>Saved to Database</span>
          </div>
        </div>

      </div>
    </div>
  );
}
