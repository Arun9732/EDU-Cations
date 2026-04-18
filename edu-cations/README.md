# 🎓 EDU-Cations — Full Stack Learning Platform

A curated YouTube video learning platform for Class 9–12 students, built with:
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Admin Panel**: Full CRUD for videos, chapters, users

---

## 📁 Project Structure

```
edu-cations/
├── backend/
│   ├── config/
│   │   ├── db.js           ← MongoDB connection
│   │   └── seed.js         ← Seed initial data
│   ├── middleware/
│   │   └── auth.js         ← JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Class.js
│   │   ├── Chapter.js
│   │   ├── Video.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── auth.js         ← /api/auth
│   │   ├── classes.js      ← /api/classes
│   │   ├── chapters.js     ← /api/chapters
│   │   ├── videos.js       ← /api/videos
│   │   ├── progress.js     ← /api/progress
│   │   └── admin.js        ← /api/admin (protected)
│   ├── .env
│   ├── package.json
│   └── server.js           ← Main entry point
└── frontend/
    └── public/
        ├── index.html      ← Main app (SPA)
        ├── css/
        │   └── style.css
        └── js/
            └── app.js      ← All frontend logic
```

---

## 🚀 Setup Instructions

### Step 1 — Install MongoDB
Make sure MongoDB is installed and running locally:
- **Windows**: https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt install mongodb`

Start MongoDB:
```bash
mongod
```

### Step 2 — Install Dependencies
```bash
cd edu-cations/backend
npm install
```

### Step 3 — Configure Environment
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/edu-cations
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

### Step 4 — Seed the Database
This creates all classes, chapters, videos, and an admin account:
```bash
cd backend
npm run seed
```

**Admin credentials after seeding:**
- Email: `admin@edu-cations.com`
- Password: `admin123`

### Step 5 — Start the Server
```bash
npm run dev      # Development (with auto-restart via nodemon)
# OR
npm start        # Production
```

### Step 6 — Open in Browser
```
http://localhost:5000
```

---

## 🔑 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/classes | Get all classes |
| GET | /api/classes/:number | Get class by number |
| GET | /api/chapters?classNumber=10&subject=Mathematics | Get chapters |
| GET | /api/chapters/subjects/:classNumber | Get subjects for class |
| GET | /api/chapters/:id | Get single chapter |
| GET | /api/videos?chapterId=xxx | Get videos for chapter |

### Auth Required
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register student |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/progress | Get my progress |
| POST | /api/progress/video | Mark video watched |
| POST | /api/progress/complete | Mark chapter complete |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET/POST/PUT/DELETE | /api/admin/videos | Manage videos |
| GET/POST/PUT/DELETE | /api/admin/chapters | Manage chapters |
| GET | /api/admin/users | View all students |

---

## ✨ Features

- **4 Classes** (9–12) with subjects & chapters
- **Curated YouTube Videos** with thumbnails, creator credits
- **Student Auth** — register, login, JWT sessions
- **Progress Tracking** — mark videos watched, chapters complete
- **Admin Panel** — add/edit/delete videos & chapters without touching code
- **Auto-thumbnail** — paste YouTube URL → thumbnail auto-fills
- **Fully Responsive** — works on mobile & desktop
- **"Ab kya karo?"** — next steps after every chapter in Hinglish

---

## 🎯 How to Add More Content (Admin)

1. Go to `http://localhost:5000` and login as admin
2. Click **⚙ Admin** in navbar
3. Click **+ Add Chapter** to create a new chapter
4. Click **+ Add Video** to add YouTube videos to any chapter
5. Paste the YouTube URL — thumbnail auto-fills!

---

## 🌐 Deploy to Production

### Option A — Free Hosting
- **Frontend + Backend**: [Railway](https://railway.app) or [Render](https://render.com)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com) (free 512MB)

### Option B — VPS
```bash
# Install PM2
npm install -g pm2

# Start server
cd backend
pm2 start server.js --name edu-cations

# Setup Nginx as reverse proxy to port 5000
```

### Update .env for production:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/edu-cations
JWT_SECRET=very-long-random-secret-key-here
NODE_ENV=production
PORT=5000
```

---

## 💡 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, CSS3, Vanilla JS (no framework) |
| Backend | Node.js 18+, Express.js 4 |
| Database | MongoDB 6+ with Mongoose ODM |
| Auth | bcryptjs + JWT |
| Dev Tool | nodemon |

---

Made with ❤️ for students of India.  
All video credits go to their respective YouTube creators.
