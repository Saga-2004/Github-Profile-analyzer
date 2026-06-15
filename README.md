# GitHub Profile Analyzer

A production-ready full-stack application featuring a Node.js Express backend API and a React + Tailwind CSS frontend dashboard. The application analyzes GitHub user profiles, calculates repository statistics, and caches insights in a MySQL database.

---

## 📁 Project Structure

The project is structured into two separate, self-contained directories:

*   **`backend/`:** Node.js, Express, and raw SQL queries using `mysql2`. Features auto-creation of database structures, CORS integration, and custom request logging.
*   **`frontend/`:** React 18, Vite, Tailwind CSS, and Axios. Features a complete dark UI, responsive grids, statistics charts, and client-side list filtering.

---

## 🚀 How to Run the Application

To run the application locally, you will need two separate terminal windows.

### Step 1: Set Up and Start the Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment settings:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and fill in your MySQL credentials and (optionally) your GitHub token:
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    GITHUB_TOKEN=your_github_personal_access_token
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    *(The backend will run on `http://localhost:3000` and automatically create the database `github_analyzer` and table `github_profiles` if they do not exist)*

### Step 2: Set Up and Start the Frontend

1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React dev server:
    ```bash
    npm run dev
    ```
4.  Open the application in your browser:
    [http://localhost:5173](http://localhost:5173)

---

## 📋 Features & Design Details

*   **Dark Theme:** Employs GitHub's native design tokens (Background: `#0d1117`, Card: `#161b22`, Text: `#e6edf3`).
*   **Analysis Engine:** Processes repositories on-the-fly to calculate stars, forks, top 5 languages (rendered in a beautiful custom visual chart), and unique topics.
*   **Database Synchronization:** Saves every query to the local MySQL database using upsert SQL logic. Keeps track of historic queries inside the **All Profiles** dashboard.
*   **Search Page Navigation:** Selecting a username row inside the profiles list redirects to the home search page and automatically triggers a fresh live API fetch.
