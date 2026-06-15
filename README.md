# GitHub Profile Analyzer

![GitHub Profile Analyzer Demo](https://raw.githubusercontent.com/your/repo/main/docs/demo.gif)

A **production‑ready full‑stack** application that analyzes any GitHub user's profile, computes repository insights, and stores the results in a MySQL database. The project showcases clean architecture, modern UI/UX with a dark theme, and a robust Node.js backend.

---

## 📂 Project Layout

```
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

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- MySQL server (v8+)
- (Optional) GitHub personal access token for higher rate limits

### 1️⃣ Clone & Install
```bash
git clone https://github.com/your/repo.git
cd github-profile-analyzer
npm run install-all   # Installs both backend & frontend dependencies
```

### 2️⃣ Configure Environment
```bash
# Backend env
cp backend/.env.example backend/.env
# Frontend env (if needed)
cp frontend/.env.example frontend/.env
```
Edit the `.env` files and provide your MySQL credentials and GitHub token.

### 3️⃣ Run the Application
```bash
# In one terminal
npm start --prefix backend   # Starts API on http://localhost:3000
# In another terminal
npm run dev --prefix frontend # Starts UI on http://localhost:5173
```
Open the UI, search for any GitHub username, and explore the rich analytics.

---

## ✨ Features
- **Full repository export** – all repo data stored as JSON for later analysis
- **Top languages chart** with custom color mapping
- **Most starred / most forked repo** cards with direct links
- **Topic pills** with “+N more” badge when exceeding 5 topics
- **Client‑side filtering & sorting** (stars, forks, updated date)
- **Debounced search** (300 ms) for smooth UI
- **Robust API** with health endpoint, pagination, and search
- **Automatic DB migration** – adds missing `repositories` column on existing installs

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Ensure linting passes (`npm run lint`)
4. Open a Pull Request with a clear description

---

## 📄 License
MIT © 2026 Your Name
