

# 📦 Meta File Box (Supabase Edition)

> A modern, full-stack file management system with cloud storage, metadata organization, and a sleek SaaS-style dashboard.

---

## ✨ Overview

**Meta File Box** is a high-performance file organizer built for speed, scalability, and clean user experience.
It allows users to upload, manage, preview, and organize files using metadata — all inside a modern web interface.

This version integrates **Supabase** for database and storage, making it production-ready and cloud-native.

---

## 🚀 Features

* 📁 Upload & manage files بسهولة
* 🏷️ Metadata-based organization (tags, categories, descriptions)
* 🔍 File preview support (PDF, images, etc.)
* ⚡ Fast and responsive UI (React + Vite)
* 🔐 Secure backend with authentication
* ☁️ Cloud storage via Supabase
* 🐳 One-command deployment using Docker

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React.js + Vite                |
| Backend    | Django + Django REST Framework |
| Database   | PostgreSQL (Supabase)          |
| Storage    | Supabase Storage               |
| Deployment | Docker & Docker Compose        |
| Web Server | Nginx                          |

---

## 📂 Project Structure

```
Meta-File-Box_Supabase/
│
├── frontend/        # React frontend
├── backend/         # Django backend
├── nginx/           # Nginx configuration
├── docker-compose.yml
├── .env             # Environment variables (not included in repo)
└── README.md
```

---

## 🔐 Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Django
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@host:port/dbname

# Config
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend
```

---

## 🐳 Run with Docker (Recommended)

### ▶️ Start Application

```bash
docker compose up --build -d
```

### 🛑 Stop Application

```bash
docker compose down
```

---

## 💻 Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

---

## 🔒 Security & Production

* No secrets stored in repo (.env required)
* Backend protected via Django settings
* Nginx used for:

  * API routing (`/api`)
  * Static file serving
* Docker ensures isolated and consistent environments

---

## 📸 Screenshots (Add this later)

> Add UI screenshots here to improve recruiter visibility

---

## 📌 Future Improvements

* 🔐 User authentication (JWT / OAuth)
* 📊 File analytics dashboard
* 🤖 AI-based file tagging (future upgrade)
* 📱 Mobile responsive improvements

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Shanmugaraj**
BSc Computer Science Student
Aspiring Python Full Stack Developer



If you want next:

* I’ll generate **README badges (cool GitHub UI look)**
* Add **project screenshots section properly**
* Help you write **resume line for this project** 🚀
