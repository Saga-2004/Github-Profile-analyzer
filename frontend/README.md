# GitHub Profile Analyzer Frontend

## 📚 Overview
This is the **React** (Vite) + **Tailwind CSS** frontend for the GitHub Profile Analyzer project. It consumes the backend API to fetch and display detailed GitHub user profiles, including a comprehensive list of repositories with rich metadata.

## 🎨 Design System
- **Color Palette (Dark Theme)**
  - Background: `#0d1117`
  - Card background: `#161b22`
  - Border: `#30363d`
  - Primary text: `#e6edf3`
  - Secondary text: `#8b949e`
  - Accent / links: `#58a6ff`
- **Typography** – Google Font **"Inter"** (fallback: system sans-serif).
- **Responsive Layout** – Mobile‑first grid that adapts to 1‑column on small screens, 2‑column on medium, and 3‑column on large.

## 🛠️ Tech Stack
- **React 18** (hooks, functional components)
- **Vite** – fast dev server & bundler
- **Tailwind CSS 3** – utility‑first styling
- **Axios** – HTTP client for API calls
- **React Router v6** – optional routing (future‑proof)
- **React‑Query** – optional data fetching cache (not required but recommended)

## 📦 Project Structure
```
frontend/
├─ src/
│  ├─ components/
│  │   ├─ ProfileCard.jsx        # Shows basic user info
│  │   ├─ RepositoriesList.jsx   # Grid of repo cards with filters & sorting
│  │   └─ LoadingSpinner.jsx
│  ├─ pages/
│  │   └─ Home.jsx                # Main page that composes the components
│  ├─ App.jsx
│  ├─ index.css                  # Tailwind base + custom utilities (dark theme)
│  └─ main.jsx
├─ public/
│   └─ vite.svg
├─ vite.config.js                # Proxy /api to backend (port 3000)
├─ package.json
└─ README.md                     # <‑‑ you are reading this file
```

## ⚙️ Setup & Development
1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Configure environment** (optional)
   - Create a `.env` file if you need to override the default API base URL.
   - Example:
     ```env
     VITE_API_BASE=http://localhost:3000/api
     ```
3. **Start the dev server**
   ```bash
   npm run dev
   ```
   - The app will be served at `http://localhost:5173` and proxies API requests to `http://localhost:3000` automatically (see `vite.config.js`).

## 📦 Build for Production
```bash
npm run build
```
The static assets are emitted to `dist/`. Serve them with any static file server (e.g., `npx serve dist`).

## 🔧 Key Components
- **ProfileCard.jsx** – Displays avatar, name, bio, location, stats (followers, repos, stars, forks).
- **RepositoriesList.jsx** – Shows each repository card with:
  - Name (link to GitHub)
  - Description, language badge, star/fork counts, open‑issues count, topics tags.
  - Supports **search**, **sorting** (stars, forks, updated), and **language filtering**.
- **LoadingSpinner.jsx** – Reusable spinner shown while awaiting API responses.

## 📡 API Integration
All calls go through the proxy defined in `vite.config.js`:
```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```
The frontend expects the backend responses as documented in `backend/README.md`.

## 🧪 Testing
- Run the built‑in Vite test runner (if configured):
  ```bash
  npm run test
  ```
- Manual test: open the app, enter a GitHub username, and verify the profile and repository list render correctly.

## 📚 Further Improvements
- Add **React‑Query** for caching and background refetch.
- Implement **dark‑mode toggle** (currently fixed dark theme).
- Add **unit tests** with Jest + React Testing Library.
- Deploy to Netlify/Vercel with environment variables for the backend URL.

---
*Created with love for the Junior Node.js Developer assignment – a polished, production‑ready UI that showcases modern React + Tailwind best practices.*
