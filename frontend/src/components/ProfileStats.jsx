/**
 * ProfileStats component displaying key metrics such as repos, stars, followers, forks, and gists in a grid.
 */
export default function ProfileStats({ stats }) {
  const {
    public_repos = 0,
    followers = 0,
    following = 0,
    total_stars = 0,
    total_forks = 0,
    public_gists = 0
  } = stats || {};

  const statItems = [
    { label: 'Public Repos', value: public_repos, color: 'text-[#3fb950]', icon: '📦' },
    { label: 'Followers', value: followers, color: 'text-[#58a6ff]', icon: '👥' },
    { label: 'Following', value: following, color: 'text-[#bc8cff]', icon: '👤' },
    { label: 'Total Stars', value: total_stars, color: 'text-[#d4a72c]', icon: '⭐' },
    { label: 'Total Forks', value: total_forks, color: 'text-[#f0883e]', icon: '🍴' },
    { label: 'Public Gists', value: public_gists, color: 'text-[#8b949e]', icon: '📝' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 border-y border-[#30363d] py-6 my-6">
      {statItems.map((item, idx) => (
        <div key={idx} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 text-center hover:border-[#8b949e] transition-colors shadow-sm">
          <div className="text-xl mb-1">{item.icon}</div>
          <div className={`text-2xl font-bold ${item.color} tracking-tight`}>
            {Number(item.value).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-[#8b949e] mt-1 uppercase tracking-wider">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
