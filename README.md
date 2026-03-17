# Meta File Box

A modern file organizer and metadata manager built with **React** and **Firebase** (Storage + Firestore). Upload any file type, add rich metadata (tags, categories, descriptions), search and browse your library, and preview files directly in the browser.

![Meta File Box](https://img.shields.io/badge/React-19-blue) ![Firebase](https://img.shields.io/badge/Firebase-11-orange) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## Features

- **File Upload** — Drag-and-drop or browse to upload any file type (PDFs, images, videos, docs, archives, etc.)
- **Metadata Management** — Add file name, tags, category, and description for each upload
- **Dashboard** — Browse all files in a responsive card grid with file-type icons
- **Real-time Search** — Filter files instantly by name, tags, or category
- **File Preview** — Two-panel preview page: view images, PDFs, videos, audio, and text inline; download or open unsupported formats
- **Light & Dark Themes** — Toggle between themes with automatic persistence
- **Responsive Design** — Works on desktop and mobile with a collapsible sidebar

## Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React 19, Vite 6  |
| Backend   | Firebase Storage, Firestore |
| Icons     | React Icons (Font Awesome) |
| Routing   | React Router 7    |
| Fonts     | Inter (Google Fonts) |

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- A **Firebase project** with Storage and Firestore enabled

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Edit `public/firebase.json` with your Firebase project credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

> **Important:** Make sure Firestore and Storage are enabled in your Firebase Console. For Firestore, create a database in **test mode** (or configure security rules). For Storage, set up default rules.

### 3. Run the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── FileCard.jsx    # File card for dashboard grid
│   ├── FileIcon.jsx    # Icon renderer by file extension
│   ├── Header.jsx      # Top bar with search & theme toggle
│   ├── Layout.jsx      # App shell with sidebar + header
│   └── Sidebar.jsx     # Navigation sidebar
├── hooks/            # Custom React hooks
│   ├── useFiles.js     # Fetch files from Firestore
│   └── useTheme.jsx    # Theme context & toggle
├── pages/            # Route pages
│   ├── DashboardPage.jsx  # File grid with search
│   ├── PreviewPage.jsx    # Two-panel file preview
│   └── UploadPage.jsx     # Upload form
├── services/         # Backend integration
│   └── firebase.js     # Firebase init, upload, CRUD
├── styles/           # Global styles
│   └── index.css       # Design system & components
├── utils/            # Utilities
│   └── fileHelpers.js  # Icon maps, type detection
├── App.jsx           # Router & theme provider
└── main.jsx          # Entry point
```

## Firestore Data Model

Each uploaded file creates a document in the `files` collection:

```json
{
  "fileName": "Q1_Report.pdf",
  "tags": ["report", "finance", "Q1"],
  "category": "Documents",
  "description": "Quarterly financial summary",
  "fileURL": "https://firebasestorage.googleapis.com/...",
  "uploadDate": "2026-03-14T16:15:00.000Z",
  "fileType": "pdf"
}
```

## License

MIT
