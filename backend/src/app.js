require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const profileController = require('./controllers/profileController');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://github-profile-analyzer-pink-nu.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Security and parsing middleware
app.use(helmet());
app.use(express.json());

// Custom request logger middleware matching exact requirements
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const now = new Date();
    
    // Custom date pad helper to format timestamp: YYYY-MM-DD HH:mm:ss
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Top-level Health endpoint
app.get('/health', profileController.getHealth);

// Mount profile routes
app.use('/api/profiles', profileRoutes);

// Fallback 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection initialization and starting server listener
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('🚀 GitHub Profile Analyzer API is running!');
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log('💾 Database: Connected successfully');
      console.log('📖 Docs: See README.md for API usage');
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();
