const axios = require('axios');

const githubToken = process.env.GITHUB_TOKEN;
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'GitHub-Profile-Analyzer'
};

// Defensive check to avoid using placeholder token from .env.example
if (githubToken && githubToken.trim() !== '' && githubToken !== 'your_github_personal_access_token_here') {
  headers['Authorization'] = `token ${githubToken.trim()}`;
}

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers
});

/**
 * Formats an ISO date string into MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
 * @param {string} isoString 
 * @returns {string|null}
 */
function formatMySQLDate(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
  } catch (e) {
    return null;
  }
}

/**
 * Fetches GitHub profile details and calculates insights from repositories.
 * @param {string} username 
 * @returns {Promise<Object>} Processed profile data
 */
async function fetchAndProcessProfile(username) {
  try {
    // 1. Fetch main profile data
    const userRes = await githubClient.get(`/users/${username}`);
    const userData = userRes.data;

    // 2. Fetch up to 100 repositories, sorted by last updated
    const reposRes = await githubClient.get(`/users/${username}/repos`, {
      params: {
        per_page: 100,
        sort: 'updated'
      }
    });
    const repos = reposRes.data;

    // 3. Compute metrics and analytics from the repositories
    let totalStars = 0;
    let totalForks = 0;
    const languagesMap = {};
    let maxStars = -1;
    let mostStarredRepo = null;
    let maxForks = -1;
    let mostForkedRepo = null;
    const uniqueTopics = new Set();

    repos.forEach(repo => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      // Count programming languages
      if (repo.language) {
        languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
      }

      // Track the repo with the most stars
      if (repo.stargazers_count !== undefined && repo.stargazers_count > maxStars) {
        maxStars = repo.stargazers_count;
        mostStarredRepo = `${repo.name} (⭐ ${repo.stargazers_count})`;
      }

      // Track the repo with the most forks
      if (repo.forks_count !== undefined && repo.forks_count > maxForks) {
        maxForks = repo.forks_count;
        mostForkedRepo = `${repo.name} (🍴 ${repo.forks_count})`;
      }

      // Collect topics for the repositories
      if (Array.isArray(repo.topics)) {
        repo.topics.forEach(topic => uniqueTopics.add(topic));
      }
    });

    // Top 5 languages sorted descending
    const topLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((acc, [lang, count]) => {
        acc[lang] = count;
        return acc;
      }, {});

    // Limit unique topics to a maximum of 15
    const repoTopics = Array.from(uniqueTopics).slice(0, 15);

    // Map all properties for insertion/update into the MySQL DB
    return {
      username: userData.login,
      name: userData.name || null,
      bio: userData.bio || null,
      avatar_url: userData.avatar_url || null,
      location: userData.location || null,
      company: userData.company || null,
      blog: userData.blog || null,
      email: userData.email || null,
      twitter_username: userData.twitter_username || null,
      public_repos: userData.public_repos || 0,
      public_gists: userData.public_gists || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      total_stars: totalStars,
      total_forks: totalForks,
      top_languages: JSON.stringify(topLanguages),
      most_starred_repo: mostStarredRepo,
      most_forked_repo: mostForkedRepo,
      repo_topics: JSON.stringify(repoTopics),
      // Full repository data array (stored as JSON string)
      repositories: JSON.stringify(repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        open_issues_count: repo.open_issues_count,
        topics: repo.topics || [],
        is_fork: repo.fork,
        is_archived: repo.archived,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        default_branch: repo.default_branch,
        license: repo.license ? repo.license.name : null,
        homepage: repo.homepage
      }))),
      account_created_at: formatMySQLDate(userData.created_at),
      github_updated_at: formatMySQLDate(userData.updated_at)
    };

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '';

      if (status === 404) {
        const err = new Error(`GitHub user '${username}' not found`);
        err.status = 404;
        throw err;
      }

      if (status === 403 && message.toLowerCase().includes('rate limit')) {
        const err = new Error('GitHub API rate limit exceeded. Add a GITHUB_TOKEN in .env to get 5000 requests/hour');
        err.status = 403;
        throw err;
      }

      const err = new Error(message || 'GitHub API request failed');
      err.status = status;
      throw err;
    }
    throw error;
  }
}

module.exports = {
  fetchAndProcessProfile
};
