# GitHub Profile Analyzer

## 🔗 Live URLs
- **Backend**: https://github-profile-analyzer-production-e978.up.railway.app/health
- **Frontend**: https://github-profile-analyzer-pink-nu.vercel.app

![GitHub Profile Analyzer Demo](https://raw.githubusercontent.com/your/repo/main/docs/demo.gif)

## 📚 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Layout](#project-layout)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configure Environment](#configure-environment)
  - [Run the Application](#run-the-application)
- [How It Works](#how-it-works)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## 📖 Overview
A **production‑ready full‑stack** application that analyzes any GitHub user's profile, computes repository insights, and stores the results in a MySQL database. It showcases clean architecture, a dark‑mode UI, and robust API design.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS (dark mode)
- **Backend**: Node.js 18+, Express 4, MySQL (`mysql2/promise`)
- **Deployment**: Railway (backend) • Vercel (frontend)
- **Testing & Linting**: Jest, ESLint, Prettier

## 📸 Screenshots
![Demo Screenshot](https://raw.githubusercontent.com/your/repo/main/docs/demo.gif)

## 📂 Project Layout
```text
github-profile-analyzer/
├─ backend/        # Express API, MySQL integration
├─ frontend/       # React + Vite + Tailwind UI
├─ README.md       # This file
└─ .gitignore
```

### Backend (`backend/`)
- **Node.js 18+**, **Express 4**
- **MySQL** via `mysql2/promise`
- Automatic database and table creation on startup
- Secure endpoints with **helmet**, **cors**, and **express‑validator**
- Comprehensive health check and detailed error handling

### Frontend (`frontend/`)
- **React 18**, **Vite**, **Tailwind CSS**
- Dark‑mode UI matching GitHub’s design tokens
- Repository list with client‑side filtering, sorting, and debounced search
- Re‑usable components: `ProfileCard`, `RepositoriesList`, `LanguageChart`

## 🚀 Getting Started
### Prerequisites
- Node.js (v18 or newer)
- MySQL server (v8+)
- (Optional) GitHub personal access token for higher rate limits

### Installation
```bash
git clone https://github.com/your/repo.git
cd github-profile-analyzer
npm run install-all   # Installs backend & frontend dependencies
```

### Configure Environment
```bash
# Backend env
cp backend/.env.example backend/.env
# Frontend env (if needed)
cp frontend/.env.example frontend/.env
```
Edit the `.env` files to provide your MySQL credentials and optional GitHub token.

### Run the Application
```bash
# Start backend API
npm start --prefix backend   # API on http://localhost:3000
# Start frontend UI
npm run dev --prefix frontend # UI on http://localhost:5173
```
Open the frontend URL in a browser, enter a GitHub username, and explore the analytics.

## 🛠️ How It Works
1. **Frontend** collects a GitHub username and requests profile data from the backend.
2. **Backend** calls the GitHub REST API, processes repositories, languages, and topics.
3. Statistics are stored in MySQL and returned as JSON.
4. The frontend renders components such as `ProfileCard`, `RepositoriesList`, and `LanguageChart`.
5. Security is ensured with Helmet, CORS, and input validation via `express‑validator`.

## ✨ Features
- Full repository export (JSON)
- Top languages chart with custom colors
- Most starred / most forked repo cards with direct links
- Topic pills with “+N more” badge
- Client‑side filtering & sorting (stars, forks, date)
- Debounced search (300 ms) for smooth UX
- Robust API with health endpoint, pagination, and search
- Automatic DB migration on first run

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Ensure linting passes (`npm run lint`)
4. Open a Pull Request with a clear description

## 📄 License
MIT © 2026 Your Name

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-success)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8%2B-blue)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
