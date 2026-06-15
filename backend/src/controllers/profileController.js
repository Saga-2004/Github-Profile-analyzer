const db = require('../config/db');
const githubService = require('../services/githubService');

/**
 * Format system uptime in seconds to a human-readable format (e.g. 2h 15m 30s)
 * @param {number} seconds 
 * @returns {string}
 */
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

/**
 * Helper to parse JSON columns from MySQL database securely
 * @param {Object} profile 
 * @returns {Object}
 */
function parseProfileJsonColumns(profile) {
  if (!profile) return profile;
  
  const parsed = { ...profile };
  
  if (parsed.top_languages) {
    try {
      parsed.top_languages = typeof parsed.top_languages === 'string' 
        ? JSON.parse(parsed.top_languages) 
        : parsed.top_languages;
    } catch (e) {
      parsed.top_languages = {};
    }
  } else {
    parsed.top_languages = {};
  }

  if (parsed.repo_topics) {
    try {
      parsed.repo_topics = typeof parsed.repo_topics === 'string' 
        ? JSON.parse(parsed.repo_topics) 
        : parsed.repo_topics;
    } catch (e) {
      parsed.repo_topics = [];
    }
  } else {
    parsed.repo_topics = [];
  }

  // Parse repositories JSON column
  if (parsed.repositories) {
    try {
      parsed.repositories = typeof parsed.repositories === 'string'
        ? JSON.parse(parsed.repositories)
        : parsed.repositories;
    } catch (e) {
      parsed.repositories = [];
    }
  } else {
    parsed.repositories = [];
  }

  return parsed;
}

/**
 * Analyze a GitHub profile (fetch, parse repos, save/update in DB)
 * POST /api/profiles/analyze
 */
async function analyzeProfile(req, res, next) {
  const username = req.params.username || req.body.username;

  try {
    // 1. Perform a case-insensitive check to see if the user exists in DB
    const [existing] = await db.query(
      'SELECT id FROM github_profiles WHERE LOWER(username) = LOWER(?)',
      [username]
    );
    const isNew = existing.length === 0;

    // 2. Fetch statistics and process from GitHub API
    const data = await githubService.fetchAndProcessProfile(username);

    // 3. Insert or update the analyzed insights
    const upsertSql = `
      INSERT INTO github_profiles (
        username, name, bio, avatar_url, location, company, blog, email, twitter_username,
        public_repos, public_gists, followers, following, total_stars, total_forks,
        top_languages, most_starred_repo, most_forked_repo, repo_topics, repositories,
        account_created_at, github_updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        avatar_url = VALUES(avatar_url),
        location = VALUES(location),
        company = VALUES(company),
        blog = VALUES(blog),
        email = VALUES(email),
        twitter_username = VALUES(twitter_username),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        followers = VALUES(followers),
        following = VALUES(following),
        total_stars = VALUES(total_stars),
        total_forks = VALUES(total_forks),
        top_languages = VALUES(top_languages),
        most_starred_repo = VALUES(most_starred_repo),
        most_forked_repo = VALUES(most_forked_repo),
        repo_topics = VALUES(repo_topics),
        repositories = VALUES(repositories),
        account_created_at = VALUES(account_created_at),
        github_updated_at = VALUES(github_updated_at)
    `;

    const values = [
      data.username, data.name, data.bio, data.avatar_url, data.location,
      data.company, data.blog, data.email, data.twitter_username,
      data.public_repos, data.public_gists, data.followers, data.following,
      data.total_stars, data.total_forks, data.top_languages,
      data.most_starred_repo, data.most_forked_repo, data.repo_topics,
      data.repositories,
      data.account_created_at, data.github_updated_at
    ];

    await db.query(upsertSql, values);

    // 4. Retrieve the updated profile details from the DB
    const [result] = await db.query(
      'SELECT * FROM github_profiles WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    const savedProfile = parseProfileJsonColumns(result[0]);

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: 'Profile analyzed and saved successfully',
      isNew,
      data: savedProfile
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch all analyzed profiles with sort, search, and limit
 * GET /api/profiles
 */
async function getAllProfiles(req, res, next) {
  try {
    const allowedSortFields = ['followers', 'public_repos', 'total_stars', 'analyzed_at'];
    let sortBy = 'analyzed_at';

    if (allowedSortFields.includes(req.query.sort)) {
      sortBy = req.query.sort;
    }

    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) {
      limit = 50;
    } else if (limit > 100) {
      limit = 100;
    }

    let sql = 'SELECT * FROM github_profiles';
    const params = [];

    if (req.query.search) {
      sql += ' WHERE username LIKE ?';
      params.push(`%${req.query.search}%`);
    }

    sql += ` ORDER BY ${sortBy} DESC LIMIT ?`;
    params.push(limit);

    const [rows] = await db.query(sql, params);
    const parsedData = rows.map(profile => parseProfileJsonColumns(profile));

    res.status(200).json({
      success: true,
      count: parsedData.length,
      data: parsedData
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch single profile from DB by username (case-insensitive)
 * GET /api/profiles/:username
 */
async function getProfile(req, res, next) {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM github_profiles WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Analyze it first using POST /api/profiles/analyze'
      });
    }

    const profile = parseProfileJsonColumns(rows[0]);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a profile from DB by username (case-insensitive)
 * DELETE /api/profiles/:username
 */
async function deleteProfile(req, res, next) {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id FROM github_profiles WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Profile '${username}' not found`
      });
    }

    await db.query(
      'DELETE FROM github_profiles WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    res.status(200).json({
      success: true,
      message: `Profile '${username}' deleted successfully`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get API health and service status
 * GET /health
 */
async function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'OK',
    service: 'GitHub Profile Analyzer API',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime())
  });
}

module.exports = {
  analyzeProfile,
  getAllProfiles,
  getProfile,
  deleteProfile,
  getHealth
};
