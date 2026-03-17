# Meta File Box

A modern file organizer and metadata manager built with **React** and **Supabase**. Upload any file type, add rich metadata (tags, categories, descriptions), search and browse your library, and preview files directly in the browser.

![Meta File Box](https://img.shields.io/badge/React-19-blue) ![Supabase](https://img.shields.io/badge/Supabase-Ready-green) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## 🚀 Deployment to Vercel

This project is configured for easy deployment on **Vercel**.

### 1. Push Code to GitHub
Ensure you have initialized git and committed your changes:
```bash
git init
git add .
git commit -m "Initial commit"
# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" -> "Project"**.
2. Import your GitHub repository.

### 3. Set Environment Variables (Crucial)
In the Vercel deployment settings, under **Environment Variables**, add the following:
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

These can be found in your Supabase Dashboard under **Project Settings -> API**.

---

## 🛠️ Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React 19, Vite 6  |
| Backend   | Supabase (Storage + Database) |
| Icons     | React Icons (Lucide/Feather) |
| Routing   | React Router 7    |
| Styling   | Vanilla CSS (Ultra-modern SaaS Aesthetic) |

## Features

- **File Upload** — Drag-and-drop or browse to upload any file type.
- **Metadata Management** — Add file name, tags, category, and description for each upload.
- **Dashboard** — Browse all files in a responsive card grid with dynamic neon tags.
- **Real-time Search** — Filter files instantly by name, tags, or category.
- **File Preview** — Two-panel preview page: view images, PDFs, videos, audio, and text inline.
- **Light & Dark Themes** — Toggle between themes with automatic persistence.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase locally
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Dev Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## License
MIT
