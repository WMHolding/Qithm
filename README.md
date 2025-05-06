# Qithm - Fitness Challenge Platform

## Website
🌐 **Live Demo**: [http://qithm.onrender.com](http://qithm.onrender.com)

## Project Structure
```
Qithm/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── championshipController/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Challenge.js
│   │   ├── Championship.js
│   │   ├── PrivateChat.js
│   │   └── User.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── authRoutes.js
│   │   ├── challenges.js
│   │   └── championships.js
│   ├── index.js
│   ├── socket.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── styles/
    ├── index.html
    └── package.json
```

## Setup Instructions

### Backend Setup
1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create .env file with required environment variables
```env
MONGODB_URI="mongodb+srv://abdulrahmanalzamil10:LZffacijWLFDNf9O@cluster0.jqvepkn.mongodb.net/Qithm?retryWrites=true&w=majority&appName=Cluster0"
PORT=3000
JWT_SECRET="=[-lp0ug7yf6t34r6p['[';p0de/\]'.-[;d/=]\'.-[;0p,lm9okn8ibuh6vyg5ctf]]]"
```

4. Start the server
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO for real-time chat
- JWT Authentication

### Frontend
- React
- Vite
- React Router DOM
- Socket.IO Client

## Features
- User Authentication
- Fitness Challenges
- Championships
- Real-time Chat
- Progress Tracking
- Leaderboard System

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login

### Challenges
- GET `/api/challenges` - Get all challenges
- POST `/api/challenges/enroll` - Enroll in challenge

### Championships
- GET `/api/championships` - Get championships
- POST `/api/championships/enroll` - Enroll in championship

### Profile
- GET `/api/profile/:userId` - Get profile
- PUT `/api/profile/:userId` - Update profile



## Developers
- Abdullah Alhydary
- Abdulrahman Alzamil
- Basim Alasmari
- Abdulaziz Alharthi
- Mohammed Aldahash

---

## 🎯 Seperate Pages (Prototypes)

These pages are currently **not** hooked up to the main web app as it would require back‑end implementation. 
Therefore, we have provided them seperately! They can only be accessed directly by URL:

| Page              | URL Path                   | Description                           |
| ----------------- | -------------------------- | ------------------------------------- |
| Coach View        | `/coach`                   | Prototype of the coach’s view page.   |
| Coach Dashboard   | `/coach-dashboard`         | Prototype of the coach dashboard.     |
| Admin Dashboard   | `/admin`                   | Prototype of the admin dashboard.     |

> **Example:**
> ```
> http://localhost:3000/coach
> http://localhost:3000/coach-dashboard
> http://localhost:3000/admin
> ```

---



