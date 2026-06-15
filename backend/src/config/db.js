const mysql = require('mysql2/promise');

let pool = null;

/**
 * Initializes the database connection pool.
 * If the database or the profile table do not exist, they are automatically created.
 */
async function connectDB() {
  if (pool) return pool;

  // DB config loaded from environment variables
  const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  try {
    // 1. Initial pool connection WITHOUT specifying database name
    const tempPool = mysql.createPool(poolConfig);

    // 2. Auto-create the database if it doesn't exist
    await tempPool.query('CREATE DATABASE IF NOT EXISTS github_analyzer');
    
    // Close the initial temporary pool
    await tempPool.end();

    // 3. Reconnect the pool WITH the database name
    pool = mysql.createPool({
      ...poolConfig,
      database: 'github_analyzer'
    });

    // 4. Ensure we are using the correct database and auto-create the table
    await pool.query('USE github_analyzer');

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS github_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(200),
        bio TEXT,
        avatar_url VARCHAR(500),
        location VARCHAR(200),
        company VARCHAR(200),
        blog VARCHAR(300),
        email VARCHAR(200),
        twitter_username VARCHAR(100),
        public_repos INT DEFAULT 0,
        public_gists INT DEFAULT 0,
        followers INT DEFAULT 0,
        following INT DEFAULT 0,
        total_stars INT DEFAULT 0,
        total_forks INT DEFAULT 0,
        top_languages JSON,
        most_starred_repo VARCHAR(300),
        most_forked_repo VARCHAR(300),
        repo_topics JSON,
        account_created_at DATETIME,
        github_updated_at DATETIME,
        analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableSql);

    return pool;
  } catch (error) {
    // Note: No extra console.log allowed here, error will be logged during startup initialization catch block
    throw error;
  }
}

module.exports = {
  connectDB,
  /**
   * Helper query function to execute queries using the active connection pool.
   */
  query: async (sql, params) => {
    if (!pool) {
      throw new Error('Database pool not initialized. Call connectDB() first.');
    }
    return pool.query(sql, params);
  },
  /**
   * Returns the underlying connection pool.
   */
  getPool: () => pool
};
