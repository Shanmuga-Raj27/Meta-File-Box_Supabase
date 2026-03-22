
# 📦 Meta File Box (Supabase Edition)

**Meta File Box** is a modern, full-stack file management system built for performance, scalability, and a clean user experience.
It allows users to upload, organize, and preview files using metadata — all inside a unified web application.

This project follows a **production-ready architecture** using Docker, Supabase, and Nginx, making it suitable for real-world deployment.

---

## ✨ Key Features

* 📁 Upload, store, and manage files
* 🏷️ Organize files using metadata (tags, categories, descriptions)
* 🔍 Preview files (PDFs, images, etc.) directly in browser
* ⚡ Fast and responsive UI using modern frontend tools
* 🔐 Secure backend with environment-based configuration
* ☁️ Cloud storage using Supabase
* 🐳 One-command deployment using Docker
* 🌐 Nginx-based routing for clean API handling

---

## 🚀 Tech Stack

* **Frontend**: React.js + Vite
* **Backend**: Django + Django REST Framework
* **Database**: PostgreSQL (via Supabase)
* **Storage**: Supabase Storage
* **Containerization**: Docker & Docker Compose
* **Web Server**: Nginx

---

## 📂 Project Structure

> ⚠️ Note: This project uses a **unified structure** — all components are inside a single root folder.

```id="k2r6n8"
Meta-File-Box_Supabase/
│
├── backend/              # Django backend (APIs, logic, auth)
├── frontend_build/       # Built frontend files (served by Nginx)
├── nginx/                # Nginx configuration
├── docker-compose.yml    # Container orchestration
├── Dockerfile            # Backend container setup
├── .env                  # Environment variables (not included)
├── requirements.txt      # Python dependencies
└── README.md
```

---

## 🔐 Environment Configuration

For security reasons, sensitive data is not stored in the repository.
Create a `.env` file in the root directory with the following:

```env id="imn3dl"
# === Supabase Configuration ===
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# === Backend Configuration ===
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@host:port/dbname

# === Deployment Configuration ===
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend
```

---

## 🐳 Run with Docker (Recommended)

This is the easiest and fastest way to run the project.

### ▶️ Start Application

```bash id="ppr3ap"
docker compose up --build -d
```

### 🛑 Stop Application

```bash id="0gjmp9"
docker compose down
```

---

## 💻 Local Development (Without Docker)

### Backend Setup

```bash id="c6xq9u"
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup (Development)

> If you are modifying frontend separately before build:

```bash id="6x63fm"
npm install
npm run dev
```

---

## 🏗️ Deployment Guide

### Windows (10/11)

* Install **Docker Desktop**
* Open PowerShell in project folder
* Run:

```bash id="b9aj1k"
docker compose up --build -d
```

---

### Linux (Ubuntu / Debian / CentOS)

#### Install Docker

```bash id="y8k1ke"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Run Project

```bash id="m8u7f6"
sudo docker compose up --build -d
```

> ✅ Use `docker compose` (modern) instead of `docker-compose`

---

## 🔒 Security & Production Features

* 🔐 Secrets stored securely using `.env` file
* 🚫 No sensitive data committed to GitHub
* 🌐 Nginx proxies `/api` requests internally (no CORS issues)
* ⚡ Optimized static file serving
* 🐳 Docker ensures consistent environment across systems
* 🧩 Backend and frontend integrated into single deployable system

---

## 📌 Future Improvements

* 🔐 Full authentication system (JWT / OAuth)
* 📊 Dashboard analytics for file usage
* 🤖 AI-based file tagging and search
* 📱 Improved mobile responsiveness
* 🌍 Public file sharing with permissions

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Shanmugaraj**
BSc Computer Science Student
Aspiring Full Stack Developer

